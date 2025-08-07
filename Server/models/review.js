const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    review: { type: String, required: true },
    businessDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
      }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Reviews", reviewSchema);