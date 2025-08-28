import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false, 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
    }
    return Promise.reject(err);
  }
);

export default API;
