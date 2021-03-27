import { Schema, model } from 'mongoose';

const jobSchema = new Schema({
  jobTitle: String,
  role: String,
  position: String,
  jobDescription: String,
  howToApply: String,
  companyName: String,
  companyWebsite: String,
  email: String,
  logo: String,
  companyDescription: String,
  companyHeadquarter: String
});

export default model('job', jobSchema);
