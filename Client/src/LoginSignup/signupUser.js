import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import Eye Icons
import { z } from "zod"; // Import Zod for validation
import HeroSection from "./HeroSectionUser";
import Toast, { ToastContainerWrapper } from "./Helper/ToastNotify"; // Import Toast and ToastContainerWrapper
import toast from "react-hot-toast";

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

const RegisterFormUser = () => {
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false); // Track if the form has been submitted

  const navigate = useNavigate();

  // Custom password matching function
  const validatePasswordMatch = () => {
    if (formData.password !== formData.confirm_password) {
      return "Passwords do not match.";
    }
    return null;
  };

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

    // Run Zod validation
    const result = registerSchema.safeParse(trimmedFormData);

    // If there are any errors, update the state and prevent submission
    if (!result.success) {
      const formErrors = {};
      result.error.errors.forEach((err) => {
        formErrors[err.path[0]] = err.message;
      });
      setErrors(formErrors);
      return;
    }

    // Validate password match
    const passwordError = validatePasswordMatch();
    if (passwordError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirm_password: passwordError,
      }));
      return;
    }

    // If validation is successful, send the data to the backend
    try {
      const response = await axios.post(
        "https://workwave-backend.onrender.com/user/signup",
        trimmedFormData,
        { withCredentials: true, credentials: "include" }
      );
      toast.success("Registered successfully!");
      setTimeout(() => {
        navigate("/user-login");
      }, 1000);
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.msg
          ? error.response.data.msg
          : "Error registering user.";
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
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="flex min-h-screen">
      <HeroSection />
      <div className="w-1/2 flex items-center bg-white justify-center">
        <div className="w-full max-w-md p-8">
          {/* Back to Home Link */}
          <div className="mb-[20px]  mr-[220px] text-center">
            <NavLink
              to="/user-landingpage"
              className="text-blue-500 hover:text-blue-700 text-lg font-semibold "
            >
              &lt; Back to Home
            </NavLink>
          </div>

          <h2 className="text-3xl font-semibold text-black mb-4">
            Start Your Journey
          </h2>
          <p className="text-gray-600 mb-8">
            New to our platform? Register and connect with top local businesses.
          </p>
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-4">
              <input
                type="text"
                name="name"
                onChange={handleChange}
                value={formData.name}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Name"
              />
              {isSubmit && errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email"
              />
              {isSubmit && errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Mobile Number Field */}
            <div className="mb-4">
              <input
                type="text"
                name="mobile_number"
                onChange={handleChange}
                value={formData.mobile_number}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Mobile Number"
              />
              {isSubmit && errors.mobile_number && (
                <p className="text-red-500 text-sm">{errors.mobile_number}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
                value={formData.password}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
              {isSubmit && errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4 relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                onChange={handleChange}
                value={formData.confirm_password}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash size={20} />
                ) : (
                  <FaEye size={20} />
                )}
              </button>
              {isSubmit && errors.confirm_password && (
                <p className="text-red-500 text-sm">
                  {errors.confirm_password}
                </p>
              )}
            </div>

            {/* Gender Field */}
            <div className="mb-4">
              <select
                name="gender"
                onChange={handleChange}
                value={formData.gender}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {isSubmit && errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender}</p>
              )}
            </div>

            {/* Address Field */}
            <div className="mb-4">
              <input
                type="text"
                name="address"
                onChange={handleChange}
                value={formData.address}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Address"
              />
              {isSubmit && errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>

            <div className="mb-4 flex justify-center">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Register
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <NavLink to="/user-login" className="text-blue-500">
                  Login here
                </NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>

      <ToastContainerWrapper />
    </div>
  );
};

export default RegisterFormUser;
