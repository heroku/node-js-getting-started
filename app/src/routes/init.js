import express from 'express';
import path from 'path';
import gm from 'gm';

import {Faces} from '../models';
import s3bucket from '../providers/aws';

const router = express.Router();
const imgDestPath  = path.resolve('./public/img');

router.get('/numbers/', (req, res, next) => {
    
    Face.find((err, faces) => {
    var nb = 1;

    for(var i = 0; i < faces.length; i++){
        if(faces[i].lang){
            if(faces[i].lang.length > 2){
                if(faces[i].lang.length == 5){
                    Face.findOneAndUpdate({_id: faces[i]._id}, { $set: { lang: faces[i].lang.substring(3) }},{}, (err) => {});
                }
            }
        }
    }

    res.json('SUCCESS');
    });
});
    
router.get('/claims/', (req, res, next) => {
    Face.find((err, faces) => {
        var nb = 1;
        var k = 1;
        for(var i = 0; i < faces.length; i++){
            faces[i].claim = false;
            //faces[i].claim = (faces[i].network == 'facebook') ? true : faces[i].claim;
            faces[i].save((err) => {});
            k = k * -1;
        }
        res.json(faces);
    });
});

var createMozaic = (number, tempFaces, callback) =>{
    //console.log('TEMPFACES', tempFaces);
    var color = '#e6ff34';//colorMapping.getColorByBoxNumber(number);
    var im = gm;//.subClass({ imageMagick: true });
    im(450, 450, color).drawText(10, 50, "from scratch").write(imgDestPath + '/' + number + '-temp.png', (err1) => {
      gm()
      .command("composite")
      .in("-gravity", "NorthWest")
      .in(publicPath + tempFaces[0].picture)
      .in(imgDestPath + '/' + number + '-temp.png')
      .write(imgDestPath + '/' + number + '-temp.png' , (err2) => {
  
        gm()
        .command("composite")
        .in("-gravity", "North")
        .in(publicPath + tempFaces[1].picture)
        .in(imgDestPath + '/' + number + '-temp.png')
        .write(imgDestPath + '/' + number + '-temp.png' , (err3) => {
          gm()
          .command("composite")
          .in("-gravity", "NorthEast")
          .in(publicPath + tempFaces[2].picture)
          .in(imgDestPath + '/' + number + '-temp.png')
          .write(imgDestPath + '/' + number + '-temp.png' , (err4) => {
  
            gm()
            .command("composite")
            .in("-gravity", "West")
            .in(publicPath + tempFaces[3].picture)
            .in(imgDestPath + '/' + number + '-temp.png')
            .write(imgDestPath + '/' + number + '-temp.png' , (err5) => {
  
              gm()
              .command("composite")
              .in("-gravity", "Center")
              .in(publicPath + tempFaces[4].picture)
              .in(imgDestPath + '/' + number + '-temp.png')
              .write(imgDestPath + '/' + number + '-temp.png' , (err6) => {
  
                gm()
                .command("composite")
                .in("-gravity", "East")
                .in(publicPath + tempFaces[5].picture)
                .in(imgDestPath + '/' + number + '-temp.png')
                .write(imgDestPath + '/' + number + '-temp.png' , (err7) => {
  
                  gm()
                  .command("composite")
                  .in("-gravity", "SouthWest")
                  .in(publicPath + tempFaces[6].picture)
                  .in(imgDestPath + '/' + number + '-temp.png')
                  .write(imgDestPath + '/' + number + '-temp.png' ,  (err8) => {
  
                    gm()
                    .command("composite")
                    .in("-gravity", "South")
                    .in(publicPath + tempFaces[7].picture)
                    .in(imgDestPath + '/' + number + '-temp.png')
                    .write(imgDestPath + '/' + number + '-temp.png' ,  (err9) => {
  
                      gm()
                      .command("composite")
                      .in("-gravity", "SouthEast")
                      .in(publicPath + tempFaces[8].picture)
                      .in(imgDestPath + '/' + number + '-temp.png')
                      .write(imgDestPath + '/' + number + '-temp-final.png' ,  (err10) => {
  
  
                        //**************//
                        var imgFinalMozaic = im(imgDestPath + '/' + number + '-temp-final.png');
                        imgFinalMozaic.crop(450, 236, 0, 107);
                        imgFinalMozaic.stream((err, stdout, stderr) => {
  
                          var buf = new Buffer('');
  
                          if(stdout){
  
                            stdout.on('data', (data) => {
                               buf = Buffer.concat([buf, data]);
                            });
  
                            stdout.on('end', (data) => {
  
                              var data = {
                                Bucket: config.S3_BUCKET_NAME,
                                ACL: 'public-read',
                                Key: 'img/mozaic/' + number + '-mozaic.png',
                                Body: buf,
                                ContentType: mime.lookup(imgDestPath + '/' + number + '-temp-final.png')
                              };
  
                              s3bucket.putObject(data, (errr, ress) => {
  
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



export default router;