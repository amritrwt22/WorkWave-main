import React, { useState } from "react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddBusinessDetails = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    landmark: "Near the location",
    businessType: "",
    openingTime: "",
    closingTime: "",
    offDays: [],
    contactEmail: "",
    contactPhone: "",
    businessLogo: null,
    businessImages: [],
  });

  const handleRemoveImage = (index) => {
    // Creating a new array of images by filtering out the one to remove
    const updatedImages = formData.businessImages.filter((_, i) => i !== index);

    // Setting the updated image list back to the state
    setFormData((prev) => ({
      ...prev,
      businessImages: updatedImages,
    }));
  };

  const handleChange = (e) => {
    const { name, type, files, value, checked } = e.target;

    // Restrict alphabetic input for fields like businessName, state, city, address, businessType
    if (
      name === "businessName" ||
      name === "state" ||
      name === "city" ||
      name === "businessType"
    ) {
      if (/[^a-zA-Z\s]/.test(value)) {
        return; // Disallow non-alphabetic input
      }
    }

    // Restrict numeric input for fields like pincode and contactPhone
    if (name === "pincode" || name === "contactPhone") {
      if (/[^0-9]/.test(value)) {
        return; // Disallow non-numeric input
      }
    }

    if (type === "file") {
      if (name === "businessImages") {
        setFormData((prev) => ({
          ...prev,
          businessImages: [...prev.businessImages, ...files],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: files[0],
        }));
      }
    } else if (type === "checkbox") {
      setFormData((prev) => {
        const newOffDays = checked
          ? [...prev.offDays, value]
          : prev.offDays.filter((day) => day !== value);
        return { ...prev, offDays: newOffDays };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    const allowedEmails = [
      /@gmail\.com$/,
      /@yahoo\.com$/,
      /@chitkara\.edu\.in$/,
    ];

    // Trim and clean up the form data to remove leading/trailing spaces
    const trimmedFormData = {
      ...formData,
      businessName: formData.businessName.trim(),
      address: formData.address.trim(),
      state: formData.state.trim(),
      city: formData.city.trim(),
      pincode: formData.pincode.trim(),
      businessType: formData.businessType.trim(),
      contactEmail: formData.contactEmail.trim(),
      contactPhone: formData.contactPhone.trim(),
      openingTime: formData.openingTime.trim(),
      closingTime: formData.closingTime.trim(),
      landmark: formData.landmark.trim(),
    };

    // Validation checks
    if (/\d/.test(trimmedFormData.businessName)) {
      toast.error("Business name should not contain numbers.");
      isValid = false;
    } else if (
      trimmedFormData.businessName.length < 3 ||
      trimmedFormData.businessName.length > 20
    ) {
      toast.error("Business name should be between 3 and 20 characters.");
      isValid = false;
    }

    // Ensure that business name, state, city, address, and business type only contain alphabets
    const alphabeticRegex = /^[a-zA-Z\s]+$/;
    if (!alphabeticRegex.test(trimmedFormData.businessName)) {
      toast.error("Business name should only contain alphabets.");
      isValid = false;
    }
    if (!alphabeticRegex.test(trimmedFormData.state)) {
      toast.error("State should only contain alphabets.");
      isValid = false;
    }
    if (!alphabeticRegex.test(trimmedFormData.city)) {
      toast.error("City should only contain alphabets.");
      isValid = false;
    }
    if (!alphabeticRegex.test(trimmedFormData.businessType)) {
      toast.error("Business type should only contain alphabets.");
      isValid = false;
    }

    // Opening and Closing Time Validation
    const openingTime = trimmedFormData.openingTime
      ? new Date(`1970-01-01T${trimmedFormData.openingTime}Z`)
      : null;
    const closingTime = trimmedFormData.closingTime
      ? new Date(`1970-01-01T${trimmedFormData.closingTime}Z`)
      : null;

    if (!openingTime || !closingTime || closingTime <= openingTime) {
      toast.error("Closing time must be after opening time.");
      isValid = false;
    }

    const businessHours = (closingTime - openingTime) / (1000 * 60 * 60);
    if (businessHours < 5) {
      toast.error("Business must be open for at least 5 hours.");
      isValid = false;
    }

    // Validate Off Days (Checkboxes)
    if (trimmedFormData.offDays.length === 0) {
      toast.error("Please select at least one off day.");
      isValid = false;
    }

    // Ensure not all days are selected
    if (trimmedFormData.offDays.length === 7) {
      toast.error("You cannot select all off days. Please choose fewer days.");
      isValid = false;
    }

    // Validate Pincode (should be numeric and exactly 6 digits)
    if (!/^\d{6}$/.test(trimmedFormData.pincode)) {
      toast.error("Pincode must be exactly 6 digits.");
      isValid = false;
    }

    // Validate Contact Email
    if (/^\d/.test(trimmedFormData.contactEmail)) {
      toast.error("Email must not start with a number.");
      isValid = false;
    } else if (
      !/^[a-zA-Z][\w.-]*@[a-zA-Z]+\.[a-zA-Z]{2,6}$/.test(
        trimmedFormData.contactEmail
      )
    ) {
      toast.error("Email format is invalid.");
      isValid = false;
    } else if (
      !allowedEmails.some((regex) => regex.test(trimmedFormData.contactEmail))
    ) {
      toast.error("Email domain is not allowed.");
      isValid = false;
    }

    // Validate Contact Phone (should be numeric and exactly 10 digits)
    if (!/^\d{10}$/.test(trimmedFormData.contactPhone)) {
      toast.error("Phone number must be 10 digits.");
      isValid = false;
    }

    // Validate Business Logo and Images
    if (!trimmedFormData.businessLogo) {
      toast.error("Please upload a business logo.");
      isValid = false;
    }

    if (trimmedFormData.businessImages.length === 0) {
      toast.error("Please upload at least one business image.");
      isValid = false;
    }

    if (!isValid) return;

    // Create FormData for file upload
    const formDataToSubmit = new FormData();
    Object.keys(trimmedFormData).forEach((key) => {
      if (key !== "businessLogo" && key !== "businessImages") {
        formDataToSubmit.append(key, trimmedFormData[key]);
      }
    });

    if (trimmedFormData.businessLogo) {
      formDataToSubmit.append("businessLogo", trimmedFormData.businessLogo);
    }

    if (trimmedFormData.businessImages.length > 0) {
      trimmedFormData.businessImages.forEach((file) => {
        formDataToSubmit.append("businessImages", file);
      });
    }

    try {
      const response = await axios.post(
        "https://workwave-backend.onrender.com/business/addbusiness",
        formDataToSubmit,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      toast.success("Business Added successfully");
      navigate("/");
    } catch (error) {
      console.error("Error submitting business details:", error);
      toast.error(
        error.response?.data?.message || "Please Check the Details Carefully"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex text-black">
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="w-[65%] bg-cover bg-center bg-no-repeat fixed h-screen"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1531973819741-e27a5ae2cc7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-purple-950 opacity-60"></div>
      </motion.div>

      {/* Right side - Form Section */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-[35%] ml-[65%]"
      >
        <div className="min-h-screen bg-white shadow-lg overflow-y-auto">
          <div className="p-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-gray-900 mb-8 text-center"
            >
              Business Details
            </motion.h2>

            <motion.form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full p-3 text-sm bg-white rounded-lg border"
                  placeholder="Enter business name"
                  required
                />
              </div>

              {/* Business Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">
                  Business Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full p-3 text-sm bg-white rounded-lg border"
                  placeholder="Enter business type"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full p-3 text-sm bg-white rounded-lg border"
                  placeholder="Enter contact email"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full p-3 text-sm bg-white rounded-lg border"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-3 text-sm bg-white rounded-lg border"
                  placeholder="Enter full address"
                  rows="3"
                  required
                />
              </div>

              {/* State and City */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-black">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-3 text-sm bg-white rounded-lg border"
                    placeholder="Enter state"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-black">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-3 text-sm bg-white rounded-lg border"
                    placeholder="Enter city"
                    required
                  />
                </div>
              </div>

              {/* Pincode */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full p-3 text-sm bg-white rounded-lg border"
                  placeholder="Enter pincode"
                  required
                />
              </div>

              {/* Opening and Closing Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-black">
                    Opening Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3.5 h-4 w-4 text-black" />
                    <input
                      type="time"
                      name="openingTime"
                      value={formData.openingTime}
                      onChange={handleChange}
                      className="w-full pl-10 p-3 text-sm bg-white rounded-lg border"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-black">
                    Closing Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3.5 h-4 w-4 text-black" />
                    <input
                      type="time"
                      name="closingTime"
                      value={formData.closingTime}
                      onChange={handleChange}
                      className="w-full pl-10 p-3 text-sm bg-white rounded-lg border"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Off Days */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">
                  Off Days <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <label key={day} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="offDays"
                        value={day}
                        checked={formData.offDays.includes(day)}
                        onChange={handleChange}
                        className="h-4 w-4"
                      />
                      <span className="ml-2 text-sm">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Business Logo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">
                  Business Logo <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="businessLogo"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-none file:text-sm file:font-semibold file:bg-purple-700 file:text-white"
                  required
                />
                {formData.businessLogo && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(formData.businessLogo)}
                      alt="Business Logo Preview"
                      className="h-16 w-16 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Business Images */}
              {/* Business Images */}
              {/* Business Images */}
              <div>
                <label className="block text-sm font-medium text-black">
                  Business Images <span className="text-red-500">*</span>
                </label>

                {/* Hidden file input */}
                <input
                  type="file"
                  name="businessImages"
                  multiple
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden" // Hide the input field itself
                  id="businessImagesInput"
                  required
                />

                {/* Button to open file dialog */}
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("businessImagesInput").click()
                  } // Programmatically open file input dialog
                  className="w-full py-2 px-4 rounded-lg border-none text-sm font-semibold bg-purple-700 text-white cursor-pointer"
                >
                  Choose Business Images
                </button>

                {formData.businessImages.length > 0 && (
                  <div className="mt-4 flex gap-4">
                    {formData.businessImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`business-image-${index}`}
                          className="h-16 w-16 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-0 right-0 text-red-500 bg-white rounded-full p-1"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Submit
                </button>
              </div>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddBusinessDetails;
