import axios from "axios";

// Single Axios instance with base URL pointing to the API server
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Request interceptor: reads token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// --- Named API function exports ---

/** Fetch all vehicles */
export const getVehicles = () => api.get("/vehicles");

/** Fetch a single vehicle by ID */
export const getVehicle = (id) => api.get(`/vehicles/${id}`);

/**
 * Authenticate an admin user.
 * Returns the response — caller is responsible for storing the token.
 */
export const loginAdmin = (credentials) => api.post("/auth/login", credentials);

/** Create a new vehicle listing */
export const createVehicle = (data) => api.post("/vehicles", data);

/** Update an existing vehicle by ID */
export const updateVehicle = (id, data) => api.put(`/vehicles/${id}`, data);

/** Delete a vehicle by ID */
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);

/**
 * Upload a vehicle image to a specific vehicle.
 * @param {number} vehicleId - The vehicle ID
 * @param {File} imageFile - The image file to upload
 * @returns {Promise} - Response containing uploaded image data
 */
export const uploadVehicleImage = (vehicleId, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  return api.post(`/images/${vehicleId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Default export for callers that need the raw instance
export default api;
