import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.APP_URL,
  withCredentials: true,
});
