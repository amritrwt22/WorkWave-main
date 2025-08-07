import React, { useState } from "react";

const StatusDropdown = () => {
  const [status, setStatus] = useState("Pending");

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  return (
    <div className="relative inline-block">
      <select
        id="status"
        value={status}
        onChange={handleStatusChange}
        className="block w-32 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
      >
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>
  );
};

export default StatusDropdown;
