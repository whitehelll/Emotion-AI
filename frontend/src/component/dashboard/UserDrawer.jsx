import useUserDetails from "../../hooks/useUserDetails";
import EmotionPieChart from "../charts/EmotionPieChart";
import EmotionTimelineChart from "../charts/EmotionTimelineChart";
import { generateInsights } from "../../utils/aiInsights";

export default function UserDrawer({ user, onClose }) {
  const { emotions, timeline } = useUserDetails(user?._id);

  if (!user) return null;

  const insight = generateInsights(emotions);

  return (
    <div className="fixed right-0 top-0 w-96 h-full bg-white shadow-lg p-4 overflow-auto">
      <button onClick={onClose}>Close</button>

      <h2 className="text-xl font-bold">{user.name}</h2>

      <p className="mt-2 text-sm text-gray-600">
        AI Insight: {insight}
      </p>

      <div className="mt-4">
        <EmotionPieChart data={emotions} />
      </div>

      <div className="mt-4">
        <EmotionTimelineChart data={timeline} />
      </div>
    </div>
  );
}