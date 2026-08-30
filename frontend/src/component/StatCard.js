export default function StatCard({ title, value }) {
  return (
    <div className="card p-5">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold text-gray-800 mt-1">
        {value}
      </h2>
    </div>
  );
}