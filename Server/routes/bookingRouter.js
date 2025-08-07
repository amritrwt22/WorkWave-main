const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const bookingValidate = require("../middlewares/bookingValidate");
const bookingDetailsAuth = require("../middlewares/bookingDetailsAuth");
const userauthMiddleware = require("../middlewares/UserAuthMiddleware");

const extractBusinessId = (req, res, next) => {
  req.businessId = req.params.businessId;
  console.log(req.businessId);

  next();
};
router.get("/getBookingLast10Days", bookingController.getEarningsForLast10Days);
router.post(
  "/addbooking/:businessId/:serviceId",
  userauthMiddleware,
  bookingValidate,
  bookingDetailsAuth,
  extractBusinessId,
  bookingController.addBooking
);

router.post("/updateStatus", bookingController.updateBookingStatus);
router.put("/updatePayment", bookingController.updatePaymentStatus);
router.get("/getBooking", bookingController.getBusinesses);
router.post("/update-booking/:id", bookingController.updateBookingDetails);
router.post("/delete-booking/:id", bookingController.deleteBooking);

module.exports = router;
