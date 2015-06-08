// BASE SETUP
// =============================================================================

//MONGO
var mongoose   = require('mongoose');
var config   = require('./app/config');
mongoose.connect(config.mongodb); // connect to our database
var Face     = require('./app/models/face');
var Scrap     = require('./app/models/scrap');

// call the packages we need
var express        = require('express');        // call express
var app            = express();
var exphbs         = require('express-handlebars');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var cors           = require('cors');
var session        = require('cookie-session')
var path           = require('path');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var Twitter = require('twitter');
var fbgraph = require('fbgraph');
var _ = require('underscore-express');
//path.resolve('../omf-client/public/index.html');

//PASSPORT
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
//get file
var fs      = require('fs');
var request = require('request');
var path = require('path');
var imgDestPath = path.resolve('./public/img');

passport.use(new FacebookStrategy({
  clientID: config.FACEBOOK_APP_ID,
  clientSecret: config.FACEBOOK_APP_SECRET,
  callbackURL: config.FACEBOOK_CALLBACK_URL
}, function(accessToken, refreshToken, profile, done) {
      setTimeout(function() {

        var userExist = false;

        Face.find({network: 'facebook', network_id: profile._json.id}, function(err, faces) {

            if(faces.length > 0){
              userExist = true;
            }

            if(userExist == false){
              console.log('ERRORS', userExist);
              var face = new Face();      // create a new instance of the Face model
              /**
              { id: '10153295122599265',
                first_name: 'Jérémie',
                gender: 'male',
                last_name: 'Lenoir',
                link: 'https://www.facebook.com/app_scoped_user_id/10153295122599265/',
                locale: 'fr_FR',
                name: 'Jérémie Lenoir',
                timezone: 2,
                updated_time: '2014-05-28T20:08:41+0000',
                verified: true
              **/
              // Or with cookies
              // var request = require('request').defaults({jar: true});

              request.get({url: 'https://graph.facebook.com/' + profile._json.id + '/picture?type=large', encoding: 'binary'}, function (err, response, body) {
                fs.writeFile(imgDestPath + '/' + profile._json.id + '.jpeg', body, 'binary', function(error) {
                  if(error){
                    console.log(error);
                  }
                  else{
                    face.accountname = profile._json.name;  // set the faces name (comes from the request)
                    face.firstname = profile._json.first_name;  // set the faces name (comes from the request)
                    face.lastname = profile._json.last_name;  // set the faces name (comes from the request)
                    //face.number = 1;  // set the faces name (comes from the request)
                    face.picture = '/img/' + profile._json.id + '.jpeg';  // set the faces name (comes from the request)
                    face.network = 'facebook';  // set the faces name (comes from the request)
                    face.network_id = profile._json.id;  // set the faces name (comes from the request)
                    face.lang = profile._json.locale;
                    face.access_token = accessToken;
                    face.refresh_token = refreshToken;
                    console.log('PROFILE FACEBOOK', profile, imgDestPath);
                    // save the face and check for errors
                    face.save(function(err) {
                          if (err)
                              res.send(err);


                              return done(null, face);
                      });

                  }

                });
              });
            }
          else{
            console.log('PASSE');
            return done(null, false, { message: 'User already exist' });
          }

        });





      }, 0);

}));

passport.use(new TwitterStrategy({
    consumerKey: config.TWITTER_CONSUMER_KEY,
    consumerSecret: config.TWITTER_CONSUMER_SECRET,
    callbackURL: config.TWITTER_CALLBACK_URL
  },
  function(token, tokenSecret, profile, done) {
    // asynchronous verification, for effect...
    setTimeout(function () {

      // To keep the example simple, the user's Twitter profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Twitter account with a user record in your database,
      // and return that user instead.

      var userExist = false;

      Face.find({network: 'twitter', network_id: profile._json.id}, function(err, faces) {

          if(faces.length > 0){
            userExist = true;
          }

          if(userExist == false){

      var face = new Face();      // create a new instance of the Face model
      /**
       id: 12637422,
       id_str: '12637422',
       name: 'lenoirjeremie',
       screen_name: 'lenoirjeremie',
       location: 'paris',
      **/

      request.get({url: profile._json.profile_image_url.replace('_normal',''), encoding: 'binary'}, function (err, response, body) {
        fs.writeFile(imgDestPath + '/' + profile._json.id + '.jpeg', body, 'binary', function(error) {
          if(error){
            console.log(error);
          }
          else{
            face.accountname = profile._json.name;  // set the faces name (comes from the request)
            face.firstname = profile._json.screen_name;  // set the faces name (comes from the request)
            face.lastname = profile._json.screen_name;  // set the faces name (comes from the request)
            //face.number = 1;  // set the faces name (comes from the request)
            face.picture = '/img/' + profile._json.id + '.jpeg';  // set the faces name (comes from the request)
            //face.picture = face.picture.replace('_normal','');  // set the faces name (comes from the request)
            face.network = 'twitter';  // set the faces name (comes from the request)
            face.network_id = profile._json.id;  // set the faces name (comes from the request)
            face.lang = profile._json.lang;  // set the faces name (comes from the request)
            console.log('PROFILE TWITTER', profile);
            // save the face and check for errors
              face.save(function(err) {
                  if (err)
                      res.send(err);


                      return done(null, face);
              });


          }

        });
      });
      }else{
        console.log('PASSE');
        return done(null, false, { message: 'User already exist' });
      }

      });
    }, 0);

  }
));

