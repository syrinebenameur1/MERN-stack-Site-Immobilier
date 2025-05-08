// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://immobilier-api.onrender.com/api',
  withCredentials: true, // Ensures cookies are sent in requests
  headers: {
    'Content-Type': 'application/json',
  },
});



export default axiosInstance;


