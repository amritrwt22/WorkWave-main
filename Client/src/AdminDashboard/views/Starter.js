import { Col, Row } from "reactstrap";
import SalesChart from "../components/dashboard/SalesChart";
import ProjectTables from "../components/dashboard/ProjectTableDash";
import TopCards from "../components/dashboard/TopCards";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";

const fetchServiceDetails = async (serviceId) => {
  try {
    const response = await fetch(
      `http://localhost:3002/services/${serviceId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch service details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching service details:", error);
    return null;
  }
};

const Starter = () => {
  const [totalBookings, setTotalBookings] = useState(0);
  const [bookingsData, setBookingsData] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [serviceNames, setServiceNames] = useState({});

  useEffect(() => {
    const fetchBookingsData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:3002/business/getBookings`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        console.log("Fetched Bookings:", data.bookings);

        const booking = data.bookings || [];

        const sortedBookings = booking.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const length = sortedBookings.length;
        console.log(length);
        setBookingsData(sortedBookings);
        setTotalBookings(booking.length);
        let earnings = 0;
        const serviceNamesObj = {};

        for (let booking of sortedBookings) {
          if (booking.service) {
            console.log("Booking Service ID:", booking.service);
            const serviceData = await fetchServiceDetails(booking.service);
            console.log("Service Data:", serviceData);
            if (booking.paymentStatus === "Paid") {
              if (serviceData && serviceData.data && serviceData.data.price) {
                earnings += serviceData.data.price;
                console.log("Earnings updated:", earnings);
              } else {
                console.log("No price found for service:", booking.service);
              }
              serviceNamesObj[booking.service] = serviceData
                ? serviceData.data.name
                : "Service";
            } else {
              console.log(
                "Booking payment status is not 'Paid', skipping:",
                booking.service
              );
            }
          }
        }

        setTotalEarnings(earnings);
        setServiceNames(serviceNamesObj);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setFetchError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingsData();
  }, []);
  return (
    <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-6 rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold tracking-wide drop-shadow-lg">
            Admin Dashboard
          </h1>
        </div>
      </div>

      {/* Top Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <TopCards
          bg="bg-red-100 text-red-600"
          title="Total Earnings"
          subtitle="Total Earnings"
          earning={`₹${totalEarnings.toLocaleString()}`}
          icon="bi bi-coin"
        />
        <TopCards
          bg="bg-blue-100 text-blue-600"
          title="Total Bookings"
          subtitle="Total Bookings"
          earning={bookingsData.length}
          icon="bi bi-basket3"
        />
        <TopCards
          bg="bg-yellow-100 text-yellow-600"
          title="Pending Bookings"
          subtitle="Pending Bookings"
          earning={
            bookingsData.filter((booking) => booking.status === "Pending")
              .length
          }
          icon="bi bi-basket3"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Sales Overview
            </h2>
          </div>
          <SalesChart />
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-t-xl">
            <h3 className="text-lg font-semibold">Recent Notifications</h3>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="text-center text-gray-500 py-4">
                Loading bookings...
              </div>
            ) : fetchError ? (
              <div className="bg-red-50 text-red-600 text-sm text-center p-4 rounded-md">
                Error: Failed to load bookings
              </div>
            ) : bookingsData.length > 0 ? (
              <div className="space-y-4">
                {bookingsData.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        <span className="font-semibold text-blue-600">
                          {booking.name || "Unknown Client"}
                        </span>{" "}
                        booked{" "}
                        <span className="font-semibold text-purple-600">
                          {serviceNames[booking.service] || "Service"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.bookingDate
                          ? new Date(booking.bookingDate).toLocaleString()
                          : "No date specified"}
                      </p>
                    </div>
                    {/* <button
                      onClick={() => removeNotification(booking._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                      aria-label="Remove notification"
                    >
                      <i className="bi bi-x-circle text-lg"></i>
                    </button> */}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                <p>No bookings available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Table */}
      <div className="mt-8">
        <ProjectTables />
      </div>
    </div>
  );
};

export default Starter;
