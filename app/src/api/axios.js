import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_APP_URL,
  withCredentials: true,
  timeout: 5000,
});
