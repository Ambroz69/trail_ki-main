import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    default: "",
  },  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Review = mongoose.model('Review', reviewSchema);