import _ from 'underscore';
import express from 'express';

import {Face} from '../models';
import config from '../config';

const router = express.Router();

router.post('/',async (req, res) => {
  var face = new Face();      // create a new instance of the Face model
  face.accountname = req.body.accountname;  // set the faces name (comes from the request)
  face.firstname = req.body.firstname;  // set the faces name (comes from the request)
  face.lastname = req.body.lastname;  // set the faces name (comes from the request)
  face.number = req.body.number;  // set the faces name (comes from the request)
  face.number_id = parseInt(req.body.number, 10) - 1;  // set the faces name (comes from the request)
  face.picture = req.body.picture;  // set the faces name (comes from the request)
  face.network = req.body.network;  // set the faces name (comes from the request)

  // save the face and check for errors
  try{
    let response = await face.save();
    res.json({message : 'Face created'});
  }catch(err){
    res.json(err);
  }
});

// get all the faces (accessed at GET http://localhost:8080/api/faces)
router.get('/', async (req, res) => {
  try{
    res.json(await Face.find());
  }catch(err){
    res.json(err);
  }
});

router.get('/:id', async (req, res) => {
  try{
    res.json(await Face.findById(req.params.id));
  }catch(err){
    res.json(err);
  }
});

router.post('/:id', async (req, res) => {
  try{
    let data_update =  {occupation, lang, website, accountname} = req.body;
    res.json(await Face.findOneAndUpdate(req.params.id, data_update, {new: true}));
  }catch(err){
    res.json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try{
    await Face.remove({_id : req.params.id});
    res.json({message: 'Successfully deleted'});
  }catch(err){
    res.json(err);
  }
});

router.get('/not_human/:number', async (req, res) => {
  try{
    let face = await Face.findOneAndUpdate({"number": req.params.number}, {not_human : true}, {new : true});
    res.json({ 'message': 'Face Not Human saved!', 'face': face});
  }catch(err){
    res.json(err);
  }
});

router.get('/number/:number', async (req,res) => {
  try{
    let number = req.params.number;
    let faces = await Face.find({number:{$gt:(number - 1),$lt:(number + config.faces_by_request)}}).sort('number').limit(config.faces_by_request).exec();
    let tempFaces = _.clone(faces);
    for(var i = number; i < parseInt(number, 10) + parseInt(config.faces_by_request, 10); i++){
      if( ! _.find(tempFaces, (currentFace) => { return currentFace.number == i; }) ){
        tempFaces.push({'number': i});
      }
    }
    tempFaces = _.sortBy(tempFaces, 'number');
    res.json(tempFaces);
  }catch(err){
    res.json(err);
  }
});

router.get('/range/:range', async (req, res) => {
  try{
    let range = JSON.parse('[' + req.params.range + ']');
    let faces = await Face.find({number: {$in: range}}).sort('number').exec();
    let tempFaces = _.clone(faces);
    for(var i = 0; i < range.length; i++){
      if( ! _.find(tempFaces, (currentFace) => { return currentFace.number == range[i]; }) )
        tempFaces.push({'number': range[i]});
    }
    tempFaces = _.sortBy(tempFaces, 'number');
    res.json(tempFaces);
  }catch(err){
    res.json(err);
  }
});


router.get('/search/:query', async (req, res) => {
  try{
    let regex = new RegExp('.*' + req.params.query + '.*', "i");
    let testInt = parseInt(req.params.query, 10);
    var query = _.isNaN(testInt) ? {accountname: regex} : {number: req.params.query};
    let faces = await Face.find(query).limit(config.faces_by_search).exec();
    res.json(faces);
  }catch(err){
    res.json(err);
  }
});

export default router;