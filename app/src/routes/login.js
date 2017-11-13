import express from 'express';

import passport from '../passport';

const router = express.Router();

router.get('/facebook', (req,res,next) => {
    passport.authenticate('facebook',{callbackURL: '/login/facebook/callback' })(req,res,next);
});

router.get('/facebook/callback', passport.authenticate('facebook', {callbackURL: '/login/facebook/callback', failureRedirect: '/#login' }), (req, res) => {
  // Successful authentication, redirect home.
  if(req.user.number){
    res.redirect('/#number/' + req.user.number);
  }else{
    res.redirect('/#nonumber');
  }
});

router.get('/twitter',(req,res,next) => {
  passport.authenticate('twitter',{callbackURL: '/login/twitter/callback' })(req,res,next);
});

router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/#login' }),(req, res) => {
  // Successful authentication, redirect home.
  res.redirect('/#number/' + req.user.number);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

export default router;