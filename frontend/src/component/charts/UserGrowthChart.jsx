import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function UserGrowthChart({ data }) {
  return (
    <LineChart width={600} height={300} data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="users" />
    </LineChart>
  );
}