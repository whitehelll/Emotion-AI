export default function StatsCards({ users }) {
const totalUsers = users.length;

const verifiedUsers = users.filter(u => u.isVerified).length;

return ( <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">


  <div className="bg-gray-800 p-4 rounded text-white">
    <h3 className="text-sm">Total Users</h3>
    <p className="text-2xl font-bold">{totalUsers}</p>
  </div>

  <div className="bg-gray-800 p-4 rounded text-white">
    <h3 className="text-sm">Verified Users</h3>
    <p className="text-2xl font-bold">{verifiedUsers}</p>
  </div>

</div>

);
}
