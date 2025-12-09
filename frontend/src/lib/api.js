// frontend/src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 8000,
  withCredentials: true, // <<— send cookies automatically
});

// Keep requestWithToken for backward compatibility (curl/tests)
// but for cookie flow we don't attach Authorization header by default.
api.requestWithToken = (config = {}) => {
  // If someone passes a token manually, attach it. Otherwise rely on cookie.
  const token = localStorage.getItem("token");
  const headers = { ...(config.headers || {}) };
  if (token && token !== "undefined") headers.Authorization = `Bearer ${token}`;
  return api({ ...config, headers });
};

export default api;

