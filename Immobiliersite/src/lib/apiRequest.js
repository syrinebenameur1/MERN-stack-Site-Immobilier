import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://immobilier-api.onrender.com/api",
  withCredentials: true,
});

export default apiRequest;
