import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/roadmap/bookingFormbkg.jpg";
import toast from "react-hot-toast";

const BookingForm = () => {
  const { id, serviceId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    mobileNumber: "",
    guestCount: "",
    bookingDate: "",
    bookingTime: "",
    customerNotes: "",
    serviceId: serviceId,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const validateName = (name) =>
    /^[a-zA-Z\s]+$/.test(name.trim()) &&
    name.trim().length > 0 &&
    name.trim().length <= 20;

  const validateEmailStartsWithNumber = (email) => /^[0-9]/.test(email);
  const validateEmailFormat = (email) =>
    /^[a-zA-Z][a-zA-Z0-9._%+-]*@(gmail\.com|yahoo\.com|chitkara\.edu\.in)$/.test(
      email
    );

  const validatePhoneNumber = (number) => /^[0-9]{10}$/.test(number);

  const validateGuestCount = (count) => {
    const parsedCount = parseInt(count, 10);
    return parsedCount > 0 && parsedCount <= 10;
  };

  const validateDateOfBirth = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age >= 16 && age <= 80;
  };

  const validateBookingDate = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    const differenceInDays = (selectedDate - today) / (1000 * 60 * 60 * 24);
    return differenceInDays >= 1 && differenceInDays <= 14;
  };

  const validateNotes = (notes) => notes.trim().length <= 30;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formErrors = {};

    if (!validateName(formData.name)) {
      formErrors.name =
        "Name must contain only letters and be 1-20 characters long.";
    }

    if (!formData.email) {
      formErrors.email = "Email is required.";
    } else if (validateEmailStartsWithNumber(formData.email)) {
      formErrors.email = "Email must not start with a number.";
    } else if (!validateEmailFormat(formData.email)) {
      formErrors.email = "Invalid email format.";
    }

    if (!validatePhoneNumber(formData.mobileNumber)) {
      formErrors.mobileNumber = "Mobile number must be exactly 10 digits.";
    }

    if (!validateGuestCount(formData.guestCount)) {
      formErrors.guestCount = "Guest count must be 1-10.";
    }

    if (!validateDateOfBirth(formData.dateOfBirth)) {
      formErrors.dateOfBirth = "You must be 16-80 years old.";
    }

    if (!validateBookingDate(formData.bookingDate)) {
      formErrors.bookingDate = "Booking date must be 1-14 days from today.";
    }

    if (!validateNotes(formData.customerNotes)) {
      formErrors.customerNotes = "Notes must be 30 characters or less.";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://workwave-backend.onrender.com/booking/addbooking/${id}/${serviceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Booking submitted successfully!");
        setFormData({
          name: "",
          email: "",
          dateOfBirth: "",
          mobileNumber: "",
          guestCount: "",
          bookingDate: "",
          bookingTime: "",
          customerNotes: "",
        });
        setTimeout(() => {
          navigate("/businesses/allbusinesses");
        }, 1500);
      } else {
        const errorData = await response.text();
        const errorJson = JSON.parse(errorData);
        toast.error(
          `Failed to submit booking: ${errorJson.message || "Error"}`
        );
      }
    } catch (error) {
      toast.error(`Error submitting booking: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen">
      <div className="flex w-full">
        <div className="relative w-2/3 h-screen">
          <img
            src={backgroundImage}
            alt="Booking Background"
            className="absolute inset-0 w-full h-full object-cover filter brightness-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div className="text-center text-white p-8 rounded-xl max-w-xl bg-black/40">
              <motion.h1 className="text-5xl font-bold mb-4">
                Book Your Experience
              </motion.h1>
              <motion.p className="text-xl mb-4">
                Create unforgettable moments with our premium services
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
        <div className="w-1/3 bg-white/90 p-8 h-screen overflow-y-auto">
          <motion.form onSubmit={handleSubmit} className="w-full space-y-6">
            <motion.h2 className="text-2xl font-bold text-violet-900 mb-8 border-b-2 border-violet-200 pb-2">
              Booking Details
            </motion.h2>
            {[
              { label: "Name", name: "name", type: "text", error: errors.name },
              {
                label: "Email",
                name: "email",
                type: "email",
                error: errors.email,
              },
              {
                label: "Date of Birth",
                name: "dateOfBirth",
                type: "date",
                error: errors.dateOfBirth,
              },
              {
                label: "Mobile Number",
                name: "mobileNumber",
                type: "tel",
                error: errors.mobileNumber,
              },
              {
                label: "Number of Guests",
                name: "guestCount",
                type: "number",
                error: errors.guestCount,
              },
              {
                label: "Booking Date",
                name: "bookingDate",
                type: "date",
                error: errors.bookingDate,
              },
              { label: "Booking Time", name: "bookingTime", type: "time" },
            ].map((field) => (
              <motion.div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  required
                />
                {field.error && (
                  <p className="text-red-500 text-sm">{field.error}</p>
                )}
              </motion.div>
            ))}
            <motion.div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="customerNotes"
                value={formData.customerNotes}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
              ></textarea>
              {errors.customerNotes && (
                <p className="text-red-500 text-sm">{errors.customerNotes}</p>
              )}
            </motion.div>
            <motion.button
              type="submit"
              className={`w-full py-3 rounded-lg text-white font-medium ${
                isLoading
                  ? "bg-violet-400"
                  : "bg-violet-600 hover:bg-violet-700"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Booking..." : "Confirm Booking"}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
