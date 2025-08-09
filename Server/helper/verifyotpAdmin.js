const AdminModel = require("../models/admin");
const bcrypt = require("bcrypt");
const { adminOtpStorage } = require("./sendotpAdmin"); // Import storage, not OTP

const verifyOtpA = async (req, res) => {
  try {
    const { getotp, email, newPassword, confirmPassword } = req.body;
    
    const user = await AdminModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        msg: "Admin Not Found",
      });
    }

    // ✅ Get OTP specific to this admin email
    const storedData = adminOtpStorage[email];
    
    if (!storedData) {
      return res.status(400).json({
        msg: "No OTP found or OTP has expired"
      });
    }

    // ✅ Check if OTP has expired
    if (Date.now() > storedData.expires) {
      delete adminOtpStorage[email];
      return res.status(400).json({
        msg: "OTP has expired. Please request a new one."
      });
    }

    console.log("Stored OTP:", storedData.otp);
    console.log("Provided OTP:", getotp);
    
    // ✅ Verify OTP
    if (storedData.otp !== getotp) {
      return res.status(400).json({
        msg: "Invalid OTP"
      });
    }

    // ✅ OTP is correct, remove it and update password
    delete adminOtpStorage[email];
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      msg: "Admin Password Updated Successfully",
      nextPage: true,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

module.exports = verifyOtpA;
