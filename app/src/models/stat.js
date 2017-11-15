import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const StatSchema = new Schema({
  lang: String,
  count: Number
});

export default mongoose.model('Stat', StatSchema);
