import { useEffect, useState } from "react";
import { fetchUsers } from "../api/user.api";

export default function useUsers(search, filter, page) {
  const [data, setData] = useState({ users: [], total: 0 });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetchUsers({ search, filter, page });

        setData({
          users: res?.data?.users || [],
          total: res?.data?.total || 0,
        });
      } catch (err) {
        console.error("Fetch users failed:", err);

        setData({
          users: [],
          total: 0,
        });
      }
    };

    loadUsers();
  }, [search, filter, page]);

  return data;
}
