import { PieChart, Pie, Tooltip } from "recharts";

export default function EmotionPieChart({ data }) {
  return (
    <PieChart width={300} height={300}>
      <Pie data={data} dataKey="count" nameKey="emotion" />
      <Tooltip />
    </PieChart>
  );
}