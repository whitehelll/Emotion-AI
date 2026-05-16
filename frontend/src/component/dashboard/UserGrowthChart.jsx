import {
LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function UserGrowthChart({ data }) {
return ( <div className="bg-gray-800 p-4 rounded text-white"> <h3 className="mb-2">User Growth</h3>


  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="users" />
    </LineChart>
  </ResponsiveContainer>
</div>


);
}
