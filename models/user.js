'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
var moment = require('moment');

var userSchema = mongoose.Schema({
  basic: {
    email: String,
    password: String
  },
  isAdmin: Boolean
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.confirmPassword = function(password) {
  return bcrypt.compareSync(password, this.basic.password);
};

userSchema.methods.validatePassword = function(password) {
  var regExp  = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  return regExp.test(password);
};

userSchema.methods.createToken = function(secret) {
  var expires = moment().add(7, 'days').valueOf();
  var self = this;
  var token = jwt.encode({
    iss: self._id,
    expires: expires
  }, secret);
  return token;
};

module.exports = mongoose.model('User', userSchema);
