const Review = require("../models/reviewModel");

// Function to handle success responses
const sendSuccessResponse = (res, data, message, statusCode) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Function to handle error responses
const sendErrorResponse = (res, errorMessage, statusCode) => {
  res.status(statusCode).json({
    success: false,
    error: errorMessage,
  });
};

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const reviewData = req.body;
    const newReview = await Review.create(reviewData);
    sendSuccessResponse(res, newReview, "Review created successfully.", 201);
  } catch (error) {
    sendErrorResponse(res, "Failed to create review.", 500);
  }
};

// Delete a review by ID
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return sendErrorResponse(res, "Review not found.", 404);
    }
    sendSuccessResponse(
      res,
      deletedReview,
      "Review deleted successfully.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to delete review.", 500);
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    sendSuccessResponse(res, reviews, "Reviews retrieved successfully.", 200);
  } catch (error) {
    sendErrorResponse(res, "Failed to get reviews.", 500);
  }
};

// Get a review by ID
exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) {
      return sendErrorResponse(res, "Review not found.", 404);
    }
    sendSuccessResponse(res, review, "Review retrieved successfully.", 200);
  } catch (error) {
    sendErrorResponse(res, "Failed to get review.", 500);
  }
};
