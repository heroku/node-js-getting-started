var express = require('express');
var router = express.Router();
var passport = require('../passport');

router.get('/facebook', function(req,res,next) {
    passport.authenticate('facebook',{callbackURL: '/login/facebook/callback' })(req,res,next);
});

router.get('/facebook/callback', passport.authenticate('facebook', {callbackURL: '/login/facebook/callback', failureRedirect: '/#login' }),
  function(req, res) {
    // Successful authentication, redirect home.

    if(req.user.number){
      res.redirect('/#number/' + req.user.number);
    }else{
      res.redirect('/#nonumber');
    }

});

router.get('/twitter',function(req,res,next) {
    passport.authenticate('twitter',{callbackURL: '/login/twitter/callback' })(req,res,next);
});

router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/#login' }),function(req, res) {
        // Successful authentication, redirect home.
    res.redirect('/#number/' + req.user.number);
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;