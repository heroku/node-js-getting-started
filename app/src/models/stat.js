// app/models/face.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StatSchema   = new Schema({
    lang: String,
    count: Number
});

module.exports = mongoose.model('Stat', StatSchema);
