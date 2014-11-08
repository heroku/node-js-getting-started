'use strict';

var mongoose = require('mongoose');

var noteSchema = mongoose.Schema({
  noteBody: 'String'
});

module.exports = mongoose.model('Note', noteSchema);
