import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ScrapSchema   = new Schema({
    accountname: String,
    twitter_id: {type: String, unique: true},
    img_path: String,
    location: String,
    followers_count: String,
    created_at: String,
    lang: String,
    time_zone: String,
    verified: String,
    scraped: {type: Boolean, default: false},
    statuses_count: Number,
    occurs: {type: Number, default: 1}
});

export default mongoose.model('Scrap', ScrapSchema);
