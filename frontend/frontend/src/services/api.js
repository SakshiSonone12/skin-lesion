import axios from "axios";

// Temporary: Hardcoded Render Backend URL
const API = axios.create({
  baseURL: "https://skin-lesion-7.onrender.com/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("dermai_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Request URL:", config.baseURL + config.url);

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data);

    if (error.response?.status === 401) {
      localStorage.removeItem("dermai_token");
      localStorage.removeItem("dermai_user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;