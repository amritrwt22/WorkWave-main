import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminUpdateForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_number: "",
    gender: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token"))
          .split("=")[1];
        const response = await axios.get(
          "http://localhost:3002/admin/admin-profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const user = response.data;
        setUserId(user._id);
        setFormData({
          name: user.name || "",
          email: user.email || "",
          mobile_number: user.mobile_number || "",
          gender: user.gender || "",
          address: user.address || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);
  const validate = () => {
    const errors = [];

    if (!formData.name.trim()) {
      errors.push("Name is required.");
    }

    if (!formData.email.trim()) {
      errors.push("Email is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.push("Invalid email format.");
    }

    if (!/^\d{10}$/.test(formData.mobile_number)) {
      errors.push("Mobile number must be 10 digits.");
    }

    if (!formData.gender.trim()) {
      errors.push("Gender is required.");
    }

    if (!formData.address.trim()) {
      errors.push("Address is required.");
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    if (!userId) {
      toast.error("User ID is missing!");
      return;
    }

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token"))
        .split("=")[1];

      const response = await axios.post(
        `http://localhost:3002/admin/update-admin/${userId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Profile updated:", response.data);
      toast.success("Profile updated successfully!"); // Display success toast
      setTimeout(() => {
        navigate("/"); // Redirect to landing page after 2 seconds
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile."); // Display error toast
    }
  };

  if (isLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-black rounded-lg shadow-lg">
      <h2 className="text-center text-2xl text-gray-300 mb-6">
        Update Your Information
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="space-y-1">
          <label htmlFor="name" className="text-white text-sm">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="email" className="text-white text-sm">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div className="space-y-1">
          <label htmlFor="mobile_number" className="text-white text-sm">
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobile_number"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.mobile_number && (
            <p className="text-red-500 text-sm">{errors.mobile_number}</p>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-1">
          <label htmlFor="gender" className="text-white text-sm">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender}</p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-1">
          <label htmlFor="address" className="text-white text-sm">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            rows="4"
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Update Information
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUpdateForm;
