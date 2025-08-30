import axios from "axios";

// Backend base URL
const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend server URL
});

// Interceptor for adding token if user is logged in
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth APIs
export const loginUser = (credentials) => API.post("/auth/login", credentials);
export const signupUser = (data) => API.post("/auth/signup", data);

// Hotel APIs
export const getHotels = () => API.get("/hotels");
export const getHotelById = (id) => API.get(`/hotels/${id}`);

// Booking APIs
export const createBooking = (bookingData) => API.post("/bookings", bookingData);
export const getUserBookings = () => API.get("/bookings/user");

export default API;
