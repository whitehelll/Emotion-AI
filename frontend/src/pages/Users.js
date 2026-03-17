import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {

  const [users, setUsers] = useState([]);

  useEffect(() => {

    const fetchUsers = async () => {
      try {

        const res = await axios.get(
          "http://localhost:8080/api/users",
          { withCredentials: true }
        );

        setUsers(res.data.users);

      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();

  }, []);

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Registered Users
      </h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">

        <table className="min-w-full">

          <thead className="bg-gray-800 text-white">

            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Registration Date</th>
            </tr>

          </thead>

          <tbody className="text-gray-700">

            {users.length === 0 ? (

              <tr>
                <td
                  colSpan="3"
                  className="text-center py-6 text-red-500 font-semibold"
                >
                  No users found
                </td>
              </tr>

            ) : (

              users.map((user) => (

                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-100 transition"
                >

                  <td className="py-3 px-6 font-medium text-blue-600">
                    {user.name}
                  </td>

                  <td className="py-3 px-6 text-green-600">
                    {user.email}
                  </td>

                  <td className="py-3 px-6 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );
}