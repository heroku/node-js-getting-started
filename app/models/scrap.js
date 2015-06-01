// app/models/face.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ScrapSchema   = new Schema({
    accountname: String,
    twitter_id: String,
    img_path: String,
    location: String,
    followers_count: String,
    created_at: String,
    lang: String,
    time_zone: String,
    verified: String,
    statuses_count: Number
});

module.exports = mongoose.model('Scrap', ScrapSchema);
