// BASE SETUP
// =============================================================================

//MONGO
var mongoose   = require('mongoose');
var config   = require('./app/config');
mongoose.connect(config.mongodb); // connect to our database
var Face     = require('./app/models/face');

// call the packages we need
var express        = require('express');        // call express
var app            = express();
var exphbs         = require('express-handlebars');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var cors           = require('cors');
var session        = require('cookie-session')
var path           = require('path');
var methodOverride = require('method-override')
//path.resolve('../omf-client/public/index.html');

//PASSPORT
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new FacebookStrategy({
  clientID: config.FACEBOOK_APP_ID,
  clientSecret: config.FACEBOOK_APP_SECRET,
  callbackURL: config.FACEBOOK_CALLBACK_URL
}, function(accessToken, refreshToken, profile, done) {
      setTimeout(function() {
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
        face.accountname = profile._json.name;  // set the faces name (comes from the request)
        face.firstname = profile._json.first_name;  // set the faces name (comes from the request)
        face.lastname = profile._json.last_name;  // set the faces name (comes from the request)
        //face.number = 1;  // set the faces name (comes from the request)
        face.picture = 'https://graph.facebook.com/' + profile._json.id + '/picture?type=large';  // set the faces name (comes from the request)
        face.network = 'facebook';  // set the faces name (comes from the request)
        face.network_id = profile._json.id;  // set the faces name (comes from the request)
        console.log('PROFILE FACEBOOK', profile);
        // save the face and check for errors
        face.save(function(err) {
            if (err)
                res.send(err);


                return done(null, face);
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

      var face = new Face();      // create a new instance of the Face model
      /**
       id: 12637422,
       id_str: '12637422',
       name: 'lenoirjeremie',
       screen_name: 'lenoirjeremie',
       location: 'paris',
      **/
      face.accountname = profile._json.name;  // set the faces name (comes from the request)
      face.firstname = profile._json.screen_name;  // set the faces name (comes from the request)
      face.lastname = profile._json.screen_name;  // set the faces name (comes from the request)
      //face.number = 1;  // set the faces name (comes from the request)
      face.picture = profile._json.profile_image_url;  // set the faces name (comes from the request)
      face.picture = face.picture.replace('_normal','');  // set the faces name (comes from the request)
      face.network = 'twitter';  // set the faces name (comes from the request)
      face.network_id = profile._json.id;  // set the faces name (comes from the request)
      console.log('PROFILE TWITTER', profile);
      // save the face and check for errors
      face.save(function(err) {
          if (err)
              res.send(err);


              return done(null, face);
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
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

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


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
publicRouter.get('/', function(req, res) {
    Face.find(function(err, faces) {
        if (err){
          res.send(err);
        }
        res.render('home', {'faces': faces, 'nbFaces': faces.length});
        //res.json(faces);
    });

    //res.sendfile(path.resolve('./public/register.html'));
});

publicRouter.get('/register', function(req, res, next) {
  res.sendfile('./public/register.html');
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
     }
   ) (req,res,next);
  }
);

publicRouter.get('/success/:id', function(req, res, next) {

  Face.findOne({'id': req.user.id},function(err, face) {
      if (err){
        console.log('UTILISATEUR NON TROUVE', err);
      }else{
          console.log('FACE', face);
          face.number = req.params.id;
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
      res.render('home', {'faces': faces, 'nbFaces': faces.length, 'registrationFaces': req.params.id, currentUser: req.user});
      //res.json(faces);
  });
});

publicRouter.get('/error', function(req, res, next) {
  res.send("Error logging in.");
});

app.use('/api', router);
app.use('/', publicRouter);



// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
