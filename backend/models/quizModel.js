import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  text: { type: String },
  pairText: { type: String },
  minValue: { type: Number },
  maxValue: { type: Number },
  isCorrect: { type: Boolean }
});

const quizSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['single', 'multiple', 'short-answer', 'slider', 'pairs', 'order', 'foto', 'true-false'],
    required: true
  },
  points: { type: Number, required: true },
  question: { type: String, required: true },
  answers: [answerSchema],
  feedback: {
    correct: { type: String },
    incorrect: { type: String }
  },
  feedbackContent: { type: String }
});

export const Quiz = mongoose.model('Quiz', quizSchema);