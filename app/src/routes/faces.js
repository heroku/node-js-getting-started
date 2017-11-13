import _ from 'underscore';
import express from 'express';

import {Face} from '../models';
import config from '../config';

const router = express.Router();

router.post('/',(req, res) => {
  var face = new Face();      // create a new instance of the Face model
  face.accountname = req.body.accountname;  // set the faces name (comes from the request)
  face.firstname = req.body.firstname;  // set the faces name (comes from the request)
  face.lastname = req.body.lastname;  // set the faces name (comes from the request)
  face.number = req.body.number;  // set the faces name (comes from the request)
  face.number_id = parseInt(req.body.number, 10) - 1;  // set the faces name (comes from the request)
  face.picture = req.body.picture;  // set the faces name (comes from the request)
  face.network = req.body.network;  // set the faces name (comes from the request)

  // save the face and check for errors
  face.save((err) => {
      if (err)
          return res.send(err);
      res.json({ message: 'Face created!' });
  });
});

// get all the faces (accessed at GET http://localhost:8080/api/faces)
router.get('/',(req, res) => {
    Face.find((err, faces) => {
        if (err)
            return res.send(err);
        res.json(faces);
    });
});

router.get('/:face_id', (req, res) => {
    Face.findById(req.params.face_id, (err, face) => {
        if (err)
            return res.send(err);
        res.json(face);
    });
});

router.post('/:face_id', (req, res) =>{
    Face.findById(req.params.face_id, (err, face) => {
        if (err)
          return res.send(err);
        face.occupations = JSON.stringify(req.body.occupations);
        face.lang = req.body.lang;
        face.website = req.body.website;
        face.accountname = req.body.accountname;

        face.save((err) => {
            if (err)
                return res.send(err);
            res.json({ 'message': 'Face saved!', 'face': face});
        });
    });
});

router.delete('/:face_id', (req, res) => {
    Face.remove({
        _id: req.params.face_id
    }, (err, face) => {
        if (err)
            return res.send(err);
        res.json({ message: 'Successfully deleted' });
    });
});

router.get('/not_human/:number', (req, res) => {
    Face.findOneAndUpdate({"number": req.params.number}, {not_human : true}, {new : true}, (err, face) => {
        if (err)
          return res.send(err);
        res.json({ 'message': 'Face Not Human saved!', 'face': face});
    });
});

router.get('/number/:number', (req,res) => {
    var number = req.params.number;
    Face.find({number:{$gt:(number - 1),$lt:(number + config.faces_by_request)}}).sort('number').limit(config.faces_by_request).exec((err, faces) =>{
          var tempFaces = _.clone(faces);

          if (err)
            return res.send(err);
          for(var i = number; i < parseInt(number, 10) + parseInt(config.faces_by_request, 10); i++){
            if( ! _.find(tempFaces, (currentFace) => { return currentFace.number == i; }) ){
              tempFaces.push({'number': i});
            }
          }
        tempFaces = _.sortBy(tempFaces, 'number');
        res.json(tempFaces);
    });
});

router.get('/range/:range', (req, res) => {
    var range = JSON.parse('[' + req.params.range + ']');

    Face.find({number:{$in:range}}).sort('number').exec((err, faces) => {

        var tempFaces = _.clone(faces);
        if (err)
            return res.send(err);
        for(var i = 0; i < range.length; i++){

            if( ! _.find(tempFaces, (currentFace) => { return currentFace.number == range[i]; }) ){
                tempFaces.push({'number': range[i]});
            }
        }

        tempFaces = _.sortBy(tempFaces, 'number');
        res.json(tempFaces);
    });
});


router.get('/search/:query', (req, res) => {
    var regex = new RegExp('.*' + req.params.query + '.*', "i");
    var testInt = parseInt(req.params.query, 10);

    if(_.isNaN(testInt)){
        Face.find({accountname: regex}).limit(config.faces_by_search).exec((err, faces) => {
            //console.log('SEARCH BY ACCOUNT NAME', faces);
            if (err)
                return res.send(err);
            res.json(faces);
        });
    }else{
        Face.find({number: req.params.query}).limit(config.faces_by_search).exec((err, faces) => {
            //console.log('SEARCH BY NUMBER', faces);
            if (err)
                return res.send(err);
            res.json(faces);
        });
    }
});

export default router;