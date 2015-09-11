var d = require('./index.js');
var argv = require('yargs').argv;

var uri = argv._[0];

if (!uri) {
  console.error('Usage: mongo-dump-stream mongodb://username:password@host:port/dbname\n');
  console.error('The current contents of the database will be');
  console.error('written to standard output in a BSON-based');
  console.error('stream format, suitable for use with the');
  console.error('mongo-load-stream utility also provided in');
  console.error('this module.');
  process.exit(1);
}

return d.dump(uri, function(err) {
  if (err) {
    console.error('ERROR:');
    console.error(err);
    process.exit(1);
  }
  process.exit(0);
});

