import mongoose, { Schema, models, model } from 'mongoose';

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: { type: [String], default: [] },
  date: { type: String, required: true },
  image: { type: String },
  link: { type: String },
}, { timestamps: true });

export default models.Project || model('Project', ProjectSchema); 