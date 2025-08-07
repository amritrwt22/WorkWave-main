import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { fetchBusinessDetails } from "./fetchBusinessDetails"; // Ensure this fetch function is correctly set up
import { fetchServiceDetails } from "./fetchServiceData";

const BusinessDetails = () => {
  const { id } = useParams(); // Retrieve the business ID from the URL
  const [business, setBusiness] = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getBusinessDetails = async () => {
      try {
        const businessRes = await fetchBusinessDetails(id); // Make sure this function fetches data from the backend API
        setBusiness(businessRes.data); // Store the response
        console.log(businessRes);
        const serviceRes = await Promise.all(
          businessRes.data.services.map(async (s) => {
            const tempRes = await fetchServiceDetails(s);
            return tempRes.data;
          })
        );

        setService(serviceRes);
        console.log(serviceRes);
      } catch (err) {
        setError("Failed to fetch business details");
      } finally {
        setLoading(false);
      }
    };

    getBusinessDetails();
  }, [id]);
  if (loading) return <p>Loading business details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!business) return <p>No business details available</p>;

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col md:flex-row">
        {/* Business Logo */}
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

        {/* Business Details */}
        <div className="md:w-2/3 p-4">
          <h1 className="text-3xl font-bold mb-2">{business.businessName}</h1>
          <p className="text-gray-600 mb-2">
            {business.address}, {business.city}, {business.state},{" "}
            {business.pincode}
          </p>
          <p className="text-gray-600 mb-2">
            Opening Hours: {business.openingTime} - {business.closingTime}
          </p>
          <p className="text-gray-600 mb-2">
            Off Days: {business.offDays || "None"}
          </p>
          <p className="text-gray-600 mb-4">
            Contact: {business.contactPhone} | {business.contactEmail}
          </p>
        </div>
      </div>

      {/* Services Section */}
      <div className="my-6">
        <h2 className="text-2xl font-semibold mb-4">Services</h2>
        {service?.length > 0 ? (
          service.map((service) => (
            <div
              key={service._id}
              className="border p-4 mb-4 rounded-lg shadow-md bg-gray-50 text-gray-700"
            >
              <h3 className="text-xl font-semibold">{service.serviceName}</h3>
              <p className="mb-2">
                Description: {service.description || "No description provided"}
              </p>
              <p className="mb-2 font-bold">Price: ${service.price}</p>
              <NavLink to={`/business/service/bookingform/${id}`}>
                <button className="mt-2 bg-[#591B5F] text-white py-2 px-4 rounded">
                  Book Now
                </button>
              </NavLink>
            </div>
          ))
        ) : (
          <p>No services available.</p>
        )}
      </div>

      {/* Business Images Section */}
      <div className="my-6">
        <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {business.businessImages?.length > 0 ? (
            business.businessImages.map((image, index) => (
              <div key={index} className="rounded-lg shadow-md">
                <img
                  src={image}
                  alt={`Business Image ${index + 1}`}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            ))
          ) : (
            <p>No images available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;