passport.serializeUser(function(user, done) {
  console.log('SERIALIZE', user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  //console.log('DESERIALIZE', user);
  done(null, obj);
});

//console.log('PASSPORT', passport);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.engine('handlebars',
  exphbs({
    defaultLayout: 'main',
    helpers: {
        'json': function(context) {
          return JSON.stringify(context);
        },
        ifCond: function(v1,operator,v2,options) {
              switch (operator){
                  case "==":
                      return (v1==v2)?options.fn(this):options.inverse(this);

                  case "!=":
                      return (v1!=v2)?options.fn(this):options.inverse(this);

                  case "===":
                      return (v1===v2)?options.fn(this):options.inverse(this);

                  case "!==":
                      return (v1!==v2)?options.fn(this):options.inverse(this);

                  case "&&":
                      return (v1&&v2)?options.fn(this):options.inverse(this);

                  case "||":
                      return (v1||v2)?options.fn(this):options.inverse(this);

                  case "<":
                      return (v1<v2)?options.fn(this):options.inverse(this);

                  case "<=":
                      return (v1<=v2)?options.fn(this):options.inverse(this);

                  case ">":
                      return (v1>v2)?options.fn(this):options.inverse(this);

                  case ">=":
                      return (v1>=v2)?options.fn(this):options.inverse(this);
              }
          }
    }

}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(flash());

var port = process.env.PORT || 3000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
var publicRouter = express.Router();
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

// more routes for our API will happen here

// on routes that end in /faces
// ----------------------------------------------------
router.route('/faces')

    // create a face (accessed at POST http://localhost:8080/api/faces)
    .post(function(req, res) {

        var face = new Face();      // create a new instance of the Face model
        face.accountname = req.body.accountname;  // set the faces name (comes from the request)
        face.firstname = req.body.firstname;  // set the faces name (comes from the request)
        face.lastname = req.body.lastname;  // set the faces name (comes from the request)
        face.number = req.body.number;  // set the faces name (comes from the request)
        face.picture = req.body.picture;  // set the faces name (comes from the request)
        face.network = req.body.network;  // set the faces name (comes from the request)

        // save the face and check for errors
        face.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Face created!' });
        });

    })
    // get all the faces (accessed at GET http://localhost:8080/api/faces)
    .get(function(req, res) {
        console.log('REQUEST', req.query);

        Face.find(function(err, faces) {

            console.log(faces);

            if (err)
                res.send(err);

            res.json(faces);
        });
    });

    // on routes that end in /faces/:face_id
    // ----------------------------------------------------
    router.route('/faces/:face_id')

        // get the face with that id (accessed at GET http://localhost:8080/api/faces/:face_id)
        .get(function(req, res) {
            Face.findById(req.params.face_id, function(err, face) {
                if (err)
                    res.send(err);
                res.json(face);
            });
        })
        .post(function(req, res) {
            Face.findById(req.params.face_id, function(err, face) {
                if (err){
                  res.send(err);
                }
                console.log('PARAMS', req.body, face);
                face.occupation = req.body.occupation;
                face.lang = req.body.lang;
                face.website = req.body.website;
                face.accountname = req.body.accountname;

                face.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ 'message': 'Face saved!', 'face': face});
                });


            });
        })
        // update the face with this id (accessed at PUT http://localhost:8080/api/faces/:face_id)
        .put(function(req, res) {

        })
        // delete the face with this id (accessed at DELETE http://localhost:8080/api/faces/:face_id)
        .delete(function(req, res) {
            Face.remove({
                _id: req.params.face_id
            }, function(err, face) {
                if (err)
                    res.send(err);

                res.json({ message: 'Successfully deleted' });
            });
        });

        // on routes that end in /faces/:face_id
        // ----------------------------------------------------
        router.route('/faces/:x/:y')

            // get the face with that id (accessed at GET http://localhost:8080/api/faces/:face_id)
            .get(function(req, res) {
                Face.find(function(err, faces) {
                    if (err)
                        res.send(err);
                    res.json(faces);
                });
            });


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
publicRouter.get('/', function(req, res) {
    Face.find(function(err, faces) {
        if (err){
          res.send(err);
        }
        res.render('home', {data:{'faces': faces, 'nbFaces': faces.length, 'currentUser': req.user}});
        //res.json(faces);
    });

    //res.sendfile(path.resolve('./public/register.html'));
});

