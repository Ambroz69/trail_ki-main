import mongoose from 'mongoose';

const trailTranslationSchema = new mongoose.Schema({
  trail: { type: mongoose.Schema.Types.ObjectId, ref: 'Trail', required: true },
  language: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true }
});

export const TrailTranslation = mongoose.model('TrailTranslation', trailTranslationSchema);