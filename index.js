const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var BasecampStrategy = require('passport-basecamp').Strategy;

passport.use(new BasecampStrategy({
    clientID: a744476797ca7342f8824b03138d07c47cfba4ad,
    clientSecret: 8a3554eb0b3db98502eded261f69ff8898795690,
    callbackURL: "https://obscure-taiga-20645.herokuapp.com/auth/basecamp/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ basecampId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
