'use strict';

var mongoose = require('mongoose');
var wordfilter = require('wordfilter');

var noteSchema = mongoose.Schema({
  noteBody: 'String'
});

var Note = mongoose.model('Note', noteSchema);

Note.schema.path('noteBody').validate(function(value) {
  return !value || value.length > 140 || !wordfilter.blacklisted(value);
}, 'Invalid post');

module.exports = Note;
