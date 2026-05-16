import { getAuthUser } from "../lib/api";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
const useAuthUser = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    enabled: !isAdminRoute   // 🔥 MAIN FIX
  });

  return {
    isLoading: query.isLoading,
    authUser: query.data?.user
  };
};

export default useAuthUser;