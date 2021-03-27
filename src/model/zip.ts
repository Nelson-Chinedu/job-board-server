import { Schema, model } from 'mongoose';

const zipSchema = new Schema({
  city: String,
  zip: String,
  state: String,
});

export default model('zip', zipSchema);
