// src/axiosInstance.ts
import axios from 'axios';

// Create an Axios instance with default settings (e.g., base URL)
const axiosInstance = axios.create({
  baseURL: 'https://mintyapi-a6euhmhxe4dme7du.centralindia-01.azurewebsites.net', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
