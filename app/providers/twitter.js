var Twitter = require('twitter');
var TwitterStrategy = require('passport-twitter').Strategy;

var config = require('../config');
var createUserFromTwitter = require('../utils').createUserFromTwitter;
var Face = require('../models').Face;

var twitter_provider = new Twitter({
    consumer_key: config.TWITTER_CONSUMER_KEY,
    consumer_secret: config.TWITTER_CONSUMER_SECRET,
    access_token_key: config.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: config.TWITTER_ACCESS_TOKEN_SECRET
});

var twitter_strategy = new TwitterStrategy({
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
);

module.exports = {twitter_provider : twitter_provider, twitter_strategy: twitter_strategy};