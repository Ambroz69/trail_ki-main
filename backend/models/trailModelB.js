import mongoose from 'mongoose';

const trailSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  language: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Challenging', 'Difficult'],
    required: true,
  },
  locality: { type: String, required: true },
  season: { type: String, required: true },
  length: { type: Number, default: 0 },
  estimatedTime: { type: Number, default: 0 },
  thumbnail: { type: String },
  rating: { type: Number, default: 0 },
  published: { type: Boolean, default: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  points: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Point' }],
});

export const Trail = mongoose.model('Trail', trailSchema);