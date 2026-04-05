import { useEffect, useState } from "react";
import axios from "axios";

const useAdminAuth = () => {

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const checkAdmin = async () => {

      try {

        const res = await axios.get(
          "http://localhost:8080/api/admin-auth/me",
          { withCredentials: true }
        );

        setAdmin(res.data.admin);

      } catch {
        setAdmin(null);
      } finally {
        setLoading(false);
      }

    };

    checkAdmin();

  }, []);

  return { admin, loading };
};

export default useAdminAuth;