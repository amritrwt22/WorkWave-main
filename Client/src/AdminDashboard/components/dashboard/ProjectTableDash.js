import React, { useEffect, useState } from "react";
import user1 from "../../assets/images/users/user1.jpg";
import user2 from "../../assets/images/users/user2.jpg";
import user3 from "../../assets/images/users/user3.jpg";
import user4 from "../../assets/images/users/user4.jpg";
import user5 from "../../assets/images/users/user5.jpg";
import axios from "axios";

const imageData = [
  { avatar: user1 },
  { avatar: user2 },
  { avatar: user3 },
  { avatar: user4 },
  { avatar: user5 },
];

const ProjectTables = ({ businessId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `https://workwave-backend.onrender.com/business/getBookings`,
          { withCredentials: true }
        );
        console.log(response.data);
        setBookings(response.data.bookings);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch bookings");
        setLoading(false);
        console.log("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, [businessId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  const handleStatusChange = (index, event) => {
    const updatedBookings = [...bookings];
    updatedBookings[index].status = event.target.value;
    setBookings(updatedBookings);
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
                Status
              </th>
              <th className="py-2 px-4 text-sm font-medium text-gray-600">
                Payment Status
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
                    <img
                      src={imageData[index % imageData.length].avatar}
                      className="rounded-full w-12 h-12"
                      alt="avatar"
                    />
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
                <td className="py-4 px-4 text-center text-black">
                  {booking.status}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTables;
