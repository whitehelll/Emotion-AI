import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "production"
    ? "http://localhost:8080/api"
    : "/api";   // ✅ SAME DOMAIN in production

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

export default api;