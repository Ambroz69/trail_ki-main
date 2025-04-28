import mongoose from 'mongoose';

const translatedAnswerSchema = new mongoose.Schema({
  text: { type: String },
  pairText: { type: String },
  minValue: { type: Number },
  maxValue: { type: Number },
  isCorrect: { type: Boolean }
});

const quizTranslationSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  language: { type: String, required: true },
  question: { type: String },
  answers: [translatedAnswerSchema],
  feedback: {
    correct: { type: String },
    incorrect: { type: String }
  },
  feedbackContent: { type: String }
});

export const QuizTranslation = mongoose.model('QuizTranslation', quizTranslationSchema);