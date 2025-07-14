import mongoose, { Schema, models, model } from 'mongoose';

const TimelineSchema = new Schema({
  title: { type: String, required: true },
  year: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Timeline = models.Timeline || model('Timeline', TimelineSchema);

export default Timeline; 