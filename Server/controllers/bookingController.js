const mongoose = require("mongoose");
const Booking = require("../models/bookingDetails");
const User = require("../models/users");
const Business = require("../models/business");
const Admin = require("../models/admin");
const Services = require("../models/services");
const { sendBookingMail } = require("../helper/bookingMail");
const jwt = require("jsonwebtoken");

const updateBookingStatus = async (req, res) => {
  const { bookingId, status, serviceId } = req.body;
  const validStatuses = ["pending", "confirmed", "Cancel"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking status updated", booking });
  } catch (err) {
    console.error("Error updating status:", err);
    res
      .status(500)
      .json({ message: "Failed to update status", error: err.message });
  }
};

const addBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      dateOfBirth,
      mobileNumber,
      guestCount,
      bookingDate,
      bookingTime,
      customerNotes,
      serviceId,
    } = req.body;

    const userId = req.user._id;
    const businessId = req.params.businessId;

    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({ msg: "User not found" });
    }

    const businessDetails = await Business.findById(businessId).populate(
      "ownerDetails",
      "email"
    );
    if (!businessDetails) {
      return res.status(404).json({ msg: "Business not found" });
    }
    const ownerEmail = businessDetails?.ownerDetails?.email;
    let serviceDetails;
    if (serviceId) {
      serviceDetails = await Services.findById(serviceId);
      if (!serviceDetails) {
        return res.status(404).json({ msg: "Service not found" });
      }
    }
    const booking = await Booking.create({
      name,
      email,
      dateOfBirth,
      mobileNumber,
      guestCount,
      bookingDate,
      bookingTime,
      customerNotes,
      business: businessId,
      service: serviceId || null,
    });

    await User.findByIdAndUpdate(
      userId,
      { $push: { bookingDetails: booking._id } },
      { new: true }
    );

    await Business.findByIdAndUpdate(
      businessId,
      { $push: { bookings: booking._id } },
      { new: true }
    );
    if (email) {
      try {
        console.log("Mail is sent to :- " + req.body.email);
        await sendBookingMail(
          req.body.email,
          name,
          bookingDate,
          bookingTime,
          guestCount
        );
        console.log("Booking details mail sent");
      } catch (error) {
        console.log("Error sending the mail " + error);
      }
    }
    res.status(201).json({
      msg: "Booking created successfully!",
      data: booking,
    });
  } catch (err) {
    console.error("Booking Creation Error:", err);
    res.status(500).json({
      msg: "An error occurred while booking",
      error: err.message,
    });
  }
};

const getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().populate("bookings");
    res.json({
      status: 200,
      msg: "Businesses exist",
      data: businesses,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "An error occurred while fetching businesses",
    });
  }
};

const updateBookingDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const schemaFields = Object.keys(Booking.schema.paths);

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

    const updateData = await Booking.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    res.json({
      status: 200,
      msg: "Booking updated",
      data: updateData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "An error occurred while updating the booking",
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteData = await Booking.findByIdAndDelete(id);
    if (deleteData) {
      res.json({
        status: 200,
        msg: "Booking deleted successfully",
        data: deleteData,
      });
    } else {
      res.status(404).json({
        msg: "Booking not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "An error occurred while deleting the booking",
    });
  }
};

const getBooking = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(401).json({ msg: "Unauthorized - User ID not found" });
  }
  try {
    const user = await User.findById(userId).populate({
      path: "bookingDetails",
      populate: [
        {
          path: "business",
          model: "Business",
          select: "businessName",
        },
        {
          path: "service",
          model: "Services",
          select: "name price",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json({
      bookings: user.bookingDetails,
    });
  } catch (err) {
    console.error("Detailed Error:", err);
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
      stack: err.stack,
    });
  }
};

const getEarningsForLast10Days = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded._id;

    const admin = await Admin.findById(adminId).populate(
      "adminBusinesses",
      "_id"
    );
    if (!admin || admin.adminBusinesses.length === 0) {
      return res
        .status(404)
        .json({ message: "No businesses found for this admin" });
    }

    const businessId = admin.adminBusinesses[0]._id;
    const last10Days = [];
    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      last10Days.push(date.toISOString().split("T")[0]);
    }

    const earningsByDate = {};
    for (const date of last10Days) {
      earningsByDate[date] = 0;
    }

    const bookings = await Booking.find({
      business: businessId,
      bookingDate: { $in: last10Days },
    }).populate("service", "price");

    bookings.forEach((booking) => {
      const date = booking.bookingDate;
      const servicePrice = booking.service?.price || 0;
      earningsByDate[date] += servicePrice;
    });

    res.status(200).json({
      success: true,
      data: last10Days.map((date) => ({
        date,
        earnings: earningsByDate[date],
      })),
    });
  } catch (error) {
    console.error("Error fetching earnings:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  const { paymentId, bookingId, paymentStatus } = req.body;
  const validStatuses = ["paid", "not paid", "Paid", "Not Paid"];

  if (!validStatuses.includes(paymentStatus)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus: paymentStatus, paymentId: paymentId },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Payment status updated", booking });
  } catch (err) {
    console.error("Error updating status:", err);
    res
      .status(500)
      .json({ message: "Failed to update status", error: err.message });
  }
};

module.exports = {
  addBooking,
  getBusinesses,
  getBooking,
  updateBookingDetails,
  deleteBooking,
  updateBookingStatus,
  getEarningsForLast10Days,
  updatePaymentStatus,
};
