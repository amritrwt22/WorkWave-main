
const express = require('express');
const app = express();
const router = express.Router();
const  userAuth = require('../middlewares/UserAuthMiddleware');
const  userController = require('../controllers/userController');
const bookingController = require('../controllers/bookingController');

router.get('/user', userAuth, userController.getProfile);
router.get('/bookings',userAuth, bookingController.getBooking);

module.exports = router;