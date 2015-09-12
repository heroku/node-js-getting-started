/* jshint node:true */

var async = require('async');
var _ = require('lodash');
var bson = require('bson');
var BSON = bson.BSONPure.BSON;
var fs = require('fs');
var mongodb = require('mongodb');
var util = require('util');
var buffertools = require('buffertools');
var crypto = require('crypto');
var reader = require('read-async-bson');

module.exports = {
  // If you leave out "stream" it'll be stdout
  dump: function(dbOrUri, stream, callback) {
    if (arguments.length === 2) {
      callback = stream;
      stream = undefined;
    }
    if (!stream) {
      stream = process.stdout;
    }
    var db;
    var out = stream;
    var endOfCollection = crypto.pseudoRandomBytes(8).toString('base64');
    write({
      type: 'mongo-dump-stream',
      version: '2',
      endOfCollection: endOfCollection
    });
    return async.series({
      connect: function(callback) {
        if (typeof(dbOrUri) !== 'string') {
          // Already a mongodb connection
          db = dbOrUri;
          return setImmediate(callback);
        }
        return mongodb.MongoClient.connect(dbOrUri, function(err, _db) {
          if (err) {
            return callback(err);
          }
          db = _db;
          return callback(null);
        });
      },
      getCollections: function(callback) {
        return db.collections(function(err, _collections) {
          if (err) {
            return callback(err);
          }
          collections = _collections;
          return callback(null);
        });
      },
      dumpCollections: function(callback) {
        return async.eachSeries(collections, function(collection, callback) {
          if (collection.collectionName.match(/^system\./)) {
            return setImmediate(callback);
          }
          return async.series({
            getIndexes: function(callback) {
              return collection.indexInformation({ full: true }, function(err, info) {
                if (err) {
                  return callback(err);
                }
                write({
                  type: 'collection',
                  name: collection.collectionName,
                  indexes: info
                });
                return callback(null);
              });
            },
            getDocuments: function(callback) {
              var cursor = collection.find({}, { raw: true });
              iterate();
              function iterate() {
                return cursor.nextObject(function(err, item) {
                  if (err) {
                    return callback(err);
                  }
                  if (!item) {
                    write({
                      // Ensures we don't confuse this with
                      // a legitimate database object
                      endOfCollection: endOfCollection
                    });
                    return callback(null);
                  }
                  // v2: just a series of actual data documents
                  out.write(item);

                  // If we didn't have the raw BSON document,
                  // we could do this instead, but it would be very slow
                  // write({
                  //   type: 'document',
                  //   document: item
                  // });

                  return setImmediate(iterate);
                });
              }
            },
          }, callback);
        }, callback);
      },
      endDatabase: function(callback) {
        write({
          type: 'endDatabase'
        }, callback);
      }
    }, function(err) {
      if (err) {
        return callback(err);
      }
      return callback(null);
    });
    function write(o, callback) {
      out.write(BSON.serialize(o, false, true, false), callback);
    }
  },
  // If you leave out "stream" it'll be stdin
  load: function(dbOrUri, stream, callback) {
    var db;
    if (arguments.length === 2) {
      callback = stream;
      stream = undefined;
    }
    if (!stream) {
      stream = process.stdin;
    }

    var state = 'start';
    var version;
    var collection;
    var endOfCollection;
    var insertQueue = [];
    var insertQueueSize = 0;

    // State machine

    var processors = {
      start: function(item, callback) {
        try {
          item = BSON.deserialize(item);
        } catch (e) {
          return callback(e);
        }
        if (typeof(item) !== 'object') {
          return callback(new Error('First BSON element is not an object'));
        }
        if (item.type !== 'mongo-dump-stream') {
          return callback(new Error('type property is not mongo-dump-stream'));
        }
        version = item.version;
        if (item.version > 2) {
          return callback(new Error('Incoming mongo-dump-stream is of a newer version, bailing out'));
        }
        endOfCollection = item.endOfCollection;
        state = 'collection';
        return callback(null);
      },
      collection: function(item, callback) {
        try {
          item = BSON.deserialize(item);
        } catch (e) {
          return callback(e);
        }
        if (item.type === 'endDatabase') {
          state = 'done';
          return callback(null);
        }
        if (item.type !== 'collection') {
          return callback(new Error('collection expected'));
        }
        var name = item.name;
        var indexes = item.indexes;
        async.series({
          create: function(callback) {
            return db.collection(name, function(err, _collection) {
              if (err) {
                return callback(err);
              }
              collection = _collection;
              return callback(null);
            });
          },
          indexes: function(callback) {
            return async.eachSeries(item.indexes, function(item, callback) {
              if (item.name === '_id_') {
                // automatic
                return setImmediate(callback);
              }
              return collection.ensureIndex(item.key, _.omit(item, 'ns', 'key'), callback);
            }, callback);
          }
        }, function(err) {
          if (err) {
            return callback(err);
          }
          state = 'documents';
          return callback(null);
        });
      },
      documents: function(item, callback) {
        if (version === '1') {
          item = BSON.deserialize(item);
          if (item.type === 'endCollection') {
            state = 'collection';
            return setImmediate(callback);
          }
          if (item.type !== 'document') {
            return callback(new Error('Document expected'));
          }
          return collection.insert(item.document, callback);
        }

        // Just scan for the unique random string that
        // appears in the end-of-collection object. No need
        // to waste time parsing BSON for this. Also
        // leverage the fact that it won't ever be
        // part of a large object to avoid scanning them all
        if (item.length < 100) {
          if (buffertools.indexOf(item, endOfCollection) !== -1) {
            return flush(function(err) {
              if (err) {
                return callback(err);
              }
              state = 'collection';
              return callback(null);
            });
          }
        }
        return async.series({
          flushIfNeeded: function(callback) {
            if (insertQueueSize + item.length <= 16777216) {
              return setImmediate(callback);
            }
            return flush(callback);
          },
          insertInQueue: function(callback) {
            insertQueueSize += item.length;
            insertQueue.push(item);
            return setImmediate(callback);
          }
        }, callback);

        function flush(callback) {
          if (!insertQueue.length) {
            // MongoDB considers it an error to be asked
            // to insert 0 documents ):
            return setImmediate(callback);
          }
          // watch out for race condition
          var insert = insertQueue;
          insertQueue = [];
          insertQueueSize = 0;
          return collection.insert(insert, function(err) {
            insertQueue = [];
            return callback(err);
          });
        }
      }
    };

    return async.series({
      connect: function(callback) {
        if (typeof(dbOrUri) !== 'string') {
          // Already a mongodb connection
          db = dbOrUri;
          return setImmediate(callback);
        }
        return mongodb.MongoClient.connect(dbOrUri, function(err, _db) {
          if (err) {
            return callback(err);
          }
          db = _db;
          return callback(null);
        });
      },
      dropCollections: function(callback) {
        return db.collections(function(err, collections) {
          if (err) {
            return callback(err);
          }
          return async.eachSeries(collections, function(item, callback) {
            if (item.collectionName.match(/^system\./)) {
              return setImmediate(callback);
            }
            return item.drop(callback);
          }, callback);
        });
      },
      loadCollections: function(finalCallback) {
        return reader({ raw: true, from: stream }, function(doc, callback) {
          return processors[state](doc, function(err) {
            if (err) {
              return callback(err);
            }
            if (state === 'done') {
              return finalCallback(null);
            }
            return callback(null);
          });
        }, function(err) {
          if (err) {
            return finalCallback(err);
          }
          return finalCallback(new Error('Premature end of stream'));
        });
      }
    }, callback);
  }
};
