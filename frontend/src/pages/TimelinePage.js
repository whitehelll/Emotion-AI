import { useState } from "react";
import useAnalytics from "../hooks/useAnalytics";
import EmotionTimelineChart from "../component/charts/EmotionTimelineChart";

export default function TimelinePage() {
const [userId, setUserId] = useState("");

const { timeline } = useAnalytics(userId);

return ( <div>

  <h1 className="text-white mb-4">Emotion Timeline</h1>

  <input
    placeholder="Enter User ID"
    onChange={(e) => setUserId(e.target.value)}
    className="p-2 rounded mb-4"
  />

  <EmotionTimelineChart data={timeline} />

</div>


);
}
