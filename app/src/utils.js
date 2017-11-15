import request from 'request';
import fs from 'fs';
import gm from 'gm';

import { Face, Stats } from './models';
import s3bucket from './providers/aws';


const addStat = async(Lang) => {
  try{
    const stats = await Stats.find({ lang: Lang });
    if(stats.length == 0) {
      let newStat = new Stats();
      newStat.lang = Lang;
      newStat.count = 1;
      await newStat.save();
    }else{
      await Stats.findOneAndUpdate({ _id: stats[0]._id }, { $set: { count: stats[0].count + 1 } });
    }
  }catch(err) {
    console.log(err);
  }
};

const createUserFromTwitter = async(twitterUserData, number, done) => {
  if(twitterUserData.profile_image_url) {
    /** REFACTOR **/
    try{
      const { body } = await request.get({ url: twitterUserData.profile_image_url.replace('_normal', ''), encoding: 'binary' });
      await fs.writeFile('{$imgDestPath}/${twitterUserData.id}.jpeg', body, 'binary');
      await s3bucket.createBucket();
      const stdout = await gm('{$imgDestPath}/${twitterUserData.id}.jpeg').resize('150', '150').stream();
      let buf = new Buffer('');
      let data = stdout.on('data');
      buf = Buffer.concat([ buf, data ]);
      await stdout.on('end');
      let s3data = {
        Bucket: config.S3_BUCKET_NAME,
        ACL: 'public-read',
        Key: 'img/${twitterUserData.id}.jpeg',
        Body: buf,
        ContentType: mime.lookup('${imgDestPath}/${twitterUserData.id}.jpeg')
      };
      await s3bucket.putObject(s3data);
      const face = new Face();
      face.accountname = twitterUserData.name; // set the faces name (comes from the request)
      face.firstname = twitterUserData.screen_name; // set the faces name (comes from the request)
      face.lastname = twitterUserData.screen_name; // set the faces name (comes from the request)
      face.number = number; // set the faces name (comes from the request)
      face.picture = '/img/${twitterUserData.id}.jpeg'; // set the faces name (comes from the request)
      face.network = 'twitter'; // set the faces name (comes from the request)
      face.network_id = twitterUserData.id; // set the faces name (comes from the request)
      face.lang = twitterUserData.lang; // set the faces name (comes from the request)
      face.non_human = false; // set the faces name (comes from the request)
      addStat(face.lang);
      await face.save();
      if(done)
        done(null, face);

    }catch(err) {
      console.log(err);
    }
  }
};

const download = async(uri, filename, callback) => {
  request.head(uri, (err, res, body) => {
    if (err) callback(err, filename);
    let stream = request(uri);
    stream.pipe(fs.createWriteStream(filename).on('error', () => {
      callback(err, filename);
    })).on('close', () => {
      callback(null, filename);
    });
  });
};

const FaceHelper = {
  getPreviousFace: async(number, callback) => {
    try{
      const faces = await Face.find({ number: { $lt: number } }).limit(10).sort({ 'number': 'desc' } ).exec();
      callback(faces[0]);
    }catch(err) {
      console.log(err);
    }
  },
  getNextFace: async(number, callback) => {
    try{
      const faces = await Face.find({ number: { $gt: number } }).limit(10).sort({ 'number': 'desc' } ).exec();
      callback(faces[0]);
    }catch(err) {
      console.log(err);
    }
  }
};


export default { createUserFromTwitter, addStat, download, FaceHelper };
