const Review = require("../models/review"); // Adjust the path to your Review model
const Business = require("../models/business"); // Adjust the path to your Business model
const mongoose = require("mongoose");

const addReview = async (req, res) => {
  try {
    const { businessId } = req.params; // Fetch business ID from params
    const { name, email, review } = req.body; // Get review details from the request body

    // Check if the business exists
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ msg: "Business not found" });
    }

    // Create the new review
    const newReview = await Review.create({
      name,
      email,
      review,
      businessDetail: businessId, // Link the review to the business
    });

    return res.status(201).json({
      msg: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({
      msg: "An error occurred while adding the review. Please try again later.",
    });
  }
};

const getReviews = async (req, res) => {
  const { businessId } = req.params;

  // Validate businessId
  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    return res.status(400).json({ error: "Invalid Business ID" });
  }

  try {
    const reviews = await Review.find({ businessDetail: businessId });

    // If no reviews found
    // if (!reviews.length) {
    //   return res.status(404).json({ message: "No reviews found for this business" });
    // }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};


module.exports = { addReview , getReviews };
