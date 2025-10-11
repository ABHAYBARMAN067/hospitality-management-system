import axios from "axios";

// Base URL dynamically set based on environment
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://hospitality-management-system-1-ay7g.onrender.com/api"
    : "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // JWT from login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
