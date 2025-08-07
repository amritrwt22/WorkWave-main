const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role : {
      type : String,
      default : "user"
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobile_number: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other" , "male" , "female" , "other"],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    bookingDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bookingDetails",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
