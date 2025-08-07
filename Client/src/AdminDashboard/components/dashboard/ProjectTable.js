import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast"; // Import react-hot-toast

const ProjectTables = ({ businessId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/business/getBookings`,
          { withCredentials: true }
        );
        setBookings(response.data.bookings);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [businessId]);

  const handleStatusChange = async (index, newStatus) => {
    const updatedBookings = [...bookings];
    updatedBookings[index].status = newStatus;
    setBookings(updatedBookings);

    try {
      const bookingId = bookings[index]._id; // Get the booking ID to update

      // Make the API call to update the status in the backend
      await axios.post(
        "http://localhost:3002/booking/updateStatus",
        {
          bookingId,
          status: newStatus,
        },
        { withCredentials: true }
      );

      // Success: show a success toast
      toast.success("Booking status updated successfully!");
    } catch (err) {
      setError("Failed to update status");
      console.log("Error updating booking status:", err);

      // Rollback UI update in case of error (optional)
      const rollbackBookings = [...bookings];
      rollbackBookings[index].status = bookings[index].status; // Revert to the old status
      setBookings(rollbackBookings);

      // Show error toast
      toast.error("Failed to update booking status!");
    }
  };
  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-400";
      case "Cancel":
        return "bg-red-600";
      case "confirmed":
        return "bg-green-600";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="overflow-x-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h5 className="text-2xl font-semibold mb-2 text-black text-center">
          Bookings List
        </h5>
        <p className="text-sm text-gray-500 mb-4 text-center">
          Overview of the bookings
        </p>

        <table className="min-w-full table-auto text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-sm font-medium text-gray-600">
                Client Name
              </th>
              <th className="py-2 px-4 text-sm font-medium text-gray-600">
                Email
              </th>
              <th className="py-2 px-4 text-sm font-medium text-gray-600">
                Mobile Number
              </th>
              <th className="py-2 px-4 text-sm font-medium text-gray-600">
                Guest
              </th>
              <th className="py-2 px-4 text-sm font-medium text-gray-600">
                Booking Time
              </th>
              <th className="py-2 px-4 text-sm font-medium text-gray-600">
                Date of Booking
              </th>
              <th className="py-2 px-4 text-sm font-medium text-gray-600">
                Payment Status
              </th>
              <th className="py-2 px-4 text-sm font-medium text-gray-600">
                Current Status
              </th>
              <th className="py-2 px-4 text-sm font-medium text-gray-600">
                Update Status
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr
                key={index}
                className={`border-t ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-start">
                    <div className="ml-3 text-start">
                      <h6 className="text-sm font-medium text-black">
                        {booking.name}
                      </h6>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-black">
                  {booking.email}
                </td>
                <td className="py-4 px-4 text-sm text-black">
                  {booking.mobileNumber}
                </td>
                <td className="py-4 px-4 text-sm text-black">
                  {booking.guestCount}
                </td>
                <td className="py-4 px-4 text-sm text-black">
                  {booking.bookingTime}
                </td>
                <td className="py-4 px-4 text-sm text-black">
                  {booking.bookingDate}
                </td>
                <td className="py-4 px-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      booking.paymentStatus === "Paid"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {booking.paymentStatus}
                  </span>
                </td>
                {/* Current Status Column */}
                <td className="py-4 px-4 text-center">
                  <span
                    className={`px-4 py-2 rounded-full text-white ${getStatusClass(
                      booking.status
                    )}`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>
                </td>
                {/* Update Status Column */}
                <td className="py-4 px-4 text-center">
                  <div className="relative">
                    <select
                      value={booking.status} // The dropdown reflects the current status
                      onChange={(e) =>
                        handleStatusChange(index, e.target.value)
                      } // Update status when user changes
                      className={`px-4 py-2 rounded-full text-white border-2 border-gray-300 ${
                        booking.status === "confirmed"
                          ? "bg-green-200 text-green-800"
                          : booking.status === "Cancel"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      <option value="pending" className="text-yellow-700">
                        Pending
                      </option>
                      <option value="confirmed" className="text-green-700">
                        Confirmed
                      </option>
                      <option value="Cancel" className="text-red-700">
                        Cancelled
                      </option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTables;
