[![Build Status](https://travis-ci.org/punkave/read-async-bson.svg?branch=master)](https://travis-ci.org/punkave/read-async-bson)

<a href="http://apostrophenow.org/"><img src="https://raw.githubusercontent.com/punkave/read-async-bson/master/logos/logo-box-madefor.png" align="right" /></a>

# read-async-bson

## What's it do?

Let's read a stream of BSON documents from standard input, passing each one through a callback and waiting patiently until that callback is finished with its work:

```javascript
var reader = require('read-async-bson');

return reader(
  { from: process.stdin },
  function(item, callback) {
    // One BSON document, converted as a JavaScript object
    console.log(item);
    return callback(null);
  },
  function(err) {
    // Called on error or at end of stream
    if (!err) {
      console.log('end of stream');
    } else {
      console.error(err);
    }
  }
);
```

`read-async-bson` reads incoming [BSON](http://bsonspec.org/spec.html) documents from any node stream, and invokes a callback for each one. **Documents are delivered one at a time.** The next document will not be delivered until you invoke a callback to signal that you have handled the previous one.

When an error occurs, or the end of the stream is reached, a final callback is invoked.

## What exactly is a "stream of BSON documents"?

Documents in the [BSON](http://bsonspec.org/spec.html) format, concatenated end to end.

## But what about writing BSON streams?

That is already easy without any help from me:

```javascript
var bson = require('bson');
var BSON = bson.BSONPure.BSON;

var stream = process.stdout;

var data = [ ... tons and tons of objects ... ]
data.forEach(function(item) {
  stream.write(BSON.serialize(item, false, true, false));
});
```

For more information, see the [BSON](https://www.npmjs.com/package/bson) npm module docs.

## Performance

This implementation is extremely fast because it is designed to avoid allocating memory too often. It is especially fast in raw mode (see below).

## Options

* `from` specifies the input stream. If you do not specify `from`, then `process.stdin` is assumed.

* `raw`: normally BSON documents are parsed into JavaScript objects for you. If `raw` is true, then raw buffers containing BSON documents are delivered to your callback, which is much, much faster if you plan to just hand them to the [mongodb](https://www.npmjs.com/package/mongodb) driver. (Note that you must specify raw mode in your insert call.)

* `maxDocumentSize`: by default BSON documents may be up to 16,777,216 bytes in length. This is MongoDB's limit. If you wish you may specify a different limit. Mostly useful for testing and low-memory environments.

## Why no stream interface?

When you just want to handle incoming objects in a strict order, streams just make things complicated and introduce bugs. We've had no end of trouble with node object streams that don't respect `pause()` in the streams1 interface, or stall out without emitting `readable` again in the streams2 interface, or... wait, why are we using these again?

## "What I really want is to stream an entire MongoDB database."

[mongo-dump-stream](http://npmjs.org/packages/mongo-dump-stream) covers that use case nicely. Check it out.

## About P'unk Avenue and Apostrophe

`read-async-bson` was created at [P'unk Avenue](http://punkave.com) for use in many projects built with Apostrophe, an open-source content management system built on node.js. If you like `read-async-bson` you should definitely [check out apostrophenow.org](http://apostrophenow.org).

## Support

Feel free to open issues on [github](http://github.com/punkave/read-async-bson).

<a href="http://punkave.com/"><img src="https://raw.githubusercontent.com/punkave/read-async-bson/master/logos/logo-box-builtby.png" /></a>

## Changelog

### CHANGES IN 0.1.2

Fixed package description.

### CHANGES IN 0.1.1

Do not invoke the final callback on end-of-stream unless we have actually consumed all of the data in our buffer.

### CHANGES IN 0.1.0

Initial release. Refactored from [mongo-dump-stream](http://npmjs.org/packages/mongo-dump-stream). New tests written, covering more cases.

## LICENSE

Copyright (c) 2015 P'unk Avenue LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
