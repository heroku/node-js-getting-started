var assert = require('assert');
var mds = require('../index.js');
var mongodb = require('mongodb');
var async = require('async');
var fs = require('fs');
var collectionNames = [ 'one', 'two', 'three' ];

describe('mongo-dump-stream', function() {
  var db1, db2;
  var collections1 = {};
  var collections2 = {};
  it('populate the test database', function(done) {
    this.timeout(5000);
    return async.series({
      connect: function(callback) {
        return mongodb.MongoClient.connect('mongodb://localhost:27017/mongo-dump-stream-test-1', function(err, _db) {
          if (err) {
            return callback(err);
          }
          db1 = _db;
          return callback(null);
        });
      },
      drop: function(callback) {
        return db1.dropDatabase(function(err) {
          assert(!err);
          return callback(null);
        });
      },
      collections: function(callback) {
        return async.eachSeries(collectionNames, function(name, callback) {
          return async.series({
            create: function(callback) {
              return db1.collection(name, function(err, collection) {
                if (err) {
                  return callback(err);
                }
                collections1[name] = collection;
                return callback(null);
              });
            },
            populate: function(callback) {
              var objects = [];
              var i, j;
              for (i = 0; (i < 100); i++) {
                var o = {};
                for (j = 0; (j < 10); j++) {
                  var k = 'key' + j;
                  o[k] = name + j;
                }
                objects.push(o);
              }
              return collections1[name].insert(objects, callback);
            }
          }, callback);
        }, callback);
      }
    }, function(err) {
      assert(!err);
      return done();
    });
  });
  it('can dump the test database to a file', function(done) {
    this.timeout(5000);
    var out = fs.createWriteStream(__dirname + '/test.db');
    return mds.dump(db1, out, function(err) {
      assert(!err);
      assert(fs.existsSync(__dirname + '/test.db'));
      return done();
    });
  });
  it('can load the file into a second database', function(done) {
    this.timeout(5000);
    return async.series({
      connect: function(callback) {
        return mongodb.MongoClient.connect('mongodb://localhost:27017/mongo-dump-stream-test-2', function(err, _db) {
          if (err) {
            return callback(err);
          }
          db2 = _db;
          return callback(null);
        });
      },
      drop: function(callback) {
        return db2.dropDatabase(function(err) {
          assert(!err);
          return callback(null);
        });
      },
      load: function(callback) {
        var fin = fs.createReadStream(__dirname + '/test.db');
        return mds.load(db2, fin, callback);
      }
    }, function(err) {
      if (err) {
        console.error(err);
      }
      assert(!err);
      return done();
    });
  });

  it('the contents of the second database are correct', function(done) {
    this.timeout(5000);
    return verify(done);
  });

  it('can load a v1 file into a third database', function(done) {
    this.timeout(5000);
    return async.series({
      connect: function(callback) {
        return mongodb.MongoClient.connect('mongodb://localhost:27017/mongo-dump-stream-test-3', function(err, _db) {
          if (err) {
            return callback(err);
          }
          db2 = _db;
          return callback(null);
        });
      },
      drop: function(callback) {
        return db2.dropDatabase(function(err) {
          assert(!err);
          return callback(null);
        });
      },
      load: function(callback) {
        var fin = fs.createReadStream(__dirname + '/test.db.v1');
        return mds.load(db2, fin, callback);
      }
    }, function(err) {
      assert(!err);
      return done();
    });
  });

  it('the contents of the third database are correct', function(done) {
    this.timeout(5000);
    return verify(done);
  });

  function verify(done) {
    return async.eachSeries(collectionNames, function(name, callback) {
      return async.series({
        create: function(callback) {
          return db2.collection(name, function(err, collection) {
            if (err) {
              return callback(err);
            }
            collections2[name] = collection;
            return callback(null);
          });
        },
        verify: function(callback) {
          return collections2[name].find().toArray(function(err, objects) {
            assert(!err);
            assert(objects.length === 100);
            var i, j;
            for (i = 0; (i < 100); i++) {
              var o = objects[i];
              for (j = 0; (j < 10); j++) {
                var k = 'key' + j;
                assert(o[k] === (name + j));
              }
            }
            return done();
          });
        }
      }, callback);
    }, function(err) {
      assert(!err);
      return done();
    });
  }
});
