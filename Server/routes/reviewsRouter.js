const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post("/add/:businessId" , reviewController.addReview)
router.get("/get/:businessId" , reviewController.getReviews)

module.exports = router;
