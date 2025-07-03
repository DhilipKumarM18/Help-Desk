import axios from "axios";

// for customer
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // Adjust port if needed
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
