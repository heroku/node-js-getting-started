var config   = require('./app/config');
var download = require('./app/download');

//MONGO
var mongoose        = require('mongoose');
var Face            = require('./app/models/face');
var FaceHelper      = require('./app/FaceHelper');
var Scrap           = require('./app/models/scrap');
var Stat            = require('./app/models/stat');

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

//PASSPORT
var passport         = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
//get file
var fs           = require('fs');
var request      = require('request');
var path         = require('path');
var imgDestPath  = path.resolve('./public/img');
var publicPath   = path.resolve('./public');
var gm           = require('gm');
var os           = require('os');

var routes = require('./app/routes');

//basic auth
var auth = require('basic-auth');

var admins = {
  'human': { password: 'human@123' },
};

//AWS SERVICES
var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
AWS.config.update({ //endpoint: 'https://files.onemillionhumans.com.s3-website-us-west-2.amazonaws.com',
                    Bucket: config.S3_BUCKET_NAME,
                    accessKeyId: config.AWS_ACCESS_KEY_ID,
                    secretAccessKey: config.AWS_SECRET_ACCESS_KEY});


var s3bucket = new AWS.S3();




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

//set public folder to static >> but now host in amazon s3
app.use(express.static('public'));

app.use(flash());

var port = config.PORT || 3000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
var publicRouter = express.Router();
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

// more routes for our API will happen here

// on routes that end in /faces
// ----------------------------------------------------

app.use(routes);

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
publicRouter.get('/', function(req, res) {
    res.render('home', {data:{'config': config, 'currentUser': req.user}});
});

/****** SCRAPING **********/

var CronJob = require('cron').CronJob;
/*new CronJob('*15 * * * * *', function() {

  console.log('You will see this message every 30 second');

  request.get({url:'https://vast-wave-2744.herokuapp.com/scraping/blank'}, function (err, response, body) {
    console.log('BODY', 'LOL');

    Scrap.count({}, function( err7, count){

        console.log( "Number of SCRAP:", count );

        if(count > 100000){

        var Client = require('ftp');

          var c = new Client();

          var mds = require('mongo-dump-stream');

          var dumpFileName = publicPath + '/' + Date.now() + '-scrap.db';
          var out = fs.createWriteStream(dumpFileName);

          c.on('ready', function() {
            c.put(dumpFileName, 'omh-scraping/' + Date.now() + '-scrap.db', function(err3) {
              if (err3){
                console.log('ERREUR', err4);
              }
              c.end();

              fs.unlink(dumpFileName, function(err5){
                console.log('DUMP FILE NAME DELETE', err5);
              });

            });
          });

          return mds.dump(config.mongodb, out, function(err6) {
            if (!err6) {

              console.log('ERREUR DUMP', err6);

              Scrap.remove({}, function(err4, face) {
                  if (err4){
                    res.send(err4);
                  }
              });
              c.connect({
                host: '188.121.47.126', // required
                user: 'lenoirjeremie', // required
                password: 'Marijuana@12', // required
                port: 21 // optional
                // port is added to the end of the host, ex: sftp://domain.com:22 in this case
              });

            }
          });
        }

    });


  });

}, null, true, 'France/Paris');*/

publicRouter.get('/initnumbers/', function(req, res, next) {

  Face.find(function(err, faces) {
    var nb = 1;

    for(var i = 0; i < faces.length; i++){
      if(faces[i].lang){
        if(faces[i].lang.length > 2){
          if(faces[i].lang.length == 5){
            Face.findOneAndUpdate({_id: faces[i]._id}, { $set: { lang: faces[i].lang.substring(3) }},{}, function(err){
              //console.log('ERREUR', err);

            });
          }
        }
      }

    }

    res.json('SUCCESS');
  });

  /*Face.find(function(err, faces) {
    console.log('FACES LENGTH', faces.length);
    var nb = 1;

    for(var i = 0; i < faces.length; i++){
      faces[i].number = nb;
      faces[i].previous = nb - 3;
      faces[i].next = nb + 3;
      faces[i].save(function(err){
        console.log('ERREUR', err);
      });
      nb = nb + 3;
    }

    res.json(faces);
  });*/
});

