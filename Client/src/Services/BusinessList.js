import React, { useEffect, useState } from "react";
import Filters from "./Filters";
import BusinessCard from "./BusinessCard";
import { fetchBusinesses } from "./fetchBusinesses"; // Ensure the function is properly imported
import Header from '../UserLandingPage/components/Header';
import Footer from '../UserLandingPage/components/Footer';

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]); // State for all businesses
  const [filteredBusinesses, setFilteredBusinesses] = useState([]); // State for filtered businesses
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  // Fetch businesses on component mount
  useEffect(() => {
    const getBusinesses = async () => {
      try {
        const response = await fetchBusinesses();
        const businessData = response.getData; // Accessing `getData` from API response
        setBusinesses(businessData);
        setFilteredBusinesses(businessData); // Initialize filtered businesses
      } catch (err) {
        setError("Failed to fetch businesses");
      } finally {
        setLoading(false);
      }
    };

    getBusinesses();
  }, []);

  // Filter handler
  const handleFilterChange = (filters) => {
    const filtered = businesses.filter((business) => {
      return (
        (!filters.location ||
          business.city
            .toLowerCase()
            .includes(filters.location.toLowerCase())) &&
        (!filters.businessType ||
          business.businessType
            .toLowerCase()
            .includes(filters.businessType.toLowerCase())) &&
        (!filters.priceRange ||
          business.services.some((service) => service.price <= filters.priceRange))
      );
    });
    setFilteredBusinesses(filtered);
  };

  // Loading and Error States
  if (loading) {
    return <p className="text-center p-4">Loading businesses...</p>;
  }

  if (error) {
    return <p className="text-center p-4 text-red-500">{error}</p>;
  }

  return (
    <div className="App bg-white text-black min-h-screen">
      <Header />
      <header className="bg-gradient-to-b from-black to-[#591B5F] text-white p-4 shadow-md">
        <div className="container mx-auto flex flex-wrap justify-between items-center">
          <h1 className="text-xl font-bold">Services</h1>
          <div className="relative flex flex-wrap items-center space-x-4 mt-2 md:mt-0 w-full md:w-auto">
            <button
              className="block md:hidden bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 w-full"
              onClick={() =>
                document
                  .getElementById("searchDropdown")
                  .classList.toggle("hidden")
              }
            >
              Search
            </button>
            <div
              id="searchDropdown"
              className="hidden md:flex flex-col md:flex-row md:space-x-4 w-full md:w-auto"
            >
              <input
                type="text"
                placeholder="Search"
                className="p-2 rounded bg-gray-100 text-black w-full md:w-auto mb-2 md:mb-0"
              />
              <input
                type="text"
                placeholder="Location"
                className="p-2 rounded bg-gray-100 text-black w-full md:w-auto mb-2 md:mb-0"
              />
              <input
                type="text"
                placeholder="dd-mm-yy"
                className="p-2 rounded bg-gray-100 text-black w-full md:w-auto mb-2 md:mb-0"
              />
              <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full md:w-auto">
                Search
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-col md:flex-row">
        {/* Filters Component */}
        <Filters onFilterChange={handleFilterChange} />
        {/* Business Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 w-full">
          {filteredBusinesses.map((business) => (
            <BusinessCard key={business._id} business={business} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BusinessList;
