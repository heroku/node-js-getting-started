var FacebookStrategy = require('passport-facebook').Strategy;
var gm = require('gm');
var mime = require('mime');
var fs = require('fs');

var config = require('../config');
var addStat = require('../utils').addStat;
var Face = require('../models').Face;

var facebook_strategy = new FacebookStrategy({
    clientID: config.FACEBOOK_APP_ID,
    clientSecret: config.FACEBOOK_APP_SECRET,
    callbackURL: config.FACEBOOK_CALLBACK_URL
  }, function(accessToken, refreshToken, profile, done) {
        setTimeout(function() {
  
            var userExist = false;
  
            Face.find({network: 'facebook', network_id: profile._json.id}, function(err, faces) {
                if(faces.length > 0){
                    userExist = true;
                    face = faces[0];
                }
  
                if(userExist == false){
                    var face = new Face();
                    request.get({url: 'https://graph.facebook.com/' + profile._json.id + '/picture?type=large', encoding: 'binary'}, function (err, response, body) {
                    fs.writeFile(imgDestPath + '/' + profile._json.id + '.jpeg', body, 'binary', function(errorFile) {
                        s3bucket.createBucket(function() {
                            gm(imgDestPath + '/' + profile._json.id + '.jpeg')
                            .resize("150", "150")
                            .stream(function(err, stdout, stderr) {
  
                      /***/
                                var buf = new Buffer('');
                                stdout.on('data', function(data) {
                                    buf = Buffer.concat([buf, data]);
                                });
                                stdout.on('end', function(data) {
                                    var data = {
                                        Bucket: config.S3_BUCKET_NAME,
                                        ACL: 'public-read',
                                        Key: 'img/' + profile._json.id + '.jpeg',
                                        Body: buf,
                                        ContentType: mime.lookup(imgDestPath + '/' + profile._json.id + '.jpeg')
                                    };
                                    s3bucket.putObject(data, function(errr, res) {
                                        if(errr){
                                            return console.log(errr);
                                        }
                                        face.accountname = profile._json.name;  // set the faces name (comes from the request)
                                        face.firstname = profile._json.first_name;  // set the faces name (comes from the request)
                                        face.lastname = profile._json.last_name;  // set the faces name (comes from the request)
                                        //face.number = 1;  // set the faces name (comes from the request)
                                        face.picture = '/img/' + profile._json.id + '.jpeg';  // set the faces name (comes from the request)
                                        face.network = 'facebook';  // set the faces name (comes from the request)
                                        face.network_id = profile._json.id;  // set the faces name (comes from the request)
                                        face.lang = profile._json.locale;
                                        face.access_token = accessToken;
                                        face.refresh_token = refreshToken;
                                        //console.log('PROFILE FACEBOOK', profile, imgDestPath);

                                        //STATS
                                        addStat(face.lang);

                                        // save the face and check for errors
                                        face.save(function(err) {
                                            if (err)
                                                return res.send(err);
                                            return done(null, face);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }
            else{
              return done(null, face, { message: 'User find' });
            }
          });
        }, 0);
  });

module.exports = {facebook_strategy : facebook_strategy};