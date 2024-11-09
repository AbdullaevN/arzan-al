import axios from "axios";

const API_BASE_URL = "https://cargo-back.onrender.com";

export const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((config: any) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});
