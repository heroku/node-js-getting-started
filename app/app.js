var config   = require('./config');
var download = require('./download');

//MONGO
var mongoose        = require('mongoose');
var Face            = require('./models').Face;
var FaceHelper      = require('./FaceHelper');
var Scrap           = require('./models').Scrap;
var Stat            = require('./models').Stat;

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
var flash          = require('connect-flash');
var Twitter        = require('twitter');
var fbgraph        = require('fbgraph');
var _              = require('underscore');
var mime           = require('mime');
var auth           = require('basic-auth');
var nodalytics     = require('nodalytics');
var passport       = require('passport');
var logger         = require('morgan');

//get file
var imgDestPath  = path.resolve('./public/img');
var imgDestPath  = path.resolve('./public/img');
var publicPath   = path.resolve('./public');
var gm           = require('gm');
var os           = require('os');

var routes = require('./routes');  //all define routes
var s3bucket = require('./providers/aws');  //aws provider

var admins = {
  'human': { password: 'human@123' },
};


//mongoDb connection
mongoose.connect(config.mongodb,{useMongoClient: true});

//express configuration
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public')); //set public folder to static >> but now host in amazon s3
app.use(flash());
app.use(nodalytics('UA-67692075-1'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
if(process.env.NODE_ENV != "production")  //disable log for production
  app.use(logger('dev'));

/***** HANDLEBARS HELPERS ******/

app.engine('handlebars',
  exphbs({
    defaultLayout: 'main',
    helpers: {
        'checked': function(search, list){
          if(list){
            var listTab = JSON.parse(list);
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


// ROUTES FOR OUR API
// =============================================================================
var publicRouter = express.Router();

// root route (accessed at GET http://localhost:3000)
publicRouter.get('/', function(req, res) {
    res.render('home', {data:{'config': config, 'currentUser': req.user}});
});


publicRouter.get('/put_to_scrap/:number', function(req, res, next) {
  Face.findOne({'number': req.params.number},function(err, face) {
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

  });

});


publicRouter.get('/moderate/:offset', function(req, res, next) {

  var currentOffset = req.params.offset ? parseInt(req.params.offset, 10) : 0;

  Face.find().skip(req.params.offset).limit(1000).exec(function(err, faces) {
      if (err){
        res.send(err);
      }
      res.render('register', {'next': currentOffset + 1000,'config':config, 'previous': currentOffset - 1000, 'faces': faces, 'nbFaces': (faces.length + 1)});
  });

});



publicRouter.get('/register', function(req, res, next) {
  Face.find(function(err, faces) {
      if (err){
        console.log('ERROR', err);
        res.send(err);
      }
      res.render('register', {'faces': faces, 'nbFaces': (faces.length + 1), currentUser: req.user });
  });
});


publicRouter.get('/claim/:id', function(req, res, next) {

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
    });

});

publicRouter.get('/decline/:id', function(req, res, next) {

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

    });

});


publicRouter.get('/success/:id', function(req, res, next) {

  Face.findOne({'_id': req.user._id},function(err, face) {
      if (err){
        console.log('UTILISATEUR NON TROUVE', err);
      }else{
          if(!face.number){
            face.number = req.params.id == 0 ? 1 : req.params.id;
            req.user.number = req.params.id == 0 ? 1 : req.params.id;
            face.number_id = parseInt(face.number, 10) - 1;
          }

          FaceHelper.getPreviousFace(face.number, function(previousFace){

            FaceHelper.getNextFace(face.number, function(nextFace){
              face.previous = previousFace.number;
              face.next = nextFace.number;

              Face.findOneAndUpdate({_id: previousFace._id}, { $set: { next: face.number }},{}, function(err){
                //console.log('ERREUR', err);

              });
              Face.findOneAndUpdate({_id: nextFace._id}, { $set: { previous: face.number }}, {}, function(err){
                //console.log('ERREUR', err);
              });

              face.save(function(err) {
                  if (err){
                    console.log('ERROR SAVE NUMBER', err);
                  }
                  res.redirect('/#success/');

              });
            });

          });


      }

  });

});

/***** EDIT PART *******/
publicRouter.get('/edit/:number', function(req, res, next) {

  Face.findOne({'number': req.params.number}, function(err, face) {
      if (err){
        res.send(err);
      }
      if(face.number == req.user.number){
        res.render('home', {data:{'config': config, 'editedFace': face, 'currentUser': req.user}});
      }else{
        res.send(err);
      }

  });
});


var getImagesForMozaic = function(number, callback){

        Face.findOne({'number': number}, function(err, face) {
            if (err){
              res.send(err);
            }

            download('http://files.onemillionhumans.com' + face.picture, publicPath + face.picture, function(errDownload,filename){
              if(!errDownload){
                  callback(null, face);
              }
            });

        });

};

var createFindImage = function(number, face, callback){
  var im = gm;

  gm()
  .command("composite")
  .in("-gravity", "Center")
  .in(publicPath + face.picture)
  .in(imgDestPath + '/human_share.jpg')
  .write(imgDestPath + '/' + number + '-temp.png' , function (err2) {
    var imgFinalMozaic = im(imgDestPath + '/' + number + '-temp.png');
    console.log('FACE IMAGE', face);

    //imgFinalMozaic.crop(450, 236, 0, 107);
    imgFinalMozaic.stream(function(err, stdout, stderr) {

      console.log('STREAM');

      var buf = new Buffer('');

      if(stdout){

        stdout.on('data', function(data) {
           buf = Buffer.concat([buf, data]);
        });

        stdout.on('end', function(data) {
          console.log('END STREAM');
          var data = {
            Bucket: config.S3_BUCKET_NAME,
            ACL: 'public-read',
            Key: 'img/mozaic/' + number + '-mozaic.png',
            Body: buf,
            ContentType: mime.lookup(imgDestPath + '/' + number + '-temp.png')
          };

          s3bucket.putObject(data, function(errr, ress) {

              if(errr){
                console.log(errr);
                callback(errr, null);
              }
              else{
                callback(null, imgDestPath + '/' + number + '-temp.png');
              }
            });
          });
        }
    });

  });

};

publicRouter.get('/number/:number', function(req, res, next) {
  console.log("get /number");
  /***** IMAGE manipulation *****/
  var number = parseInt(req.params.number, 10);
  getImagesForMozaic(number, function(err, image){

    console.log('IMAGE NUMBER', image);

    createFindImage(number, image, function(err1){

      Face.findOne({'number': req.params.number}, function(err, face) {
          if (err){
            res.send(err);
          }
          //res.send('test');
          res.render('home', {data:{'config': config, 'showFace': face, 'currentUser': req.user}});
      });
    });

  });

});



publicRouter.get('/error', function(req, res, next) {
  var errors = req.flash();
  res.render('home', {data:{'config': config, 'error' : errors.error[0]}});
});

publicRouter.get('/share/:number', function(req, res, next) {
  res.render('share', {data:{'config': config, 'number' : req.params.number}});
});

app.use(function(req, res, next) {
    config.root_url = req.protocol + "://" + req.get('host');
    config.assets_url = req.protocol + "://files." + req.get('host');
    return next();
});
//basic auth
if(config.need_auth){
  app.use(function(req, res, next) {

    var user = auth(req);
    if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
      res.set('WWW-Authenticate', 'Basic realm="example"');
      return res.status(401).send();
    }
    return next();
  });
}






app.use(routes);
app.use('/', publicRouter);

module.exports = app;

// START THE SERVER
// // =============================================================================
// var port = config.PORT || 3000;        // set our port
// app.listen(port);
// process.env['PATH'] = '/sbin:/bin:/usr/sbin:/usr/bin:/usr/local/bin';
// console.log('SERVER LAUNCHED ON PORT ' + port );
