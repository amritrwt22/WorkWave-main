const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userValidation = require("../middlewares/userValidate");
const userLogin = require("../middlewares/userLogin");
const userAuth = require("../middlewares/UserAuthMiddleware")

router.post("/signup", userValidation, userController.register);
router.post("/login", userController.login);

// delete user
router.post("/delete-user/:_id", userLogin , userController.deleteUser);
// update info of user
router.post("/update-user/:_id", userController.updateUser);
router.get("/my-bookings", userLogin, userController.getUserBookings);
router.get("/user-profile" , userAuth , userController.getProfile);

module.exports = router;