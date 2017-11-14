import express from 'express';

import passport from '../passport';

const router = express.Router();

router.get('/facebook/register/:id', (req, res, next) => {
  passport.authenticate('facebook', {
    callbackURL: '/auth/facebook/callback/${req.params.id}'
  })(req, res, next);
});

router.get('/facebook/callback/:id', (req, res, next) => {
  passport.authenticate('facebook', {
    callbackURL: '/auth/facebook/callback/${req.params.id}',
    successRedirect: '/success/${req.params.id}',
    failureRedirect: '/error',
    failureFlash: true
  })(req, res, next);
});

router.get('/twitter/register/:id', (req, res, next) => {
  passport.authenticate('twitter', {
    callbackURL: '/auth/twitter/callback/${req.params.id}'
  })(req, res, next);
});

router.get('/twitter/callback/:id', (req, res, next) => {
  passport.authenticate('twitter', {
    callbackURL: '/auth/twitter/callback/${req.params.id}',
    successRedirect: '/success/${req.params.id}',
    failureRedirect: '/error',
    failureFlash: true
  })(req, res, next);
});

router.get('/twitter/claim/:id', (req, res, next) => {
  passport.authenticate('twitter', {
    callbackURL: '/auth/twitter/claim/callback/${req.params.id}'
  })(req, res, next);
});

router.get('/twitter/decline/:id', (req, res, next) => {
  passport.authenticate('twitter', {
    callbackURL: '/auth/twitter/decline/callback/${+req.params.id}'
  })(req, res, next);
});

router.get('/twitter/decline/callback/:id', (req, res, next) => {
  passport.authenticate('twitter', {
    callbackURL: '/auth/twitter/decline/callback/${req.params.id}',
    successRedirect: '/decline/${req.params.id}',
    failureRedirect: '/error',
    failureFlash: true
  })(req, res, next);
});


router.get('/twitter/claim/callback/:id', (req, res, next) => {
  passport.authenticate('twitter', {
    callbackURL: '/auth/twitter/claim/callback/${req.params.id}',
    successRedirect: '/claim/${req.params.id}',
    failureRedirect: '/error',
    failureFlash: true
  })(req, res, next);
});

export default router;
