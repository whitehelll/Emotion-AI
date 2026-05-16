export default function Filters({ search, setSearch, filter, setFilter }) {
  return (
    <div className="flex gap-4">
      <input
        className="border p-2"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border p-2"
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="new">New</option>
      </select>
    </div>
  );
}