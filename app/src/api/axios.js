import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_APP_URL,
  timeout: 5000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("Error getting token from SecureStore", error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);
