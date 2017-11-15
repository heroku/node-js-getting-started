import express from 'express';
import path from 'path';
import gm from 'gm';

import { Face } from '../models';
import s3bucket from '../providers/aws';

const router = express.Router();
const imgDestPath = path.resolve('../public/img');

router.get('/numbers/', async(req, res) => {
  try{
    let faces = await Face.find();
    for(var i = 0; i < faces.length; i++) {
      if(faces[i].lang) {
        if(faces[i].lang.length > 2) {
          if(faces[i].lang.length === 5) {
            await Face.findOneAndUpdate({ _id: faces[i]._id }, { $set: { lang: faces[i].lang.substring(3) } });
          }
        }
      }
      res.send('Success');
    }
  }catch(err) {
    res.json(err);
  }
});
    
router.get('/claims/', async(req, res) => {
  try{
    let faces = await Face.find();
    var k = 1;
    for(var i = 0; i < faces.length; i++) {
      faces[i].claim = false;
      await faces[i].save();
      k = k * -1;
    }
    res.json(faces);
  }catch(err) {
    res.json(err);
  }
});

const createMozaic = async(number, tempFaces, callback) => {
  try{
    var color = '#e6ff34';
    var im = gm;
    await im(450, 450, color).drawText(10, 50, 'from scratch').write('${imgDestPath}/${number}-temp.png');
    await gm().command('composite').in('-gravity', 'NorthWest').in(publicPath + tempFaces[0].picture).in('${imgDestPath}/${number}-temp.png').write('${imgDestPath}/${number}-temp.png');
    await gm().command('composite').in('-gravity', 'North').in(publicPath + tempFaces[1].picture).in('${imgDestPath}/${number}-temp.png').write('${imgDestPath}/${number}-temp.png');
    await gm().command('composite').in('-gravity', 'NorthEast').in(publicPath + tempFaces[2].picture).in('${imgDestPath}/${number}-temp.png').write('${imgDestPath}/${number}-temp.png');
    await gm().command('composite').in('-gravity', 'West').in(publicPath + tempFaces[3].picture).in('${imgDestPath}/${number}-temp.png').write('${imgDestPath}/${number}-temp.png');
    await gm().command('composite').in('-gravity', 'Center').in(publicPath + tempFaces[4].picture).in('${imgDestPath}/${number}-temp.png').write('${imgDestPath}/${number}-temp.png');
    await gm().command('composite').in('-gravity', 'East').in(publicPath + tempFaces[5].picture).in('${imgDestPath}/${number}-temp.png').write('${imgDestPath}/${number}-temp.png');
    await gm().command('composite').in('-gravity', 'SouthWest').in(publicPath + tempFaces[6].picture).in('${imgDestPath}/${number}-temp.png').write('${imgDestPath}/${number}-temp.png');
    await gm().command('composite').in('-gravity', 'South').in(publicPath + tempFaces[7].picture).in('${imgDestPath}/${number}-temp.png').write('${imgDestPath}/${number}-temp.png');
    await gm().command('composite').in('-gravity', 'SouthEast').in(publicPath + tempFaces[8].picture).in('${imgDestPath}/${number}-temp.png').write('${imgDestPath}/${number}-temp.png');
    let imgFinalMozaic = im('${imgDestPath}/${number}-temp-final.png');
    imgFinalMozaic.crop(450, 236, 0, 107);
    let stdout = await imgFinalMozaic.stream();
    var  buf = new Buffer('');
    stdout.on('data', (data) => {
      buf = Buffer.concat([ buf, data ]);
    });
    await stdout.on('end');
    let data = {
      Bucket: config.S3_BUCKET_NAME,
      ACL: 'public-read',
      Key: 'img/mozaic/${number}-mozaic.png',
      Body: buf,
      ContentType: mime.lookup('${imgDestPath}/${number}-temp-final.png')
    };
    await s3bucket.putObject(data);
    callback(null, '${imgDestPath}/${number}-temp-final.png');
  }catch(err) {
    callback(err, null);
  }
};

export default router;
