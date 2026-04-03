export default function UserTable({ users = [], onSelectUser }) {
  // ✅ Handle empty state
  if (!users.length) {
    return (
      <div className="text-center py-6 text-gray-400">No users found </div>
    );
  }

  return (
    <table className="w-full border-collapse">
      
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Last Active</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id} onClick={() => onSelectUser(user)}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{new Date(user.updatedAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
      <tbody>
        {users.map((user) => (
          <tr
            key={user?._id || user?.email}
            className="cursor-pointer hover:bg-gray-100 transition"
            onClick={() => onSelectUser?.(user)}
          >
            <td className="p-3">{user?.name || "N/A"}</td>

            <td className="p-3">{user?.email || "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
