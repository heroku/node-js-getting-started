import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var StatSchema   = new Schema({
    lang: String,
    count: Number
});

export default mongoose.model('Stat', StatSchema);
