import request from 'request';
import fs from 'fs';
import gm from 'gm';

import {Face, Stats} from './models';
import s3bucket from './providers/aws';


function addStat(Lang){
    Stat.find({ lang:Lang}, (err, stats) => {
  
      //No results create it
      if(stats.length == 0){
        var stat = new Stat();
        stat.lang = Lang;
        stat.count = 1;
        // save the stat and check for errors
        stat.save((errr) => {
            if (errr){
              console.log('ERROR CREATE STATS', err);
            }
        });
  
      }else{
        Stat.findOneAndUpdate({_id: stats[0]._id}, { $set: { count: stats[0].count + 1 }},{}, (err) =>{
          if (errr){
            console.log('ERREUR SAVE STATS', errr);
          }
        });
      }
      console.log('STATS', err, stats);
    });
};



function createUserFromTwitter(twitterUserData, number, done){
    if(twitterUserData.profile_image_url){
    /****************REFACTOR**********************/
        request.get({url: twitterUserData.profile_image_url.replace('_normal',''), encoding: 'binary'}, (err, response, body) => {
            fs.writeFile(imgDestPath + '/' + twitterUserData.id + '.jpeg', body, 'binary',(errorFile) => {
                s3bucket.createBucket(() => {
                    gm(imgDestPath + '/' + twitterUserData.id + '.jpeg')
                    .resize("150", "150")
                    .stream((err, stdout, stderr) => {
                        /***/
                        var buf = new Buffer('');
                        if(stdout){
                            stdout.on('data',(data) => {
                                buf = Buffer.concat([buf, data]);
                            });
                            stdout.on('end',(data) => {
                                var data = {
                                    Bucket: config.S3_BUCKET_NAME,
                                    ACL: 'public-read',
                                    Key: 'img/' + twitterUserData.id + '.jpeg',
                                    Body: buf,
                                    ContentType: mime.lookup(imgDestPath + '/' + twitterUserData.id + '.jpeg')
                                };
                                s3bucket.putObject(data,(errr, res) => {
                                    if(errr)
                                        return console.log(errr);
                                    var face = new Face();
                                    face.accountname = twitterUserData.name;  // set the faces name (comes from the request)
                                    face.firstname = twitterUserData.screen_name;  // set the faces name (comes from the request)
                                    face.lastname = twitterUserData.screen_name;  // set the faces name (comes from the request)
                                    face.number = number;  // set the faces name (comes from the request)
                                    face.picture = '/img/' + twitterUserData.id + '.jpeg';  // set the faces name (comes from the request)
                                    face.network = 'twitter';  // set the faces name (comes from the request)
                                    face.network_id = twitterUserData.id;  // set the faces name (comes from the request)
                                    face.lang = twitterUserData.lang;  // set the faces name (comes from the request)
                                    face.non_human = false;  // set the faces name (comes from the request)
                                    //console.log('PROFILE TWITTER', twitterUserData.id);

                                    //STATS
                                    addStat(face.lang);

                                    // save the face and check for errors
                                    face.save(function(err) {
                                        if (err)
                                            console.log(err);
                                    });

                                    if(done)
                                        return done(null, face);
                                });
                            });
                        }
              /***/
                    });
                });
            });
        });
    }
}
 
function download(uri, filename, callback){
    request.head(uri, (err, res, body) => {
      if (err) callback(err, filename);
      else {
          var stream = request(uri);
          stream.pipe(
              fs.createWriteStream(filename)
                  .on('error', (err) => {
                      callback(error, filename);
                      stream.read();
                  })
              )
          .on('close', () => {
              callback(null, filename);
          });
      }
    });
};

var FaceHelper = {
    getPreviousFace: (number, callback) => {
      Face.find({number:{$lt:number}}).limit(10).sort({'number':'desc'}).exec((err, faces) => {
          callback(faces[0]);
      });
    },
    getNextFace: (number, callback) =>{
      Face.find({number:{$gt:number}}).limit(10).sort({'number':'asc'}).exec((err, faces) => {
          callback(faces[0]);
      });
    }
  };


export default {createUserFromTwitter, addStat, download, FaceHelper};