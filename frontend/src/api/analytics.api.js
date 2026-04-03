import api from "./axios";

export const fetchEmotionStats = (userId) =>
  api.get("/api/admin-auth/emotion/analytics", {
    params: { userId }
  });

export const fetchEmotionTimeline = (userId) =>
  api.get("/api/admin-auth/emotion/timeline", {
    params: { userId }
  });



export const fetchUserGrowth = () =>
  api.get("/api/admin-auth/users");   // ✅ ADD THIS
