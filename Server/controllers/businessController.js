const mongoose = require("mongoose");
const Business = require("../models/business");
const Admin = require("../models/admin");
const upload = require("../helper/multer");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    upload.fields([
      { name: "businessLogo", maxCount: 1 },
      { name: "businessImages", maxCount: 10 },
    ])(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ msg: "Image upload failed", error: err });
      }

      const businessData = req.body;
      const ownerId = req.user._id;

      const ownerDetails = await Admin.findById(ownerId);
      if (!ownerDetails) {
        return res.status(404).json({ msg: "Owner not found" });
      }
      const businessLogo = req.files?.businessLogo?.[0]?.path || null;
      const businessImages =
        req.files?.businessImages?.map((file) => file.path) || [];
      const business = await Business.create({
        ...businessData,
        businessLogo,
        businessImages,
        ownerDetails: ownerDetails._id,
      });
      await Admin.findByIdAndUpdate(
        ownerId,
        {
          $push: {
            adminBusinesses: business._id,
          },
        },
        { new: true }
      );

      res.json({
        msg: "Business added successfully",
        // data: business,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "An error occurred while adding the business",
    });
  }
};
const getBusinesses = async (req, res) => {
  try {
    const getData = await Business.find();
    res.json({
      status: 200,
      msg: "Business exist",
      data: "fetch",
      getData,
    });
  } catch (err) {
    console.log("error fetchinhhg business details");
  }
};
const getBusiness = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Backend: Received id:", id);
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ status: 404, msg: "Business not found" });
    }
    res.json({ status: 200, msg: "Business found", data: business });
  } catch (err) {
    console.error("Error fetching business:", err);
    res.status(500).json({ status: 500, msg: "Internal server error" });
  }
};

const updateBusiness = async (req, res) => {
  try {
    const id = req.params._id;
    const update = req.body;

    const schemaFields = Object.keys(Business.schema.paths);

    for (const key in update) {
      if (!schemaFields.includes(key)) {
        return res.status(400).json({
          status: 400,
          msg: `Unknown field: ${key}`,
        });
      }
      if (!update[key] || update[key].trim() === "") {
        return res.status(400).json({
          status: 400,
          msg: `Field ${key} is missing or empty`,
        });
      }
    }
    const updateData = await Business.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    res.josn({
      status: 200,
      msg: "Business updated",
      data: "updated",
      updateData,
    });
  } catch (error) {
    console.log(error);
  }
};
const deleteBusiness = async (req, res) => {
  try {
    const id = req.params._id;
    const deleteData = await Business.findByIdAndDelete(id);
    if (deleteData) {
      res.json({
        status: 200,
        msg: "Business deleted successfully",
        data: deleteData,
      });
    } else {
      res.json({
        status: 404,
        msg: "Business not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getBookingsByBusiness = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized, no token found" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log("JWT verification error:", err);
      return res.status(401).json({ msg: "Invalid or expired token" });
    }
    const businessId = decoded.businessId; // Business ID from the decoded token
    if (!businessId) {
      return res.status(400).json({ msg: "Business ID is required" });
    }
    const businessDetails = await Business.findById(businessId);
    if (!businessDetails) {
      return res.status(404).json({ msg: "Business not found" });
    }
    const bookings = await Business.findById(businessId)
      .populate("bookings")
      .populate("services");

    res.status(200).json(bookings);

    console.log(bookings);
  } catch (err) {
    console.log("Error fetching bookings:", err);
    res.status(500).json({
      msg: "An error occurred while fetching bookings",
      error: err.message,
    });
  }
};

module.exports = {
  register,
  getBusinesses,
  getBusiness,
  updateBusiness,
  deleteBusiness,
  getBookingsByBusiness,
};
