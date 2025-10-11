// frontend/api/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Request interceptor to include token
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token'); // JWT from login
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default api;
