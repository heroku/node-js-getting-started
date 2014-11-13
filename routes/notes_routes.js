'use strict';

var Note = require('../models/note');

module.exports = function(app, jwtauth, expired) {
  app.post('/api/notes', [jwtauth, expired], function(req, res) {
    var note = new Note(req.body);
    note.email = req.user.basic.email;
    note.time = new Date().getTime();

    note.save(function(err, data) {
      if (err) { return res.status(500).json({}); }
      res.json({'Notes': [data]});
    });
  });

  app.post('/api/notes/get', jwtauth, function(req, res) {
    Note.find({email: req.user.basic.email}, function(err, data) {
      if (err) { return res.status(500).json({}); }
      res.json({'Notes': data});
    });
  });

  app.post('/api/notes/get/:id', jwtauth, function(req, res) {
    Note.findOne({'_id': req.params.id}, function(err, data) {
      if (err) { return res.status(500).json({}); }
      res.json({'Notes': [data]});
    });
  });

  app.put('/api/notes/:id', jwtauth, function(req, res) {
    var note = req.body;
    note.email = req.user.basic.email;
    note.time = new Date().getTime();
    delete note._id;

    Note.findOneAndUpdate({'_id': req.params.id}, note, function(err, data) {
      if (err) { return res.status(500).json({}); }
      res.json({'Notes': [data]});
    });
  });

  app.delete('/api/notes/:id', jwtauth, function(req, res) {
    Note.remove({'_id': req.params.id}, function(err) {
      if (err) { return res.status(500).json({}); }
      res.json({});
    });
  });
};
