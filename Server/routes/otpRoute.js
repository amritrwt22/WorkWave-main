const express = require("express");
const router = express.Router();
const {sendOtp} = require('../helper/sendOtp')
const verifyOtp = require('../helper/verifyOtp')
const {sendOtpA} = require('../helper/sendotpAdmin')
const verifyOtpA = require('../helper/verifyotpAdmin')

router.post('/sendOtp' , sendOtp)
router.post('/verify' , verifyOtp)
router.post('/sendOtpAdmin' , sendOtpA)
router.post('/verifyAdmin' , verifyOtpA)

module.exports = router;