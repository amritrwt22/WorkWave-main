import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import img from "./2.avif";
import toast from "react-hot-toast";
import axios from "axios";

const ForgotPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword || !otp || !email) {
      toast.error("Please fill out all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("NewPassword and Confirm password must be same");
      return;
    }
    try {
      const response = await axios.post(
        "https://workwave-backend.onrender.com/otp/verify",
        {
          email,
          newPassword,
          confirmPassword,
          getotp: otp,
        }
      );

      if (response.data.nextPage) {
        toast.success("Password reset successfully!");
        navigate("/user-login");
      }
    } catch (err) {
      toast.error(
        err.response.data.msg || "An error occurred. Please try again."
      );
    }
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      const input = e.target.value;
      const otpRegex = /^[0-9]{6}$/;

      if (otpRegex.test(input)) {
        console.log("Valid OTP:", input);
        toast.success("Valid Otp!");
      } else {
        console.log("Invalid OTP");
        toast.success("InValid Otp!");
      }
    }
  };
  return (
    <>
      <div className="flex h-screen items-center justify-center p-4 bg-white rounded-lg">
        <div className="flex h-[500px] w-8/12 rounded-lg">
          <div className="h-full w-1/2 bg-customdarkblue">
            <img
              src={img}
              className="h-full w-full object-cover"
              alt="Form Illustration"
            />
          </div>
          <div className="flex flex-col items-center justify-center w-1/2 bg-gray-500 p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white">Hello, Again</h1>
              <p
                className="text-lg text-white
          "
              >
                We are happy to have you back.
              </p>
            </div>
            <div className="w-full max-w-md space-y-4">
              <input
                type="text"
                className="w-full p-4 text-black bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                onKeyUp={handleInputEnter}
              />
              <input
                type="password"
                className="w-full p-4 text-black bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter New Password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                onKeyUp={handleInputEnter}
              />
              <input
                type="password"
                className="w-full p-4 text-black bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                onKeyUp={handleInputEnter}
              />
            </div>
            <button
              className="w-full py-3 px-6 bg-black text-white font-semibold rounded-lg"
              onClick={handlePasswordReset}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default ForgotPassword;
