import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API;

axios.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("auth"));

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  return config;
});
