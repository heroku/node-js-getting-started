import Twitter from 'twitter';
import passport from 'passport-twitter';

import config from '../config';
import {createUserFromTwitter} from '../utils';
import {Face} from '../models';

const twitter_provider = new Twitter({
    consumer_key: config.TWITTER_CONSUMER_KEY,
    consumer_secret: config.TWITTER_CONSUMER_SECRET,
    access_token_key: config.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: config.TWITTER_ACCESS_TOKEN_SECRET
});

const twitter_strategy = new passport.Strategy({
    consumerKey: config.TWITTER_CONSUMER_KEY,
    consumerSecret: config.TWITTER_CONSUMER_SECRET,
    callbackURL: config.TWITTER_CALLBACK_URL
  },
  (token, tokenSecret, profile, done) => {

    setTimeout(() => {

        var userExist = false;

        Face.find({network: 'twitter', network_id: profile._json.id}, (err, faces) => {
            if(faces.length > 0)
                userExist = true;
            if(userExist == false)
                createUserFromTwitter(profile._json, null, done);
            else{
                if(faces[0].claim === false)
                    return done(null, faces[0]);
                return done(null, faces[0], { message: 'User login' });
            }
        });
    }, 0);
  }
);

export {twitter_provider, twitter_strategy};