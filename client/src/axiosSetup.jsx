import axios from "axios";

export const API = import.meta.env.VITE_API;

axios.defaults.baseURL = API;

axios.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("auth"));

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  return config;
});
