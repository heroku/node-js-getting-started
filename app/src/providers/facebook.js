import {Strategy} from 'passport-facebook';
import gm from 'gm';
import mime from 'mime';
import fs from 'fs';

import config from '../config';
import {addStat} from '../utils';
import {Face} from '../models';

const facebook_strategy = new Strategy({
    clientID: config.FACEBOOK_APP_ID,
    clientSecret: config.FACEBOOK_APP_SECRET,
    callbackURL: config.FACEBOOK_CALLBACK_URL
  }, (accessToken, refreshToken, profile, done) => {
        setTimeout(() => {
  
            var userExist = false;
  
            Face.find({network: 'facebook', network_id: profile._json.id}, (err, faces) => {
                if(faces.length > 0){
                    userExist = true;
                    face = faces[0];
                }
  
                if(userExist == false){
                    var face = new Face();
                    request.get({url: 'https://graph.facebook.com/' + profile._json.id + '/picture?type=large', encoding: 'binary'}, (err, response, body) => {
                    fs.writeFile(imgDestPath + '/' + profile._json.id + '.jpeg', body, 'binary', (errorFile) => {
                        s3bucket.createBucket(() =>{
                            gm(imgDestPath + '/' + profile._json.id + '.jpeg')
                            .resize("150", "150")
                            .stream((err, stdout, stderr) => {
  
                      /***/
                                var buf = new Buffer('');
                                stdout.on('data',(data) => {
                                    buf = Buffer.concat([buf, data]);
                                });
                                stdout.on('end', (data) => {
                                    var data = {
                                        Bucket: config.S3_BUCKET_NAME,
                                        ACL: 'public-read',
                                        Key: 'img/' + profile._json.id + '.jpeg',
                                        Body: buf,
                                        ContentType: mime.lookup(imgDestPath + '/' + profile._json.id + '.jpeg')
                                    };
                                    s3bucket.putObject(data, (errr, res) => {
                                        if(errr){
                                            return console.log(errr);
                                        }
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
                                        //console.log('PROFILE FACEBOOK', profile, imgDestPath);

                                        //STATS
                                        addStat(face.lang);

                                        // save the face and check for errors
                                        face.save((err) => {
                                            if (err)
                                                return res.send(err);
                                            return done(null, face);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }
            else{
              return done(null, face, { message: 'User find' });
            }
          });
        }, 0);
  });

export default facebook_strategy;