/****** SCRAPING **********/

var CronJob = require('cron').CronJob;
/*new CronJob('*15 * * * * *', function() {
  console.log('You will see this message every 15 second');

  request.get({url:/*'http://localhost:3000/scraping/blank''https://stark-plateau-2977.herokuapp.com/scraping/blank'}, function (err, response, body) {
    console.log('BODY', body);
  });

}, null, true, 'France/Paris');*/

publicRouter.get('/populate/', function(req, res, next) {
    Scrap.find().limit(10).exec(function(err, scrapes) {
      console.log('POPULATE', scrapes);
      res.json(scrapes);
    });

});

publicRouter.get('/scraping/:query', function(req, res, next) {
  var client = new Twitter({
    consumer_key: config.TWITTER_CONSUMER_KEY,
    consumer_secret: config.TWITTER_CONSUMER_SECRET,
    access_token_key: config.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: config.TWITTER_ACCESS_TOKEN_SECRET
  });

  /*client.get('users/search', {q: req.params.query }, function(error, tweets, response){
     res.render('scraping', {'tweets': tweets});
  });*/

  client.get('search/tweets', {q: /*req.params.query + */'rt since:2015-05-30', /*lang:'en',*/ count:100}, function(error, tweets, response){
     console.log('TWEETS', tweets);

     for(var i= 0; i < tweets.statuses.length; i++){
       var currentTweet = tweets.statuses[i];
       Scrap.find({twitter_id: currentTweet.user.id}, function(err, scrapes) {

           if(scrapes.length > 0){
             userExist = true;
             scrapes[0].occurs++;
             scrapes[0].save(function(err) {
                 if (err){
                   console.log('SCRAPE UPDATED', err);
                 }
             });
           }else{





           var scrap = new Scrap();
           /*Name: {{this.user.name}}
           Lang: {{this.lang}}
           Location: {{this.user.location}}
           Followers_count:{{this.user.followers_count}}
           Created_at: {{this.created_at}}
           Time_zone: {{this.user.time_zone}}
           Verified: {{this.user.verified}}
           Status_count: {{this.user.statuses_count}}
           Last update: {{this.user.status.created_at}}*/
           //scrap.accountname= tweets.statuses[i].user.name;
           //console.log('TWEET STATUS', currentTweet);
           scrap.twitter_id= currentTweet.user.id;
           //scrap.img_path= tweets.statuses[i].user.profile_image_url;
           scrap.location= currentTweet.user.location;
           scrap.followers_count= currentTweet.user.followers_count;
           scrap.created_at= currentTweet.created_at;
           scrap.lang= currentTweet.lang;
           scrap.time_zone= currentTweet.user.time_zone;
           scrap.verified= currentTweet.user.verified;
           scrap.statuses_count= currentTweet.user.statuses_count;

           scrap.save(function(err) {
               if (err){
                 console.log('ERROR SAVE NUMBER', err);
               }


           });
         }

     });

     }

     res.render('scraping', {'tweets': tweets});
  });


});

publicRouter.get('/register', function(req, res, next) {
  Face.find(function(err, faces) {
      if (err){
        res.send(err);
      }
      res.render('register', {'faces': faces, 'nbFaces': (faces.length + 1), currentUser: req.user });
      //res.json(faces);
  });
});

publicRouter.get('/auth/facebook/register/:id',
function(req,res,next) {
  passport.authenticate(
    'facebook',
     {callbackURL: '/auth/facebook/callback/'+req.params.id }
  )(req,res,next);
});

