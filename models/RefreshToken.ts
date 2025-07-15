import mongoose, { Schema, model, models } from 'mongoose';

const RefreshTokenSchema = new Schema({
  tokenHash: { type: String, required: true, unique: true },
  user: { type: String, required: true }, // e.g., 'admin'
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

const RefreshToken = models.RefreshToken || model('RefreshToken', RefreshTokenSchema);
export default RefreshToken; 