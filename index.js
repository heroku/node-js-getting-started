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
var _ = require('underscore');

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
var publicPath = path.resolve('./public');
var gm = require('gm');

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
              face = faces[0];
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
                          if (err){
                            res.send(err);
                          }
                          return done(null, face);
                      });

                  }

                });
              });
            }
          else{
            console.log('PASSE');
            return done(null, face, { message: 'User find' });
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
        if(faces[0].claim === false){
          return done(null, faces[0]);
        }else{
          return done(null, faces[0], { message: 'User login' });
        }

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
        'checked': function(search, list){
          if(list){
            var listTab = JSON.parse(list);
            console.log('PARSE', listTab.length, search);
            return _.contains(listTab, search, 0) ? 'checked="true"':'';
          }else{
            return '';
          }

        },
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
                console.log('PARAMS', JSON.stringify(req.body.occupations));
                face.occupations = JSON.stringify(req.body.occupations);
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
        router.route('/faces_by_number/:number')

            // get the face with that id (accessed at GET http://localhost:8080/api/faces/:face_id)
            .get(function(req, res) {
                var number = req.params.number;
                Face.find({number:{$gt:(number - 1),$lt:(number + config.faces_by_request)}}).sort('number').limit(config.faces_by_request).exec(function(err, faces) {

                      //console.log('FACES BY NUMBER', faces);
                      var tempFaces = _.clone(faces);

                      if (err){
                        res.send(err);
                      }
                      console.log('NUMBER', number, parseInt(number, 10) + parseInt(config.faces_by_request, 10));
                      for(var i = number; i < parseInt(number, 10) + parseInt(config.faces_by_request, 10); i++){
                        if( ! _.find(tempFaces, function(currentFace){ return currentFace.number == i; }) ){
                          tempFaces.push({'number': i});
                        }
                      }

                    tempFaces = _.sortBy(tempFaces, 'number');
                    res.json(tempFaces);
                });
            });

        router.route('/faces_by_range/:range')

            // get the face with that id (accessed at GET http://localhost:8080/api/faces/:face_id)
            .get(function(req, res) {
                var range = JSON.parse('[' + req.params.range + ']');

                Face.find({number:{$in:range}}).sort('number').exec(function(err, faces) {

                    var tempFaces = _.clone(faces);
                    //var randomPicture;

                      if (err){
                        res.send(err);
                      }
                      for(var i = 0; i < range.length; i++){
                        //randomPicture = Math.round(Math.random()*config.nbFreeSlotFacesPictures-1)+1;

                        if( ! _.find(tempFaces, function(currentFace){ return currentFace.number == range[i]; }) ){
                            tempFaces.push({'number': range[i]});
                        }
                      }

                    tempFaces = _.sortBy(tempFaces, 'number');
                    res.json(tempFaces);
                });
            });

        // on routes that end in /faces/search/:query
        // ----------------------------------------------------
        router.route('/faces/search/:query')

            .get(function(req, res) {
              var regex = new RegExp('.*' + req.params.query + '.*', "i");
              var testInt = parseInt(req.params.query, 10);

              console.log('SEARCH', _.isNaN(testInt), testInt);

                if(_.isNaN(testInt)){
                  Face.find({accountname: regex}).limit(config.faces_by_search).exec(function(err, faces) {
                      console.log('SEARCH BY ACCOUNT NAME', faces);
                      if (err){
                        res.send(err);
                      }else{
                        res.json(faces);
                      }


                  });
                }else{
                  Face.find({number: req.params.query}).limit(config.faces_by_search).exec(function(err, faces) {
                      console.log('SEARCH BY NUMBER', faces);
                      if (err){
                        res.send(err);
                      }else{
                        res.json(faces);
                      }


                  });
                }

            });


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
publicRouter.get('/', function(req, res) {
    res.render('home', {data:{'config': config, 'currentUser': req.user}});
    //res.sendfile(path.resolve('./public/register.html'));
});

/****** SCRAPING **********/

var CronJob = require('cron').CronJob;
/*new CronJob('*15 * * * * *', function() {
  console.log('You will see this message every 15 second');

  request.get({url:/*'http://localhost:3000/scraping/blank''https://stark-plateau-2977.herokuapp.com/scraping/blank'}, function (err, response, body) {
    console.log('BODY', 'LOL');
  });

}, null, true, 'France/Paris');*/

publicRouter.get('/initnumbers/', function(req, res, next) {
  Face.find(function(err, faces) {
    console.log('FACES LENGTH', faces.length);
    var nb = 1;

    for(var i = 0; i < faces.length; i++){
      faces[i].number = nb;
      faces[i].save(function(err){
        console.log('ERREUR', err);
      });
      nb = nb + 3;
    }

    res.json(faces);
  });
});

publicRouter.get('/initclaims/', function(req, res, next) {
  Face.find(function(err, faces) {
    console.log('FACES LENGTH', faces.length);
    var nb = 1;
    var k = 1;
    for(var i = 0; i < faces.length; i++){
      faces[i].claim = (k == -1) ? false:true;
      faces[i].claim = (faces[i].network == 'facebook') ? true : faces[i].claim;
      faces[i].save(function(err){
        console.log('ERREUR', err);
      });
      k = k * -1;
    }

    res.json(faces);
  });
});

publicRouter.get('/put_to_scrap/:number', function(req, res, next) {
  Face.findOne({'number': req.params.number},function(err, face) {
    console.log('PUT TO SCRAP', face);
      face.claim = false;
      face.save(function(err){
        console.log('ERREUR', err);
      });



  });

  Face.find(function(err, faces) {
      if (err){
        res.send(err);
      }
      res.render('register', {'faces': faces, 'nbFaces': (faces.length + 1)});
      //res.json(faces);
  });

});

publicRouter.get('/delete/:number', function(req, res, next) {
  Face.remove({
      number: req.params.number
  }, function(err, face) {
      if (err){
        res.send(err);
      }else{

      }
  });

  Face.find(function(err, faces) {
      if (err){
        res.send(err);
      }
      res.render('register', {'faces': faces, 'nbFaces': (faces.length + 1)});
      //res.json(faces);
  });
});

publicRouter.get('/moderate', function(req, res, next) {
  Face.find(function(err, faces) {
      if (err){
        res.send(err);
      }
      res.render('register', {'faces': faces, 'nbFaces': (faces.length + 1)});
      //res.json(faces);
  });

});


publicRouter.get('/populate/', function(req, res, next) {

  var client = new Twitter({
    consumer_key: config.TWITTER_CONSUMER_KEY,
    consumer_secret: config.TWITTER_CONSUMER_SECRET,
    access_token_key: config.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: config.TWITTER_ACCESS_TOKEN_SECRET
  });

  /*client.get('users/search', {q: req.params.query }, function(error, tweets, response){
     res.render('scraping', {'tweets': tweets});
  });*/




    Scrap.distinct('twitter_id').limit(1000).exec(function(err, scrapes) {
      //console.log('POPULATE', scrapes);

      for(var i = 0; i < scrapes.length; i++){

        function closureScrapToFace() {
          var currentScrape = scrapes[i];
          var number = i + 3;

          function insertScrapToFace() {
            console.log('TIMEOUT',i, currentScrape);

            client.get('users/show', {user_id: currentScrape}, function(error, currentUser, response){
              var user = currentUser;

              console.log('USER TWITTER', user);

              request.get({url: user.profile_image_url.replace('_normal',''), encoding: 'binary'}, function (err, response, body) {
                fs.writeFile(imgDestPath + '/' + user.id + '.jpeg', body, 'binary', function(error) {
                  if(error){
                    console.log(error);
                  }
                  else{
                    var face = new Face();
                    face.accountname = user.name;  // set the faces name (comes from the request)
                    face.firstname = user.screen_name;  // set the faces name (comes from the request)
                    face.lastname = user.screen_name;  // set the faces name (comes from the request)
                    face.number = number;  // set the faces name (comes from the request)
                    face.picture = '/img/' + user.id + '.jpeg';  // set the faces name (comes from the request)
                    //face.picture = face.picture.replace('_normal','');  // set the faces name (comes from the request)
                    face.network = 'twitter';  // set the faces name (comes from the request)
                    face.network_id = user.id;  // set the faces name (comes from the request)
                    face.lang = user.lang;  // set the faces name (comes from the request)
                    console.log('PROFILE TWITTER', user);
                    // save the face and check for errors
                      face.save(function(err) {
                          if (err){
                            console.log(err);
                          }

                      });


                  }

                });
              });
            });
          }
          return insertScrapToFace;
        }

        setTimeout(closureScrapToFace(), 3000 * i);
      }
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

  client.get('search/tweets', {q: /*req.params.query + */'rt since:2015-06-08', /*lang:'en',*/ count:100}, function(error, tweets, response){
     //console.log('TWEETS', tweets);

     for(var i= 0; i < tweets.statuses.length; i++){


       function closureAddScrap(){
         var currentTweet = tweets.statuses[i];

         function addScrap(){
           console.log('CURRENT TWEET', currentTweet.id);
           Scrap.find({twitter_id: currentTweet.user.id}, function(err, scrapes) {

               if(scrapes.length > 0){
                 userExist = true;
                 console.log('SCRAPE',scrapes);
                 scrapes[0].occurs = scrapes[0].occurs + 1;
                 console.log('SCRAPE',scrapes);
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

         return addScrap;
       }

       var closure = closureAddScrap();
       closure();


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

//LOGIN / LOGOUT
publicRouter.get('/login/facebook',
function(req,res,next) {
  passport.authenticate(
    'facebook',
     {callbackURL: '/login/facebook/callback' }
  )(req,res,next);
});

app.get('/login/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/#login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/#number/' + req.user.number);
  });

publicRouter.get('/login/twitter',
function(req,res,next) {
  passport.authenticate(
    'twitter',
     {callbackURL: '/login/twitter/callback' }
  )(req,res,next);
});

app.get('/login/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/#login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/#number/' + req.user.number);
  });

  app.get('/logout', function(req, res){
      console.log("logging out");
      console.log(req.user);
      req.logout();
      res.redirect('/');
  });

/****** END LOGIN / LOGOUT *********/

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

publicRouter.get('/auth/twitter/decline/:id',
  function(req,res,next) {
    passport.authenticate(
      'twitter',
       {callbackURL: '/auth/twitter/decline/callback/'+req.params.id }
    )(req,res,next);
});

publicRouter.get('/auth/twitter/decline/callback/:id',
function(req,res,next) {
  passport.authenticate(
    'twitter',
     {
       callbackURL:"/auth/twitter/decline/callback/" + req.params.id
     , successRedirect:"/decline/" + req.params.id
     , failureRedirect:"/error"
     , failureFlash: true
     }
   ) (req,res,next);
  }
);


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
            res.render('home', {data:{'config': config, 'error': 'Account name does not match. Sorry'}});
        }else{
            face.claim = true;
            face.save(function(err) {
                if (err){
                  console.log('ERROR SAVE NUMBER', err);
                }
                res.render('home', {data:{'config': config, 'editedFace': face, 'currentUser': req.user, 'claim': true}});

            });
          }
        }

        //res.json(faces);
    });





});

publicRouter.get('/decline/:id', function(req, res, next) {

    console.log('DECLINE', req.user, req.params.id );


    Face.findOne({'accountname': req.user.accountname},function(err, face) {
        if (err){
          console.log('UTILISATEUR NON TROUVE', err);
        }else{

        if(req.user.accountname != req.params.id){
            res.render('home', {data:{'config': config, 'error': 'Account name does not match. Sorry'}});
        }else{
            Face.remove({
                accountname: req.params.id
            }, function(err, face) {
                if (err){
                  res.send(err);
                }else{
                  res.render('home', {data:{'config': config, 'decline': true, 'declineFace':req.params.id}});
                }
            });

          }
        }

        //res.json(faces);
    });





});


publicRouter.get('/success/:id', function(req, res, next) {

  console.log('REQ ID', req.session);

  Face.findOne({'_id': req.user._id},function(err, face) {
      if (err){
        console.log('UTILISATEUR NON TROUVE', err);
      }else{
          if(!face.number > 0){
            face.number = req.params.id == 0 ? 1 : req.params.id;
            req.user.number = req.params.id == 0 ? 1 : req.params.id;
          }

          face.save(function(err) {
              if (err){
                console.log('ERROR SAVE NUMBER', err);
              }
              /*fbgraph.setAccessToken(req.user.access_token);

              var wallPost = {
                message: 'Test inscription one millions humans'
              };

              fbgraph.post("/feed", wallPost, function(err, res) {
                // returns the post id
                console.log(res); // { id: xxxxx}
              });*/
              res.redirect('/#success/');
              //res.render('home', {'data':{'config': config, 'editedFace': face, 'currentUser': req.user, 'register': true}});

          });
      }

      //res.json(faces);
  });

});

/***** EDIT PART *******/
publicRouter.get('/edit/:number', function(req, res, next) {

  Face.findOne({'number': req.params.number}, function(err, face) {
      if (err){
        res.send(err);
      }
      if(face.number == req.user.number){
        //face.occupations = JSON.parse(face.occupations);
        console.log('OCCUPATIONS', face.occupations);
        res.render('home', {data:{'config': config, 'editedFace': face, 'currentUser': req.user}});
      }else{
        res.send(err);
      }

      //res.json(faces);
  });
});

publicRouter.get('/number/:number', function(req, res, next) {

  /***** IMAGE manipulation *****/
  var number = parseInt(req.params.number, 10);
  var numberArray = [number - 1001, number - 1000, number - 999, number - 1, number, number + 1, number + 999, number + 1000, number + 1001];

  Face.find({number:{$in:numberArray}}).sort('number').exec(function(err, faces) {

      var tempFaces = _.clone(faces);
      //var randomPicture;

        if (err){
          res.send(err);
        }
        for(var i = 0; i < numberArray.length; i++){
          //randomPicture = Math.round(Math.random()*config.nbFreeSlotFacesPictures-1)+1;

          if( ! _.find(tempFaces, function(currentFace){ return currentFace.number == numberArray[i]; }) ){
              tempFaces.push({'number': numberArray[i], picture: '/img/noimage.jpg'});
          }
        }

      tempFaces = _.sortBy(tempFaces, 'number');

      var im = gm.subClass({ imageMagick: true });



      var img1 = im(publicPath + tempFaces[0].picture);
      var img2 = im(publicPath + tempFaces[3].picture);
      var img3 = im(publicPath + tempFaces[6].picture);

      img1.append(publicPath + tempFaces[1].picture, publicPath + tempFaces[2].picture,  true);
      img2.append(publicPath + tempFaces[4].picture, publicPath + tempFaces[5].picture,  true);
      img3.append(publicPath + tempFaces[7].picture, publicPath + tempFaces[8].picture,  true);

      img1.write(imgDestPath + '/' + number + '-temp-1.jpg'
      , function(stdout){
        console.log('IMG DEST PATH 1', imgDestPath + '/' + number + '-temp-1.jpg');
        img2.write(imgDestPath + '/' + number + '-temp-2.jpg'
        , function(stdout2){
          console.log('IMG DEST PATH 2', imgDestPath + '/' + number + '-temp-2.jpg');
          img3.write(imgDestPath + '/' + number + '-temp-3.jpg'
          , function(stdout3){
            console.log('IMG DEST PATH 3', imgDestPath + '/' + number + '-temp-3.jpg');
            var imgFinal = im(imgDestPath + '/' + number + '-temp-1.jpg');
            imgFinal.append(imgDestPath + '/' + number + '-temp-2.jpg', imgDestPath + '/' + number + '-temp-3.jpg', false);

            //.append(publicPath + tempFaces[3].picture,false);
            //Pas de boucle trop compliqué

            imgFinal.write(imgDestPath + '/' + number + '-mozaic.jpg'
            , function(stdout4){
              console.log('IMG DEST PATH', imgDestPath + '/' + number + '-mozaic.jpg');

              Face.findOne({'number': req.params.number}, function(err, face) {
                  if (err){
                    res.send(err);
                  }
                  res.render('home', {data:{'config': config, 'showFace': face, 'currentUser': req.user}});
              });
            });

          });
        });

      });




      /*im(imgDestPath + '/logo.jpg')
      .append(imgDestPath + '/logo.jpg', true)
      .write(imgDestPath + '/logo-test.jpg'
      , function(stdout){
        console.log('STD OUT', stdout);
      });*/

  });

  /******************************/



});

/***********************/

publicRouter.get('/error', function(req, res, next) {
  //console.log('FLASH', req.flash());
  var errors = req.flash();
  res.render('home', {data:{'config': config, 'error' : errors.error[0]}});
  //res.json(faces);

});

publicRouter.get('/share/:number', function(req, res, next) {
  //console.log('FLASH', req.flash());
  res.render('share', {data:{'config': config, 'number' : req.params.number}});
  //res.json(faces);

});

app.use('/api', router);
app.use('/', publicRouter);



// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