publicRouter.get('/initclaims/', function(req, res, next) {
  Face.find(function(err, faces) {
    var nb = 1;
    var k = 1;
    for(var i = 0; i < faces.length; i++){
      faces[i].claim = false;
      //faces[i].claim = (faces[i].network == 'facebook') ? true : faces[i].claim;
      faces[i].save(function(err){
        //console.log('ERREUR', err);
      });
      k = k * -1;
    }

    res.json(faces);
  });
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



publicRouter.get('/populate/', function(req, res, next) {

  var client = new Twitter({
    consumer_key: config.TWITTER_CONSUMER_KEY,
    consumer_secret: config.TWITTER_CONSUMER_SECRET,
    access_token_key: config.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: config.TWITTER_ACCESS_TOKEN_SECRET
  });

    Scrap.find({scraped: {$exists: false }}).limit(100000).exec(function(err, scrapes) {
      var scrapList = [];
      var scrapObject = [];
      var j = 0, boucle = 1;

      for(var i = 0; i < scrapes.length; i++){
        //if(scrapes[i].scraped == true)continue;

        if(j > 99){

          function closureScrapToFace() {
            var currentList = _.uniq(scrapList);
            var scrapObjectTemp = _.uniq(scrapObject);
            var number = i + 3;

            function insertScrapToFace() {
              client.get('users/lookup', {user_id: currentList.join(',')}, function(error, users, response){
                  if(users){
                    for(var k = 0; k < users.length; k++){
                      createUserFromTwitter(users[k], number);
                      number += 3;
                    }
                  }

                  for(var s = 0; s < scrapObjectTemp.length; s++){
                    scrapObjectTemp[s].scraped = true;
                    scrapObjectTemp[s].save(function(erreur){
                      if(erreur){
                        console.log('ERREUR SAVE SCRAPED', this);
                      }
                    });
                  }

              });
            }
            return insertScrapToFace;
          }

          setTimeout(closureScrapToFace(), (boucle * 15000));
          scrapList.splice(0,scrapList.length);
          scrapObject.splice(0,scrapObject.length);

          j = 0;
          boucle++;
        }

        scrapList.push(scrapes[i].twitter_id);
        scrapObject.push(scrapes[i]);

        j++;
      }

    });
    res.json('works');
});


publicRouter.get('/delete_scrap_in/', function(req, res, next) {

  var deleteScrapInFace = function (scrape){
    Face.findOne({'network_id': scrape.twitter_id},function(err, face) {
        if(face){
          scrape.remove(function(err){
            if(err){
              console.log('ERREUR DELETE SCRAP',scrape);
            }
          });
        }
    });
  };

  Scrap.find().limit(100000).exec(function(err, scrapes) {
      for(var i = 0; i < scrapes.length; i++){
        deleteScrapInFace(scrapes[i]);
      }
  });
  res.json('exec');
});

publicRouter.get('/scraping/:query', function(req, res, next) {
  var client = new Twitter({
    consumer_key: config.TWITTER_CONSUMER_KEY,
    consumer_secret: config.TWITTER_CONSUMER_SECRET,
    access_token_key: config.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: config.TWITTER_ACCESS_TOKEN_SECRET
  });


  client.get('search/tweets', {q: /*req.params.query + */'rt since:2015-06-08', /*lang:'en',*/ count:100}, function(error, tweets, response){

     for(var i= 0; i < tweets.statuses.length; i++){


       function closureAddScrap(){
         var currentTweet = tweets.statuses[i];

         function addScrap(){
           Scrap.find({twitter_id: currentTweet.user.id}, function(err, scrapes) {

               if(scrapes.length > 0){
                 userExist = true;
                 scrapes[0].occurs = scrapes[0].occurs + 1;
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
               scrap.twitter_id= currentTweet.user.id;
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
        console.log('ERROR', err);
        res.send(err);
      }
      res.render('register', {'faces': faces, 'nbFaces': (faces.length + 1), currentUser: req.user });
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
  passport.authenticate('facebook', {callbackURL: '/login/facebook/callback', failureRedirect: '/#login' }),
  function(req, res) {
    // Successful authentication, redirect home.

    if(req.user.number){
      res.redirect('/#number/' + req.user.number);
    }else{
      res.redirect('/#nonumber');
    }

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
    //console.log("logging out");
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
     //, scope: ['publish_actions']
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

var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

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

var createMozaic = function(number, tempFaces, callback){


  //console.log('TEMPFACES', tempFaces);
  var color = '#e6ff34';//colorMapping.getColorByBoxNumber(number);

  var im = gm;//.subClass({ imageMagick: true });
  im(450, 450, color).drawText(10, 50, "from scratch").write(imgDestPath + '/' + number + '-temp.png', function (err1) {
    gm()
    .command("composite")
    .in("-gravity", "NorthWest")
    .in(publicPath + tempFaces[0].picture)
    .in(imgDestPath + '/' + number + '-temp.png')
    .write(imgDestPath + '/' + number + '-temp.png' , function (err2) {

      gm()
      .command("composite")
      .in("-gravity", "North")
      .in(publicPath + tempFaces[1].picture)
      .in(imgDestPath + '/' + number + '-temp.png')
      .write(imgDestPath + '/' + number + '-temp.png' , function (err3) {
        gm()
        .command("composite")
        .in("-gravity", "NorthEast")
        .in(publicPath + tempFaces[2].picture)
        .in(imgDestPath + '/' + number + '-temp.png')
        .write(imgDestPath + '/' + number + '-temp.png' , function (err4) {

          gm()
          .command("composite")
          .in("-gravity", "West")
          .in(publicPath + tempFaces[3].picture)
          .in(imgDestPath + '/' + number + '-temp.png')
          .write(imgDestPath + '/' + number + '-temp.png' , function (err5) {

            gm()
            .command("composite")
            .in("-gravity", "Center")
            .in(publicPath + tempFaces[4].picture)
            .in(imgDestPath + '/' + number + '-temp.png')
            .write(imgDestPath + '/' + number + '-temp.png' , function (err6) {

              gm()
              .command("composite")
              .in("-gravity", "East")
              .in(publicPath + tempFaces[5].picture)
              .in(imgDestPath + '/' + number + '-temp.png')
              .write(imgDestPath + '/' + number + '-temp.png' , function (err7) {

                gm()
                .command("composite")
                .in("-gravity", "SouthWest")
                .in(publicPath + tempFaces[6].picture)
                .in(imgDestPath + '/' + number + '-temp.png')
                .write(imgDestPath + '/' + number + '-temp.png' , function (err8) {

                  gm()
                  .command("composite")
                  .in("-gravity", "South")
                  .in(publicPath + tempFaces[7].picture)
                  .in(imgDestPath + '/' + number + '-temp.png')
                  .write(imgDestPath + '/' + number + '-temp.png' , function (err9) {

                    gm()
                    .command("composite")
                    .in("-gravity", "SouthEast")
                    .in(publicPath + tempFaces[8].picture)
                    .in(imgDestPath + '/' + number + '-temp.png')
                    .write(imgDestPath + '/' + number + '-temp-final.png' , function (err10) {


                      //**************//
                      var imgFinalMozaic = im(imgDestPath + '/' + number + '-temp-final.png');
                      imgFinalMozaic.crop(450, 236, 0, 107);
                      imgFinalMozaic.stream(function(err, stdout, stderr) {

                        var buf = new Buffer('');

                        if(stdout){

                          stdout.on('data', function(data) {
                             buf = Buffer.concat([buf, data]);
                          });

                          stdout.on('end', function(data) {

                            var data = {
                              Bucket: config.S3_BUCKET_NAME,
                              ACL: 'public-read',
                              Key: 'img/mozaic/' + number + '-mozaic.png',
                              Body: buf,
                              ContentType: mime.lookup(imgDestPath + '/' + number + '-temp-final.png')
                            };

                            s3bucket.putObject(data, function(errr, ress) {

                                if(errr){
                                  console.log(errr);
                                  callback(errr, null);
                                }
                                else{
                                  callback(null, imgDestPath + '/' + number + '-temp-final.png');
                                }
                              });
                            });
                          }
                      });
                      //**************//

                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });



};

publicRouter.get('/number/:number', function(req, res, next) {

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







  /******************************/

});

/***********************/

publicRouter.get('/error', function(req, res, next) {
  var errors = req.flash();
  res.render('home', {data:{'config': config, 'error' : errors.error[0]}});
});

publicRouter.get('/share/:number', function(req, res, next) {
  res.render('share', {data:{'config': config, 'number' : req.params.number}});
});
var nodalytics = require('nodalytics');
app.use(nodalytics('UA-67692075-1'));

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
//
app.use('/api', router);
app.use('/', publicRouter);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// START THE SERVER
// =============================================================================
mongoose.connect(config.mongodb);
app.listen(port);
process.env['PATH'] = '/sbin:/bin:/usr/sbin:/usr/bin:/usr/local/bin';
console.log('SERVER LAUNCHED ON PORT' + port );
//console.log('ENV', process.env);
