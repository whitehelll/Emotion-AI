import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function EmotionBarChart({ data }) {
  return (
    <BarChart width={400} height={300} data={data}>
      <XAxis dataKey="emotion" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" />
    </BarChart>
  );
}