# passport-twitter

[![Build](https://travis-ci.org/jaredhanson/passport-twitter.png)](http://travis-ci.org/jaredhanson/passport-twitter)
[![Coverage](https://coveralls.io/repos/jaredhanson/passport-twitter/badge.png)](https://coveralls.io/r/jaredhanson/passport-twitter)
[![Dependencies](https://david-dm.org/jaredhanson/passport-twitter.png)](http://david-dm.org/jaredhanson/passport-twitter)


[Passport](http://passportjs.org/) strategy for authenticating with [Twitter](http://twitter.com/)
using the OAuth 1.0a API.

This module lets you authenticate using Twitter in your Node.js applications.
By plugging into Passport, Twitter authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-twitter

## Usage

#### Configure Strategy

The Twitter authentication strategy authenticates users using a Twitter account
and OAuth tokens.  The strategy requires a `verify` callback, which receives the
access token and corresponding secret as arguments, as well as `profile` which
contains the authenticated user's Twitter profile.   The `verify` callback must
call `done` providing a user to complete authentication.

In order to identify your application to Twitter, specify the consumer key,
consumer secret, and callback URL within `options`.  The consumer key and secret
are obtained by [creating an application](https://dev.twitter.com/apps) at
Twitter's [developer](https://dev.twitter.com/) site.

    passport.use(new TwitterStrategy({
        consumerKey: TWITTER_CONSUMER_KEY,
        consumerSecret: TWITTER_CONSUMER_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
      },
      function(token, tokenSecret, profile, done) {
        User.findOrCreate({ twitterId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'twitter'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/twitter',
      passport.authenticate('twitter'));
    
    app.get('/auth/twitter/callback', 
      passport.authenticate('twitter', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [signin example](https://github.com/jaredhanson/passport-twitter/tree/master/examples/signin).

## Tests

    $ npm install
    $ npm test

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
