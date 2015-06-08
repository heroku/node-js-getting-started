// app/models/face.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FaceSchema   = new Schema({
    firstname: String,
    lastname: String,
    accountname: String,
    number: { type: Number, min: 0, max: 1000000 }, //registration number
    range: { type: Number, min: 0, max: 1000000 }, //to find by query language
    picture: String,
    network: String,
    network_id: {type: String, unique:true},
    lang: String,
    website: String,
    occupation: String,
    claim: {type: Boolean, default: true},
    access_token: String,
    refresh_token: String
});

module.exports = mongoose.model('Face', FaceSchema);
