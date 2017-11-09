var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var gm = require('gm');
var mime = require('mime');
var fs = require('fs');

var config = require('./config');
var s3bucket = require('./providers/aws');
var Face = require('./models').Face;
var Stat = require('./models').Stat;



passport.use(new FacebookStrategy({
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
  }));

  
passport.use(new TwitterStrategy({
    consumerKey: config.TWITTER_CONSUMER_KEY,
    consumerSecret: config.TWITTER_CONSUMER_SECRET,
    callbackURL: config.TWITTER_CALLBACK_URL
  },
  function(token, tokenSecret, profile, done) {

    setTimeout(function () {

        var userExist = false;

        Face.find({network: 'twitter', network_id: profile._json.id}, function(err, faces) {
            if(faces.length > 0)
                userExist = true;
            if(userExist == false)
                createUserFromTwitter(profile._json, null, done);
            else{
                if(faces[0].claim === false)
                    return done(null, faces[0]);
                return done(null, faces[0], { message: 'User login' });
            }
        });
    }, 0);
  }
));



passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

  
var addStat = function(Lang){
    Stat.find({ lang:Lang}, function(err, stats) {
  
      //No results create it
      if(stats.length == 0){
        var stat = new Stat();
        stat.lang = Lang;
        stat.count = 1;
        // save the stat and check for errors
        stat.save(function(errr) {
            if (errr){
              console.log('ERROR CREATE STATS', err);
            }
        });
  
      }else{
        Stat.findOneAndUpdate({_id: stats[0]._id}, { $set: { count: stats[0].count + 1 }},{}, function(err){
          if (errr){
            console.log('ERREUR SAVE STATS', errr);
          }
        });
      }
      console.log('STATS', err, stats);
    });
};


var createUserFromTwitter = function(twitterUserData, number, done){
    if(twitterUserData.profile_image_url){
    /****************REFACTOR**********************/
        request.get({url: twitterUserData.profile_image_url.replace('_normal',''), encoding: 'binary'}, function (err, response, body) {
            fs.writeFile(imgDestPath + '/' + twitterUserData.id + '.jpeg', body, 'binary', function(errorFile) {
                s3bucket.createBucket(function() {
                    gm(imgDestPath + '/' + twitterUserData.id + '.jpeg')
                    .resize("150", "150")
                    .stream(function(err, stdout, stderr) {
                        /***/
                        var buf = new Buffer('');
                        if(stdout){
                            stdout.on('data', function(data) {
                                buf = Buffer.concat([buf, data]);
                            });
                            stdout.on('end', function(data) {
                                var data = {
                                    Bucket: config.S3_BUCKET_NAME,
                                    ACL: 'public-read',
                                    Key: 'img/' + twitterUserData.id + '.jpeg',
                                    Body: buf,
                                    ContentType: mime.lookup(imgDestPath + '/' + twitterUserData.id + '.jpeg')
                                };
                                s3bucket.putObject(data, function(errr, res) {
                                    if(errr)
                                        return console.log(errr);
                                    var face = new Face();
                                    face.accountname = twitterUserData.name;  // set the faces name (comes from the request)
                                    face.firstname = twitterUserData.screen_name;  // set the faces name (comes from the request)
                                    face.lastname = twitterUserData.screen_name;  // set the faces name (comes from the request)
                                    face.number = number;  // set the faces name (comes from the request)
                                    face.picture = '/img/' + twitterUserData.id + '.jpeg';  // set the faces name (comes from the request)
                                    face.network = 'twitter';  // set the faces name (comes from the request)
                                    face.network_id = twitterUserData.id;  // set the faces name (comes from the request)
                                    face.lang = twitterUserData.lang;  // set the faces name (comes from the request)
                                    face.non_human = false;  // set the faces name (comes from the request)
                                    //console.log('PROFILE TWITTER', twitterUserData.id);

                                    //STATS
                                    addStat(face.lang);

                                    // save the face and check for errors
                                    face.save(function(err) {
                                        if (err)
                                            console.log(err);
                                    });

                                    if(done)
                                        return done(null, face);
                                });
                            });
                        }
              /***/
                    });
                });
            });
        });
    }
}

module.exports = passport;