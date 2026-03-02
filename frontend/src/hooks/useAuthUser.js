import { getAuthUser } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

const useAuthUser = () => {

  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 0
  });

  return {
    isLoading: query.isLoading,

    // IMPORTANT FIX
    authUser: query.data?.user
  };

};

export default useAuthUser;