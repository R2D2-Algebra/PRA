import API from "./client";

export const login = async (email, password) => {
  const { data } = await API.post("/auth/login", { email, password });
  return data; 
};

export const register = async (payload) => {
  const { data } = await API.post("/auth/register", payload);
  return data;
};

export const me = async () => {
  const { data } = await API.get("/auth/me");
  return data; 
};

export const googleStartUrl = `${import.meta.env.VITE_API_URL}/auth/google`;
