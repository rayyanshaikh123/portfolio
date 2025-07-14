import mongoose, { Schema, models, model } from 'mongoose';

const CertificateSchema = new Schema({
  issuer: { type: String }, // now optional
  link: { type: String }, // optional verification link
  image: { type: String }, // optional image upload
  type: { type: String, default: 'certificate' },
}, { timestamps: true });

export default models.Certificate || model('Certificate', CertificateSchema); 