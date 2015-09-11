var mongodb = require('./');
var mongo_hosts = 'localhost:31000,localhost:31001,localhost:31002';
var mongo_user = 'bla';
var mongo_pass = 'bla bla';
var mongo_db = 'admin';
var mongoUrl = 'mongodb://' + mongo_user + ':' + mongo_pass + '@' + mongo_hosts + '/' + mongo_db + '?autoReconnect=true&w=0';
var mongoUrl = 'mongodb://' + mongo_hosts + '/' + mongo_db + '?autoReconnect=true&w=0';

var func = function() {
  console.log('Connecting');

  // Connect
  mongodb.connect(mongoUrl, function(err, client) {
    if (err) {       
      console.log("Error connecting to mongo: %s, err: %s", mongoUrl, err);       
      client && client.close();     
    } else {
      console.log("connected to mongo: " + mongoUrl);
      var db = client.db('mbrewer-test_playpen_meteor_com');

      db.removeUser('fakeUser', {}, function (err) {         
        console.log("Removed user ... (error " + err + ")");         
        client.close();       
      });
    }
    
    console.log('Scheduling our next call');
    setTimeout(func, 1);
  });
}

console.log('Starting');
func();