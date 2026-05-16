import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080/api"
    : "/";   // ✅ same domain in production

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

export default api;