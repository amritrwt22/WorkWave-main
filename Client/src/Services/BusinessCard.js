import React from "react";
import { NavLink } from "react-router-dom";

const BusinessCard = ({ business }) => {
  // Use the first service for dynamic rendering or fallback values if no services exist
  const service = business.services?.[0] || {
    serviceName: "Service Name Not Available",
    description: "No Description Available",
    price: "N/A",
  };

  return (
    <div
      className="business-card bg-white shadow-md rounded-lg p-4 hover:bg-gray-50 transform hover:scale-105 transition-transform duration-200"
    >
      <NavLink to={`/business/getBusiness/${business._id}`}>
        <img
          src={
            business.businessLogo ||
            "https://via.placeholder.com/150?text=Placeholder"
          }
          alt={business.businessName || "Business Logo"}
          className="rounded-lg w-full h-40 object-cover"
        />
        <h2 className="text-xl font-bold mt-4 text-black">
          {business.businessName || "Business Name"}
        </h2>
        <p className="text-gray-600">{service.serviceName}</p>
        <p className="text-gray-600">{business.city || "City Not Available"}</p>
        <p className="text-gray-600">
          {business.businessType || "Business Type Not Available"}
        </p>
        {/* <p className="mt-2 text-gray-700">
          {service.description || "No Service Description"}
        </p>
        <p className="mt-2 font-semibold text-black">
          {service.price !== "N/A" ? `$${service.price}` : "Price Not Available"}
        </p> */}
      </NavLink>
    </div>
  );
};

export default BusinessCard;
