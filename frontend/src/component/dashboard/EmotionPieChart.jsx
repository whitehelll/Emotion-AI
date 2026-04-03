import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

export default function EmotionPieChart({ data }) {
return ( <div className="bg-gray-800 p-4 rounded text-white"> <h3 className="mb-2">Emotion Distribution</h3>


  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={data}
        dataKey="count"
        nameKey="emotion"
      />
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</div>


);
}
