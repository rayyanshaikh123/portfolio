import mongoose, { Schema, models, model } from 'mongoose';

const SkillSchema = new Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Skill = models.Skill || model('Skill', SkillSchema);

export default Skill; 