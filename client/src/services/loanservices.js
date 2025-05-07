import axios from "axios";
import { toast } from "sonner";
// const BASE_URL = "http://localhost:3000";
const BASE_URL = "https://sku-lms.onrender.com";

export const getLoanById = async (id) => {
  if (!id) {
    toast.error("Loan ID is required");
    return null;
  }
  const removeQuotes = (str) => str.replace(/(^"|"$)/g, "");

  const data = id;
  const cleanedData = removeQuotes(data);
  try {
    const response = await axios.get(`${BASE_URL}/loan/getloanbyid/${cleanedData}`);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to get loan details");
    return null;
  }
};
