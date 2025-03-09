import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId, // quiz question id from trail
    required: true,
  },
  providedAnswer: {
    type: mongoose.Schema.Types.Mixed, // can be a string, array, number, etc., based on the question type
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

const certificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // user id
    ref: 'User',
    required: true,
  },
  trail: {
    type: mongoose.Schema.Types.ObjectId, // trail id
    ref: 'Trail',
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
  score: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Passed', 'Failed', null],
    default: null,
  },
  answers: [answerSchema],
});

export const Certification = mongoose.model('Certification', certificationSchema);