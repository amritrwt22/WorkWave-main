import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { fetchBusinessDetails } from "./fetchBusinessDetails";
import { fetchServiceDetails } from "./fetchServiceData";
import axios from "axios";
import toast from "react-hot-toast";

const FinalBusinessDetails = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: "",
    email: "",
    review: "",
  });
  const [activeTab, setActiveTab] = useState("services");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBusinessDetails = async () => {
      try {
        const businessRes = await fetchBusinessDetails(id);
        setBusiness(businessRes.data);

        const serviceRes = await Promise.all(
          businessRes.data.services.map(async (s) => {
            const tempRes = await fetchServiceDetails(s);
            return tempRes.data;
          })
        );
        setService(serviceRes);

        // Fetch reviews
        const reviewsRes = await axios.get(
          `http://localhost:3002/reviews/get/${id}`
        );
        setReviews(reviewsRes.data);
      } catch (err) {
        setError("Failed to fetch business reviews");
      } finally {
        setLoading(false);
      }
    };

    getBusinessDetails();
  }, [id]);

  const validateName = (name) => /^[a-zA-Z\s]{1,20}$/.test(name.trim());
  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
  const validateReview = (review) => review.trim().length <= 50;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!validateName(newReview.name)) {
      toast.error(
        "Name must only contain letters, spaces, and be less than 20 characters."
      );
      return;
    }
    if (!validateEmail(newReview.email)) {
      toast.error("Invalid email format.");
      return;
    }
    if (!validateReview(newReview.review)) {
      toast.error("Review must be less than 50 characters.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3002/reviews/add/${id}`,
        newReview
      );
      setReviews((prev) => [...prev, response.data.review]);
      setNewReview({ name: "", email: "", review: "" });
      toast.success("Review submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit the review. Please try again.");
      console.error("Error adding review:", err);
    }
  };

  if (loading) return <p>Loading business details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!business) return <p>No business details available</p>;

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
      {/* Business Details Section */}
      <div className="flex flex-col md:flex-row mb-8">
        <div className="md:w-1/3 p-4">
          <img
            src={
              business.businessLogo ||
              "https://via.placeholder.com/150?text=No+Logo"
            }
            alt={business.businessName}
            className="w-full h-auto rounded-lg"
          />
        </div>
        <div className="md:w-2/3 p-4">
          <h1 className="text-4xl font-extrabold text-[#591B5F] mb-4">
            {business.businessName}
          </h1>
          <p className="text-lg text-gray-700">
            {business.address}, {business.city}, {business.state},{" "}
            {business.pincode}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Opening Hours:</span>{" "}
            {business.openingTime} - {business.closingTime}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Off Days:</span>{" "}
            {business.offDays || "None"}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Contact:</span>{" "}
            {business.contactPhone} | {business.contactEmail}
          </p>
        </div>
      </div>

      {/* Tabs for Services, Images, and Reviews */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("services")}
          className={`py-2 px-4 rounded ${
            activeTab === "services" ? "bg-[#591B5F] text-white" : "bg-gray-200"
          }`}
        >
          Services
        </button>
        <button
          onClick={() => setActiveTab("images")}
          className={`py-2 px-4 rounded ${
            activeTab === "images" ? "bg-[#591B5F] text-white" : "bg-gray-200"
          }`}
        >
          Business Images
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`py-2 px-4 rounded ${
            activeTab === "reviews" ? "bg-[#591B5F] text-white" : "bg-gray-200"
          }`}
        >
          Reviews
        </button>
      </div>

      {/* Services Section */}
      {activeTab === "services" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {service?.length > 0 ? (
            service.map((s) => (
              <div
                key={s._id}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-all duration-300"
              >
                <h4 className="text-2xl font-semibold text-[#591B5F] mb-4">
                  {s.name}
                </h4>
                <p className="text-sm text-gray-600 mb-4">{s.description}</p>
                <p className="font-bold text-lg text-[#591B5F] mb-6">
                  Price: ₹{s.price}
                </p>
                <NavLink to={`/business/service/bookingform/${id}/${s._id}`}>
                  <button className="mt-4 bg-[#591B5F] hover:bg-[#732073] text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    Book Now
                  </button>
                </NavLink>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">
              No services available
            </p>
          )}
        </div>
      )}

      {/* Business Images Section */}
      {activeTab === "images" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {business.businessImages?.length > 0 ? (
            business.businessImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Business Image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            ))
          ) : (
            <p>No images available</p>
          )}
        </div>
      )}

      {/* Reviews Section */}
      {activeTab === "reviews" && (
        <div className="p-6 bg-gray-100 rounded-lg">
          {/* Review Form */}
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white p-6 shadow-lg rounded-lg mb-8"
          >
            <h3 className="text-2xl font-semibold text-[#591B5F] mb-6 text-center">
              Share Your Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Your Name"
                value={newReview.name}
                onChange={(e) =>
                  setNewReview({ ...newReview, name: e.target.value })
                }
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#591B5F] shadow-sm"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={newReview.email}
                onChange={(e) =>
                  setNewReview({ ...newReview, email: e.target.value })
                }
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#591B5F] shadow-sm"
              />
            </div>
            <textarea
              placeholder="Write your review here..."
              value={newReview.review}
              onChange={(e) =>
                setNewReview({ ...newReview, review: e.target.value })
              }
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#591B5F] shadow-sm w-full mt-6"
              rows="5"
            ></textarea>
            <button
              type="submit"
              className="mt-6 w-full bg-[#591B5F] hover:bg-[#732073] text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300"
            >
              Submit Review
            </button>
          </form>
          {/* Reviews Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {reviews?.length > 0 ? (
              reviews.map((r) => (
                <div
                  key={r._id}
                  className="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-[#591B5F] text-white font-semibold w-12 h-12 flex items-center justify-center rounded-full">
                      {r.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-black">
                        {r.name}
                      </h4>
                      <p className="text-sm text-gray-500">{r.email}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                    {r.review}
                  </p>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-600">
                No reviews yet. Be the first!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalBusinessDetails;
