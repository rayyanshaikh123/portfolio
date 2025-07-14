import mongoose, { Schema, models, model } from 'mongoose';

const AchievementSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // optional image upload
  type: { type: String, default: 'achievement' },
}, { timestamps: true });

export default models.Achievement || model('Achievement', AchievementSchema); 