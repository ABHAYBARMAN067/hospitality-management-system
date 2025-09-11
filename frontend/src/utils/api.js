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
export const getHotels = (city) => {
  const params = city ? { city } : {};
  return API.get("/hotels", { params });
};
export const getHotelsByCity = (city) => API.get(`/hotels/city/${city}`);
export const getHotelById = (id) => API.get(`/hotels/${id}`);
export const createHotel = (formData) => API.post("/hotels", formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const updateHotel = (id, formData) => API.put(`/hotels/${id}`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const deleteHotel = (id) => API.delete(`/hotels/${id}`);

// Table APIs
export const getTablesByHotel = (hotelId) => API.get(`/tables/hotel/${hotelId}`);
export const createTable = (tableData) => API.post("/tables", tableData);
export const updateTable = (id, tableData) => API.put(`/tables/${id}`, tableData);
export const deleteTable = (id) => API.delete(`/tables/${id}`);

// Booking APIs
export const createBooking = (bookingData) => API.post("/bookings", bookingData);
export const getUserBookings = () => API.get("/bookings/user");

export default API;
