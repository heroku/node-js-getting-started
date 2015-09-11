/* jshint node:true */

var bson = require('bson');
var BSON = bson.BSONPure.BSON;

module.exports = function(options, iteratorFn, finalFn) {
  var maxDocumentSize = options.maxDocumentSize || (1024 * 1024 * 16);
  var stream = options.from || process.stdin;
  var buffer = new Buffer((options.maxDocLen || maxDocumentSize) * 3);
  var readPos = 0;
  var writePos = 0;
  var retry;
  var closed;
  var paused = false;

  stream.on('data', function(chunk) {
    var needed = writePos + chunk.length;
    var size = buffer.length;
    if (needed > size) {
      while (needed > size) {
        size *= 2;
      }
      var _buffer = new Buffer(size);
      buffer.copy(_buffer);
      buffer = _buffer;
    }
    chunk.copy(buffer, writePos);
    writePos += chunk.length;
    // high water mark = pause
    if (writePos >= maxDocumentSize * 2) {
      stream.pause();
      paused = true;
    }
    if (retry) {
      var _retry = retry;
      retry = null;
      return _retry();
    }
  });

  stream.on('end', function() {
    if (retry) {
      return retry('eof');
    }
    closed = true;
  });

  stream.on('error', function(err) {
    return finalFn(err);
  });

  function ensureInt32(callback) {
    return ensureBytes(4, function(err) {
      if (err) {
        return callback(err);
      }
      return callback(null, (buffer[readPos]) + (buffer[readPos + 1] << 8) + (buffer[readPos + 2] << 16) + (buffer[readPos + 3] << 24));
    });
  }

  function ensureBytes(length, callback) {
    if (readPos + length <= writePos) {
      return callback(null);
    }
    if (closed) {
      return callback(new Error('Premature end of stream'));
    }
    retry = function(err) {
      if (err) {
        return callback(err);
      }
      return ensureBytes(length, callback);
    }
  }

  function loadAndHandleDocument() {
    if (closed && (readPos === writePos)) {
      // End of stream arrived at document boundary, that's OK
      return finalFn(null);
    }
    return ensureInt32(function(err, size) {
      if (err === 'eof') {
        if (readPos === writePos) {
          // End of stream arrived while waiting for
          // the start of the next document, that's OK
          return finalFn(null);
        } else {
          return finalFn(new Error("Unexpected bytes at end of stream"));
        }
      }
      if (err) {
        return finalFn(err);
      }
      return ensureBytes(size, function(err) {
        if (err) {
          if (err === 'eof') {
            return finalFn(new Error("Unexpected data at end of stream"));
          }
          return finalFn(err);
        }
        var document = new Buffer(buffer.slice(readPos, readPos + size));
        if (document[document.length - 1] !== 0) {
          return finalFn(new Error('document is not null terminated'));
        }

        readPos += size;
        if (readPos > maxDocumentSize) {
          buffer.copy(buffer, 0, readPos, writePos);
          writePos = writePos - readPos;
          readPos = 0;
        }
        if (paused && (writePos - readPos < maxDocumentSize)) {
          // low water mark = resume
          stream.resume();
          paused = false;
        }
        if (!options.raw) {
          document = BSON.deserialize(document);
        }
        return iteratorFn(document, function(err) {
          if (err) {
            return finalFn(err);
          }
          if (closed && (readPos === writePos)) {
            // End of stream event arrived while we were
            // processing the last document, that's OK
            return finalFn(null);
          }
          return loadAndHandleDocument();
        });
      });
    });
  }
  loadAndHandleDocument();
};

