var express = require('express');
var router = express.Router();

var passport = require('../passport');

router.get('/auth/facebook/register/:id',function(req,res,next) {
    passport.authenticate('facebook', {
        callbackURL: '/auth/facebook/callback/'+req.params.id 
    })(req,res,next);
});

router.get('/auth/facebook/callback/:id', function(req,res,next) {
    passport.authenticate('facebook',{
        callbackURL:"/auth/facebook/callback/" + req.params.id,
        successRedirect:"/success/" + req.params.id,
        failureRedirect:"/error",
        failureFlash: true,
        //, scope: ['publish_actions']
    }) (req,res,next);
});

router.get('/auth/twitter/register/:id', function(req,res,next) {
    passport.authenticate('twitter', {
      callbackURL: '/auth/twitter/callback/'+req.params.id 
    })(req,res,next);
});

router.get('/auth/twitter/callback/:id', function(req,res,next) {
    passport.authenticate('twitter',{
        callbackURL:"/auth/twitter/callback/" + req.params.id,
        successRedirect:"/success/" + req.params.id,
        failureRedirect:"/error",
        failureFlash: true
    }) (req,res,next);
});

router.get('/auth/twitter/claim/:id',
  function(req,res,next) {
    passport.authenticate('twitter',{
        callbackURL: '/auth/twitter/claim/callback/'+req.params.id 
    }
    )(req,res,next);
});

router.get('/auth/twitter/decline/:id',function(req,res,next) {
    passport.authenticate('twitter',{
        callbackURL: '/auth/twitter/decline/callback/'+req.params.id
    }
    )(req,res,next);
});

router.get('/auth/twitter/decline/callback/:id', function(req,res,next) {
    passport.authenticate('twitter',{
        callbackURL:"/auth/twitter/decline/callback/" + req.params.id,
        successRedirect:"/decline/" + req.params.id,
        failureRedirect:"/error",
        failureFlash: true
    }) (req,res,next);
});


router.get('/auth/twitter/claim/callback/:id', function(req,res,next) {
    passport.authenticate('twitter',{
        callbackURL:"/auth/twitter/claim/callback/" + req.params.id,
        successRedirect:"/claim/" + req.params.id,
        failureRedirect:"/error",
        failureFlash: true
    }) (req,res,next);
});

module.exports = router;