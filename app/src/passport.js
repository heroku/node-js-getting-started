import passport from 'passport';

import { twitter_strategy } from './providers/twitter';
import facebook_strategy from'./providers/facebook';

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(facebook_strategy);
passport.use(twitter_strategy);


export default passport;
