import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:4000/api", // backend base
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - adds token to all requests
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles auth errors globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 or 403, clear token and redirect (only if not already on signin page)
    if (
      (error?.response?.status === 401 || error?.response?.status === 403) &&
      !window.location.pathname.includes("/signin") &&
      !window.location.pathname.includes("/signup")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("userFullName");
      // Only redirect if we're not already going to signin
      if (window.location.pathname !== "/signin") {
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
