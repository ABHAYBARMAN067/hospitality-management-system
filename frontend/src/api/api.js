import axios from "axios";

// Base URL dynamically set based on environment
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "" // PASTE  backend URL
    : "http://localhost:5000/api"; // Local development backend

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
