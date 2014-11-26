'use strict';

var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');

module.exports = function(passport) {
  passport.use(new BasicStrategy(function(email, password, done) {
    User.findOne({'basic.email': email}, function(err, user) {
      if(err || !user || !user.confirmPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  }));
};
