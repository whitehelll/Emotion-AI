import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../lib/api";

const useLogout = () => {

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      navigate("/login"); // Redirect after logout
    },
  });

  return { logoutMutation, isPending, error };
};

export default useLogout;