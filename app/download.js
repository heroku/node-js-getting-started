//download helper function
var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    if (err) callback(err, filename);
    else {
        var stream = request(uri);
        stream.pipe(
            fs.createWriteStream(filename)
                .on('error', function(err){
                    callback(error, filename);
                    stream.read();
                })
            )
        .on('close', function() {
            callback(null, filename);
        });
    }
  });
};

module.exports = download;
