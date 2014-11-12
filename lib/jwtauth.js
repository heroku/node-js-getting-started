'use strict';

var User = require('../models/user');
var jwt = require('jwt-simple');

module.exports = function(app) {
  var jwtauth = {
    auth: function(req, res, next) {
      var token = req.body.jwt;
      var decoded;
      if (!token) { return res.status(500).json({}); }
      try { decoded = jwt.decode(token, app.get('jwtTokenSecret')); }
      catch(err) { return res.status(500).json({}); }

      User.findOne({'_id': decoded.iss}, function(err, user) {
        if(err || !user) return res.status(500).json({});
        req.user = user;
        next();
      });
    }
  };

  return jwtauth;
};
