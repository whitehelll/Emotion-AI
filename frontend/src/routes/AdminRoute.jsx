import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/admin-auth/me", {
      withCredentials: true
    })
      .then(() => setIsAdmin(true))
      .catch(() => setIsAdmin(false));
  }, []);

  if (isAdmin === null) return <div>Loading...</div>;

  return isAdmin ? children : <Navigate to="/admin-auth/login" />;
};

export default AdminRoute;