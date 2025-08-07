const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role : {
      type : String,
      default : "admin"
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobile_number: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: false,
    },
    address: {
      type: String,
      required: true,
    },
    adminBusinesses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Business",
      },
    ],
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
