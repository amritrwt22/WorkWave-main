import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import HeroSection from "./HeroSection";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { Eye, EyeOff } from "lucide-react"; // Import icons for show/hide password

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const otpPage = async () => {
    const { email } = formData;

    if (!email) {
      toast.error("Please enter your email first.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3002/otp/sendOtpAdmin",
        { email }
      );
      toast.success("OTP sent successfully!");
      navigate("/admin-forgot-password", { state: { email } });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Admin not found.");
      } else {
        toast.error("Failed to send OTP.");
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const respo = await axios.post(
        "http://localhost:3002/admin/login",
        formData,
        { withCredentials: true, credentials: "include" }
      );
      console.log(respo.headers);

      if (respo.data.token && respo.data.role) {
        // Store the token and role in cookies
        Cookies.set("token", respo.data.token, { expires: 7 });
        Cookies.set("role", respo.data.role, { expires: 7 });
        toast.success("Logged in successfully!");

        // Navigate based on the role
        if (respo.data.role === "admin") {
          navigate("/");
        } else {
          navigate("/userLandingPage");
        }
      } else {
        toast.error("Role or token not found in response!");
      }
    } catch (e) {
      toast.error("Invalid email or password.");
    }
  };

  // Handle input field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="flex min-h-screen">
      <HeroSection />
      <div className="w-1/2 bg-center flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <div className="mb-[20px] text-center mr-[230px]">
            <NavLink
              to="/"
              className="text-blue-500 hover:text-blue-700 text-lg font-semibold"
            >
              &lt; Back to Home
            </NavLink>
          </div>

          <h2 className="text-3xl font-semibold mb-4">
            Welcome Back, Business Owner!
          </h2>
          <p className="text-gray-600 mb-8">
            Enter your credentials to access and manage your services
          </p>
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={handleChange}
                value={formData.email}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                placeholder="Email"
              />
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                value={formData.password}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                placeholder="Password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-3 transform translate-y text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between mb-6">
              <div
                className="text-sm text-indigo-600 hover:text-indigo-500 cursor-pointer"
                onClick={otpPage}
              >
                Forgot Password?
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md"
            >
              Log in
            </button>
          </form>

          {/* Sign-up Redirect */}
          <p className="mt-6 text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <NavLink
              to="/admin-signup"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Sign up for free
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
