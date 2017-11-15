import { Strategy } from 'passport-facebook';
import gm from 'gm';
import mime from 'mime';
import fs from 'fs';
import path from 'path';

import config from '../config';
import { addStat } from '../utils';
import { Face } from '../models';

const imgDestPath = path.resolve( __dirname, '../public/img');

const facebook_strategy = new Strategy({
  clientID: config.FACEBOOK_APP_ID,
  clientSecret: config.FACEBOOK_APP_SECRET,
  callbackURL: config.FACEBOOK_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  setTimeout(async() => {
    try{
      const faces = await Face.find({ network: 'facebook', network_id: profile._json.id });
      if(faces.length === 0) {
        const body = await request.get({ url: 'https://graph.facebook.com/${profile._json.id}/picture?type=large', encoding: 'binary' });
        await fs.writeFile('${imgDestPath}/${profile._json.id}.jpeg', body, 'binary');
        await s3buket.createBucket();
        const stdout = await gm('${imgDestPath}/${profile._json.id}.jpeg').resize('150', '150').stream();
        let buf = new Buffer('');
        let data = await stdout.on('data');
        buf = Buffer.concat([ buf, data ]);
        await stdout.on('end');
        let s3data = {
          Bucket: config.S3_BUCKET_NAME,
          ACL: 'public-read',
          Key: 'img/${profile._json.id}.jpeg',
          Body: buf,
          ContentType: mime.lookup('${imgDestPath}/${profile._json.id}.jpeg')
        };
        await s3bucket.putObject(s3data);
        let face = new Face();
        face.accountname = profile._json.name; // set the faces name (comes from the request)
        face.firstname = profile._json.first_name; // set the faces name (comes from the request)
        face.lastname = profile._json.last_name; // set the faces name (comes from the request)
        face.picture = '/img/${profile._json.id}.jpeg'; // set the faces name (comes from the request)
        face.network = 'facebook'; // set the faces name (comes from the request)
        face.network_id = profile._json.id; // set the faces name (comes from the request)
        face.lang = profile._json.locale;
        face.access_token = accessToken;
        face.refresh_token = refreshToken;

        addStat(face.lang);
        await face.save();
        done(null, face);
      }
      done(null, faces, { message: 'User find' });
    }catch(err) {
      done(err, null);
    }
  }, 0);
});

export default facebook_strategy;
