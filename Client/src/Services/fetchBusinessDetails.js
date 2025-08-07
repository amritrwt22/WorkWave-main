import axios from "axios";

const API_BASE_URL = "http://localhost:3002"; // Replace with your actual API base URL

export const fetchBusinessDetails = async (id) => {
  try {
    console.log("Frontend: Fetching details for id:", id);
    const response = await axios.get(
      `${API_BASE_URL}/business/getBusiness/${id}`
    );
    return response.data; // Returns the data from the API
  } catch (error) {
    console.error("Error fetching business details:", error);
    throw error; // Throw the error to be handled by the calling function
  }
};
