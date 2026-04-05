import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const endpoint =
        data.type === "admin"
          ? "http://localhost:8080/api/admin-auth/login"
          : "http://localhost:8080/api/auth/login";

      const res = await axios.post(endpoint, data, {
        withCredentials: true,
      });

      return res.data;
    },

    onSuccess: (data) => {
      // ✅ ROLE-BASED REDIRECT
      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        if (data.user.isOnboard) {
          navigate("/");
        } else {
          navigate("/onboarding");
        }
      }
    },
  });

  return loginMutation;
};

export default useLogin;