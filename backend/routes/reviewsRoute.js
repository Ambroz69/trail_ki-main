import express from 'express';
import { Review } from '../models/reviewModel.js';
import auth from '../auth.js';

const router = express.Router();

// Submit a new review
router.post("/", auth, async (request, response) => {
  try {
    const { userId, trail, rating, comment } = request.body;

    // Prevent duplicate reviews
    const existingReview = await Review.findOne({ userId, trail });
    if (existingReview) {
      return response.status(400).json({ message: "You have already reviewed this trail." });
    }

    const review = new Review({ userId, trail, rating, comment });
    await review.save();

    response.status(201).json({ message: "Review submitted successfully!", review });
  } catch (error) {
    response.status(500).json({ message: "Server error", error });
  }
});

// Get all reviews for a trail
router.get("/:trailId", async (request, response) => {
  try {
    const reviews = await Review.find({ trail: request.params.trailId }).populate("userId", "name");
    response.json(reviews);
  } catch (error) {
    response.status(500).json({ message: "Error fetching reviews", error });
  }
});

export default router;