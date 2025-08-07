import axios from "axios";

export const fetchBusinesses = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3002/business/getBusiness`,
      {
        credentials: "include",
      }
    );
    return response.data; // Assuming response.data contains the businesses data
  } catch (error) {
    console.error("Error fetching businesses:", error);
    throw error;
  }
};