publicRouter.get('/auth/facebook/callback/:id',
function(req,res,next) {
  passport.authenticate(
    'facebook',
     {
       callbackURL:"/auth/facebook/callback/" + req.params.id
     , successRedirect:"/success/" + req.params.id
     , failureRedirect:"/error"
     , failureFlash: true
     , scope: ['publish_actions']
     }
   ) (req,res,next);
  }
);

publicRouter.get('/auth/twitter/register/:id',
function(req,res,next) {
  passport.authenticate(
    'twitter',
     {callbackURL: '/auth/twitter/callback/'+req.params.id }
  )(req,res,next);
});

publicRouter.get('/auth/twitter/callback/:id',
function(req,res,next) {
  passport.authenticate(
    'twitter',
     {
       callbackURL:"/auth/twitter/callback/" + req.params.id
     , successRedirect:"/success/" + req.params.id
     , failureRedirect:"/error"
     , failureFlash: true
   }
   ) (req,res,next);
  }
);

publicRouter.get('/auth/twitter/claim/:id',
function(req,res,next) {
  passport.authenticate(
    'twitter',
     {callbackURL: '/auth/twitter/claim/callback/'+req.params.id }
  )(req,res,next);
});

publicRouter.get('/auth/twitter/claim/callback/:id',
function(req,res,next) {
  passport.authenticate(
    'twitter',
     {
       callbackURL:"/auth/twitter/claim/callback/" + req.params.id
     , successRedirect:"/claim/" + req.params.id
     , failureRedirect:"/error"
     , failureFlash: true
     }
   ) (req,res,next);
  }
);

publicRouter.get('/claim/:id', function(req, res, next) {

  console.log('CLAIM', req.user, req.params.id );


    Face.findOne({'accountname': req.user.accountname},function(err, face) {
        if (err){
          console.log('UTILISATEUR NON TROUVE', err);
        }else{

        if(req.user.accountname != req.params.id){
            face.remove(function(err) {
                if (err){
                  console.log('ERROR SAVE NUMBER', err);
                }


            });
          }else{
            face.claim = true;
            face.save(function(err) {
                if (err){
                  console.log('ERROR SAVE NUMBER', err);
                }


            });
          }
        }

        //res.json(faces);
    });




  Face.find(function(err, faces) {
      if (err){
        res.send(err);
      }

      res.render('register', {'faces': faces, 'nbFaces': (faces.length + 1), 'editedFace': req.params.id, currentUser: req.user, 'claim': true});
      //res.json(faces);
  });
});

publicRouter.get('/success/:id', function(req, res, next) {

  console.log('REQ ID', req.session);
  Face.findOne({'_id': req.user._id},function(err, face) {
      if (err){
        console.log('UTILISATEUR NON TROUVE', err);
      }else{

          face.number = req.params.id == 0 ? 1 : req.params.id;
          console.log('FACE', face);
          req.user.number = req.params.id == 0 ? 1 : req.params.id;
          face.save(function(err) {
              if (err){
                console.log('ERROR SAVE NUMBER', err);
              }


          });
      }

      //res.json(faces);
  });

  Face.find(function(err, faces) {
      if (err){
        res.send(err);
      }

      fbgraph.setAccessToken(req.user.access_token);

      var wallPost = {
        message: 'Test inscription one millions humans'
      };

      /*fbgraph.post("/feed", wallPost, function(err, res) {
        // returns the post id
        console.log(res); // { id: xxxxx}
      });*/

      res.render('home', {'data':{'faces': faces, 'nbFaces': (faces.length + 1), 'editedFace': req.params.id, currentUser: req.user}});
      //res.json(faces);
  });
});

/***** EDIT PART *******/
publicRouter.get('/edit/:number', function(req, res, next) {

  Face.find(function(err, faces) {
      if (err){
        res.send(err);
      }

      res.render('register', {'faces': faces, 'nbFaces': (faces.length + 1), 'editedFace': req.params.number, currentUser: req.user});
      //res.json(faces);
  });
});

/***********************/

publicRouter.get('/error', function(req, res, next) {
  //console.log('FLASH', req.flash());
  Face.find(function(err, faces) {
      if (err){
        res.send(err);
      }
      res.render('register', {'faces': faces, 'nbFaces': (faces.length + 1) , error : req.flash()});
      //res.json(faces);
  });
});

app.use('/api', router);
app.use('/', publicRouter);



// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
