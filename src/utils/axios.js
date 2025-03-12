// src/utils/axios.js

import axios from 'axios';

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5002/api', // Your backend server's API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to add the JWT token to the Authorization header if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage (or you can use cookies)
    const token = localStorage.getItem('token'); // Adjust this if your token is stored somewhere else
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
