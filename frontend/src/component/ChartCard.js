export default function ChartCard({ title, children }) {
  return (
    <div className="card p-5">
      <h3 className="section-title mb-4">{title}</h3>
      {children}
    </div>
  );
}