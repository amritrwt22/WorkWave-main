import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "reactstrap";
import { Row } from "reactstrap";
import toast, { Toaster } from "react-hot-toast";

const Cards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3002/services/adminDashboard",
        {
          withCredentials: true,
        }
      );
      setServices(response.data);
    } catch (error) {
      toast.error(
        "Failed to fetch services: " + (error.response?.data || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const toggleModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price,
      });
    } else {
      setEditingService(null);
      setFormData({ name: "", description: "", price: "" });
    }
    setErrors({ name: "", description: "", price: "" });
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "name") {
      const isValidName = /^[a-zA-Z\s]+$/.test(value);
      setErrors({
        ...errors,
        name: isValidName
          ? ""
          : "Name must not contain numbers or special characters.",
      });
    } else if (name === "description") {
      setErrors({
        ...errors,
        description:
          value.length <= 100
            ? ""
            : "Description cannot exceed 100 characters.",
      });
    } else if (name === "price") {
      const price = Number(value);
      setErrors({
        ...errors,
        price:
          price >= 10 && price <= 10000
            ? ""
            : "Price must be between 10 and 10,000.",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.name || errors.description || errors.price) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    try {
      let response;
      if (editingService) {
        response = await axios.post(
          `http://localhost:3002/services/update/${editingService._id}`,
          formData,
          {
            withCredentials: true,
          }
        );
        toast.success("Service updated successfully!");
      } else {
        response = await axios.post(
          "http://localhost:3002/services/addservice",
          formData,
          {
            withCredentials: true,
          }
        );
        toast.success("Service added successfully!");
      }

      // Fetch the updated services list
      fetchServices();

      // Close the modal
      setIsModalOpen(false);
    } catch (error) {
      toast.error(
        "Error submitting service: " + (error.response?.data || error.message)
      );
    }
  };

  const deleteService = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:3002/services/delete/${id}`,
        { withCredentials: true }
      );
      toast.success("Service deleted successfully!");

      // Refresh the list after deletion
      fetchServices();
    } catch (error) {
      toast.error(
        "Failed to delete service: " + (error.response?.data || error.message)
      );
    }
  };

  return (
    <div className="container mx-auto p-6 relative">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => toggleModal()}
          className="bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-yellow-600"
        >
          +
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md transition-opacity duration-300">
          <div className="relative bg-white rounded-2xl shadow-2xl w-11/12 sm:w-3/4 lg:w-1/2 p-8 max-h-[95vh] overflow-hidden">
            <button
              onClick={() => toggleModal()}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="flex flex-col space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 text-center">
                {editingService ? "Edit Service" : "Add Service"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name of the service"
                    className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-lg"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-lg resize-none h-32"
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-lg"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition duration-300 text-lg"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <Row className="mb-6">
        <h5 className="mb-3 mt-3 text-2xl font-semibold text-gray-800">
          Your Services
        </h5>
        {loading ? (
          <div className="w-full flex justify-center items-center">
            <p className="text-lg text-gray-500">Loading services...</p>
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white p-6 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-xl"
              >
                <h5 className="text-2xl font-semibold text-gray-700">
                  {service.name}
                </h5>
                <p className="text-gray-600 mt-3 break-words">
                  {service.description}
                </p>
                <p className="text-green-600 mt-3 text-xl font-bold">
                  ₹{service.price}
                </p>
                <div className="mt-6 flex gap-4">
                  <Button
                    onClick={() => toggleModal(service)}
                    color="light-warning"
                    className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition duration-300"
                  >
                    Edit Service
                  </Button>
                  <Button
                    onClick={() => deleteService(service._id)}
                    color="light-danger"
                    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Delete Service
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full flex justify-center items-center">
            <p className="text-lg text-gray-500">No services found.</p>
          </div>
        )}
      </Row>
    </div>
  );
};

export default Cards;
