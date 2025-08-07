const mongoose = require("mongoose");
const bookingschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    guestCount: {
      type: Number,
      default: 1,
    },
    bookingDate: {
      type: String,
      required: true,
    },
    bookingTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancel"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Not Paid"],
      default: "Not Paid",
    },
    customerNotes: {
      type: String,
      default: "",
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Services",
    },
  },
  { timestamps: true }
);

const bookingDetails = mongoose.model("bookingDetails", bookingschema);

module.exports = bookingDetails;
