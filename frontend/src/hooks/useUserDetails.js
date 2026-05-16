import { useEffect, useState } from "react";
import { fetchEmotionStats, fetchEmotionTimeline } from "../api/analytics.api";

export default function useUserDetails(userId) {
  const [emotions, setEmotions] = useState([]);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    if (!userId) return;

    fetchEmotionStats(userId).then(res => {
      setEmotions(res.data.stats);
    });

    fetchEmotionTimeline(userId).then(res => {
      setTimeline(res.data.stats.map(i => ({
        date: i._id.date,
        count: i.count
      })));
    });

  }, [userId]);

  return { emotions, timeline };
}