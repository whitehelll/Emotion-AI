import api from "./axios";

export const fetchUsers = (params) =>
  api.get("/api/admin-auth/users", { params });

export const fetchDashboard = () =>
  api.get("/api/admin-auth/dashboard");