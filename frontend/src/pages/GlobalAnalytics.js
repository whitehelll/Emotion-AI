import useAnalytics from "../hooks/useAnalytics";
import EmotionPieChart from "../component/charts/EmotionPieChart";

export default function GlobalAnalytics() {
const { emotions } = useAnalytics();

return ( <div> <h1 className="text-white text-xl mb-4">
Global Emotion Analytics </h1>

  <EmotionPieChart data={emotions} />
</div>


);
}
