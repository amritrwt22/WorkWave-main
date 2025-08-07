import React, { useState } from "react";

const Filters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    location: "",
    businessType: "",
    priceRange: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="p-4 w-full md:w-1/4 bg-gray-100">
      <h2 className="text-lg font-bold mb-4">Filters</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium">Location</label>
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Business Type</label>
        <input
          type="text"
          name="businessType"
          value={filters.businessType}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white"
        />
      </div>
      {/* <div className="mb-4">
        <label className="block text-sm font-medium">Price Range</label>
        <input
          type="number"
          name="priceRange"
          value={filters.priceRange}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white"
        />
      </div> */}
    </div>
  );
};

export default Filters;
