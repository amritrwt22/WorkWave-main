import axios from "axios";

const API_BASE_URL = "http://localhost:3002";

export const fetchServiceDetails = async (id) => {
  try {
    console.log("Frontend: Fetching details for id:", id);
    const response = await axios.get(`${API_BASE_URL}/services/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching business details:", error);
    throw error;
  }
};
