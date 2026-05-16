import { useEffect, useState } from "react";
import { fetchUserGrowth, fetchEmotionStats } from "../api/analytics.api";

export default function useAnalytics(userId = null) {
  const [users, setUsers] = useState([]);      // 🔥 NEW
  const [growth, setGrowth] = useState([]);
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadAnalytics = async () => {
      try {
        setLoading(true);

        // ✅ FETCH USERS
        const res = await fetchUserGrowth();

        const usersData = res?.data?.users || [];

        console.log("USERS DATA:", usersData);

        if (isMounted) {
          setUsers(usersData);  // 🔥 IMPORTANT

          // ✅ Convert to growth chart format
          setGrowth(
            usersData.map((_, index) => ({
              date: index + 1,
              users: index + 1,
            }))
          );
        }

        // 🎭 Emotion stats
        if (userId) {
          const emotionRes = await fetchEmotionStats(userId);
          const emotionData = emotionRes?.data?.stats || [];

          if (isMounted) setEmotions(emotionData);
        } else {
          if (isMounted) setEmotions([]);
        }

      } catch (err) {
        console.error("Analytics Error:", err);
        if (isMounted) {
          setError(err);
          setUsers([]);
          setGrowth([]);
          setEmotions([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { users, growth, emotions, loading, error }; // 🔥 RETURN USERS
}