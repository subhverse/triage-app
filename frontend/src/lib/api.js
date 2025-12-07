import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 5000,
});

// Auth wrapper that attaches token if available
api.requestWithToken = (config = {}) => {
  const token = localStorage.getItem("token");
  const headers = { ...(config.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  return api({ ...config, headers });
};

export default api;
