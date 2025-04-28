import mongoose from 'mongoose';

const pointSchema = new mongoose.Schema({
  trail: { type: mongoose.Schema.Types.ObjectId, ref: 'Trail', required: true },
  title: { type: String, required: true },
  content: { type: String },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  audioPath: { type: String },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }
});

export const Point = mongoose.model('Point', pointSchema);