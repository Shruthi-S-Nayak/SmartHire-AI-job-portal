import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://smarthire-ai-job-portal.onrender.com/api",
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto logout on 401 (expired/invalid token)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Only redirect if not already on login/register page
      if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default API;
