import { axiosInstance } from "./axios";

export const signup = async (signupData)=>{
    const response = await axiosInstance.post('/auth/signup', signupData);
    return response.data ;
}

export const login = async (loginData)=>{
  const response = await axiosInstance.post("/auth/signin",loginData);
  return response.data;
}


export const logout = async ()=>{
  const response = await axiosInstance.post("/auth/signout");
  return response.data;
}

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      return null; // ✅ expected when not logged as user
    }
    throw error;
  }
};



export const completeOnboarding = async(userData) => {
  const response = await axiosInstance.post("/auth/onboarding",userData);
  return response.data;
}

