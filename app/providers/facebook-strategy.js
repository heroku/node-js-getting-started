var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  ,config = require('../config');

passport.use(new FacebookStrategy({
    clientID: config.FACEBOOK_APP_ID,
    clientSecret: config.FACEBOOK_APP_SECRET,
    callbackURL: config.FACEBOOK_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('FACEBOOK CALLBACK', accessToken, refreshToken, profile, done);
    /*User.findOrCreate(..., function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });*/
    console.log('DONE', done);
    done(null, profile);
  }
));

//console.log('PASSPORT', passport);

module.exports = passport;
