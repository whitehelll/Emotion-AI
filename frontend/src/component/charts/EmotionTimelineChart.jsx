import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function EmotionTimelineChart({ data }) {
  return (
    <LineChart width={500} height={300} data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line dataKey="count" />
    </LineChart>
  );
}