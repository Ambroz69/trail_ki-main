import mongoose from 'mongoose';

const pointTranslationSchema = new mongoose.Schema({
  point: { type: mongoose.Schema.Types.ObjectId, ref: 'Point', required: true },
  language: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String }
});

export const PointTranslation = mongoose.model('PointTranslation', pointTranslationSchema);