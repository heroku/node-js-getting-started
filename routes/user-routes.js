'use strict';

var User = require('../models/user');

module.exports = function(app, passport) {
  app.post('/api/users', function(req, res) {
    User.findOne({'basic.email': req.body.email}, function(err, user) {
      if (err || user) { return res.status(500).json({}); }
      var newUser = new User();

      if (!newUser.validatePassword(req.body.password)) {
        return res.status(500).json({});
      }

      newUser.basic.email = req.body.email;
      newUser.basic.password = newUser.generateHash(req.body.password);
      newUser.isAdmin = false;

      if (!newUser.confirmPassword(req.body.confirm)) {
        return res.status(500).json({});
      }

      newUser.save(function(err, resUser) {
        if (err) { return res.status(500).json({}); }
        res.json({'jwt': resUser.createToken(app.get('jwtTokenSecret'))});
      });
    });
  });

  app.get('/api/users', passport.authenticate('basic', {
    'session': false
  }), function(req, res) {
    res.json({'jwt': req.user.createToken(app.get('jwtTokenSecret'))});
  });

  app.delete('/api/users', function(req, res) {
    User.findOne({'basic.email': req.body.email}, function(err, user) {
      if (err || !user) { return res.status(500).json({}); }

      if (!user.confirmPassword(req.body.password)) {
        return res.status(500).json({});
      }

      User.remove({'basic.email': req.body.email}, function(err) {
        if (err) { return res.status(500).json({}); }
        res.json({});
      });
    });
  });
};
