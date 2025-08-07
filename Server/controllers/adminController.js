const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Business = require("../models/business");
const { sendGreetMail2 } = require("../helper/mairServices2");
const mongoose = require("mongoose");
const User = require("../models/users");
const register = async (req, res) => {
  try {
    const { name, email, mobile_number, password, gender, address } = req.body;
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { mobile_number }],
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return res.status(400).json({
        msg: "Admin already exists with this email or mobile number",
      });
    }

    const existingUser = await User.findOne({
      email: email,
    });
    if (existingUser) {
      console.log("Email already exists as an User");
      return res.status(401).json({
        msg: "Email already exists as an User",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const admin = await Admin.create({
      name,
      email,
      mobile_number,
      password: hashedPassword,
      gender,
      address,
    });
    if (email && name) {
      try {
        await sendGreetMail2(email, name);
        console.log("Greeting email sent!");
      } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).send("Failed to send greeting email");
      }
    }
    console.log("Admin created:", admin);
    return res.status(201).json({
      msg: "Admin created successfully",
    });
  } catch (err) {
    console.error("Error in register function:", err);
    return res.status(500).json({
      msg: "Please check the details you have entered or try again later",
    });
  }
};

const login = async (req, res) => {
  try {
    console.log("Received login request:", req.body);

    const { email, password } = req.body;
    for (const key in req.body) {
      if (!req.body[key] || req.body[key].trim() === "") {
        console.log(`Field ${key} is missing or empty`);
        return res.status(400).json({
          status: 400,
          msg: `Field ${key} is missing or empty`,
        });
      }
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log("Admin not found with the provided email");
      return res.status(401).json({ msg: "Incorrect credentials" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      console.log("Password does not match");
      return res.status(401).json({ msg: "Incorrect credentials" });
    }

    const business = await Business.findOne({ ownerDetails: admin._id });
    const businessId = business ? business._id : null;
    const token = jwt.sign(
      { email: admin.email, _id: admin._id, userRole: admin.role, businessId },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    console.log(token);
    // res.cookie("__vercel_live_token", token, {
    //   httpOnly: false,
    //   maxAge: 60 * 60 * 1000,
    //   sameSite: "None",
    //   // secure: true, // Only use secure cookie in production
    // });

    console.log("Login successful, returning token");
    res.cookie("token", token, {
      httpOnly: false,
      maxAge: 60 * 60 * 1000,
      sameSite: "None",
      secure: true, // Only use secure cookie in production
    });
    return res.status(200).json({
      token,
      role: admin.role,
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ msg: "An error occurred during login" });
  }
};
const updateAdmin = async (req, res) => {
  try {
    const id = req.params._id;
    const update = req.body;
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }
    const updateData = await Admin.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updateData) {
      return res.status(404).json({
        status: 404,
        msg: "Admin not found",
      });
    }

    res.json({
      status: 200,
      msg: "Admin updated successfully",
      updateData,
    });
  } catch (error) {
    console.error("Error updating Admin:", error);
    res.status(500).json({
      status: 500,
      msg: "An error occurred while updating the Admin",
    });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const id = req.params._id;
    const deleteData = await Admin.findByIdAndDelete(id);
    if (deleteData) {
      res.json({
        status: 200,
        msg: "Admin deleted successfully",
        data: deleteData,
      });
    } else {
      res.json({
        status: 404,
        msg: "Admin not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const getProfile = async (req, res) => {
  try {
    const adminId = req.admin._id;

    if (!adminId) {
      return res.status(401).json({ msg: "Unauthorized - Admin ID not found" });
    }

    const admin = await Admin.findById(adminId).select(
      "name email mobile_number gender address _id"
    );

    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    res.json({
      name: admin.name,
      email: admin.email,
      mobile_number: admin.mobile_number,
      gender: admin.gender,
      address: admin.address,
      _id: admin._id,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching admin details" });
  }
};
module.exports = {
  register,
  login,
  updateAdmin,
  deleteAdmin,
  getProfile,
};
