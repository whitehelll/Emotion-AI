import api from "./axios";

// Logs
export const getEmotionLogs = () =>
  api.get("/api/emotion/history");

// Global analytics
export const getEmotionAnalytics = () =>
  api.get("/api/emotion/analytics");

// Timeline (global)
export const getEmotionTimeline = () =>
  api.get("/api/emotion/timeline");

// Percentage (global)
export const getEmotionPercentage = () =>
  api.get("/api/emotion/percentage");

// All users breakdown (admin)
export const getUserBreakdown = () =>
  api.get("/api/emotion/user-breakdown");

// ✅ SINGLE USER (FIXED)
export const getUserEmotionBreakdown = (userId) =>
  api.get(`/api/emotion/user/${userId}`);