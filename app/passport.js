var passport = require('passport');

var twitter_strategy = require('./providers/twitter').twitter_strategy
var facebook_strategy = require('./providers/facebook').facebook_strategy;

passport.use(facebook_strategy);
passport.use(twitter_strategy);

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

module.exports = passport;