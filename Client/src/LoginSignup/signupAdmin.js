import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod"; // Import Zod
import HeroSection from "./HeroSection";
import Toast, { ToastContainerWrapper } from "./Helper/ToastNotify";
import toast from "react-hot-toast";
import homeIcon from "./icons8-home-24.png";

// Zod Schema for Validation
const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .trim()
    .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Invalid email address.")
    .regex(
      /^[^0-9][A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email cannot start with a number and must follow a valid format."
    ),
  mobile_number: z
    .string()
    .min(10, "Mobile number must be exactly 10 digits.")
    .max(10, "Mobile number must be exactly 10 digits.")
    .regex(/^[0-9]{10}$/, "Mobile number must be numeric."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
    ),
  gender: z.string().min(1, "Gender is required."),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters long.")
    .max(155, "Address is too long.")
    .regex(/^\S.*$/, "Address cannot start with spaces."),
});

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_number: "",
    password: "",
    confirm_password: "",
    gender: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm_password: false,
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true); // Set to true when the user clicks submit

    // Trim all form fields before validation and submission
    const trimmedFormData = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      mobile_number: formData.mobile_number.trim(),
      password: formData.password.trim(),
      confirm_password: formData.confirm_password.trim(),
      gender: formData.gender.trim(),
      address: formData.address.trim(),
    };

    const formErrors = {};

    // Manual check for password and confirm password match
    if (trimmedFormData.password !== trimmedFormData.confirm_password) {
      formErrors.confirm_password = "Passwords do not match";
    }

    // Run Zod validation
    const result = registerSchema.safeParse(trimmedFormData);

    // Collect all errors, including required and custom ones
    if (!result.success) {
      result.error.errors.forEach((err) => {
        formErrors[err.path[0]] = err.message;
      });
    }

    // If there are any errors, update the state and prevent submission
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // If validation is successful, send the data to the backend
    try {
      const respo = await axios.post(
        "http://localhost:3002/admin/signup",
        trimmedFormData,
        { withCredentials: true, credentials: "include" }
      );
      toast.success("Registered Successfully");
      setTimeout(() => {
        navigate("/admin-login");
      }, 1000);
    } catch (e) {
      const errorMessage =
        e.response && e.response.data && e.response.data.msg
          ? e.response.data.msg
          : "Error registering.";
      toast.error(errorMessage);
    }
  };

  // Handle change of form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Reset individual error messages on user input
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }

    // Reset confirm_password error when password or confirm_password changes
    if (name === "password" || name === "confirm_password") {
      const newErrors = { ...errors };
      delete newErrors.confirm_password;
      setErrors(newErrors);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="flex min-h-screen">
      <HeroSection />
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          {/* Back to Home Button */}
          <div className="mb-4 text-center mr-[220px]">
            <NavLink
              to="/"
              className="text-blue-500 hover:text-blue-700 text-lg font-semibold"
            >
              &lt; Back to Home
            </NavLink>
          </div>

          <NavLink to={"/admin-login"} className="text-gray-600 mb-8">
            <img
              src={homeIcon}
              alt="Home Icon"
              style={{ width: "auto", height: "auto" }}
            />
          </NavLink>

          <h2 className="text-3xl font-semibold mb-4">Get Started with Us!</h2>
          <p className="text-gray-600 mb-8">
            New to our platform? Register today to connect with local clients.
          </p>
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-4">
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleChange}
                value={formData.name}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Name"
              />
              {isSubmit && errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
                value={formData.email}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email"
              />
              {isSubmit && errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Mobile Number Field */}
            <div className="mb-4">
              <input
                type="text"
                name="mobile_number"
                id="mobile_number"
                onChange={handleChange}
                value={formData.mobile_number}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Mobile Number"
              />
              {isSubmit && errors.mobile_number && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mobile_number}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <input
                type={showPassword.password ? "text" : "password"}
                name="password"
                id="password"
                onChange={handleChange}
                value={formData.password}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword.password ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
              {isSubmit && errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4 relative">
              <input
                type={showPassword.confirm_password ? "text" : "password"}
                name="confirm_password"
                id="confirm_password"
                onChange={handleChange}
                value={formData.confirm_password}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm_password")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword.confirm_password ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
              {isSubmit && errors.confirm_password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirm_password}
                </p>
              )}
            </div>

            {/* Gender Selection */}
            <div className="mb-4">
              <select
                name="gender"
                id="gender"
                onChange={handleChange}
                value={formData.gender}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {isSubmit && errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>

            {/* Address Field */}
            <div className="mb-4">
              <textarea
                name="address"
                id="address"
                onChange={handleChange}
                value={formData.address}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Address"
              />
              {isSubmit && errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="px-6 py-2 text-white bg-indigo-500 rounded-md"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
