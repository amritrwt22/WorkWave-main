const UserModel = require("../models/users");
const bcrypt = require("bcrypt");
const { otpStorage } = require("./sendOtp"); // Import storage, not OTP

const verifyOtp = async (req, res) => {
  try {
    const { getotp, email, newPassword, confirmPassword } = req.body;

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    // ✅ Get OTP specific to this email
    const storedData = otpStorage.get(email);

    if (!storedData) {
      return res.status(400).json({ msg: "No OTP found or expired" });
    }

    // ✅ Check if OTP has expired
    if (Date.now() > storedData.expires) {
      otpStorage.delete(email);
      return res.status(400).json({ msg: "OTP has expired" });
    }

    // ✅ Verify OTP
    if (storedData.otp !== getotp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    // ✅ OTP is correct, remove it and update password
    otpStorage.delete(email);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      msg: "Password Updated Successfully",
      nextPage: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
};

module.exports = verifyOtp;
