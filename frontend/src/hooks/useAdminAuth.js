import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const useAdminAuth = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const checkAdmin = async () => {
      if (!isAdminRoute) {
      setLoading(false);
      return;
    }

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
  }, [isAdminRoute]);

  return { admin, loading };
};

export default useAdminAuth;