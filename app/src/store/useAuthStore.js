import { create } from "zustand";
import { Alert } from "react-native";

import { axiosInstance } from "../api/axios.js";

export const useAuthStore = create((set, get) => ({
  // Initial State
  authUser: null,
  userData: [],
  truckCompanies: [],

  isCheckingAuth: false,
  isRegistering: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isFetchingTruckCompanies: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const checkAuthRes = await axiosInstance.get("auth/check");
      set({ authUser: checkAuthRes.data.user });
    } catch (error) {
      set({ authUser: null });
      const errorMsg = error.response?.data?.data || "Failed to check auth";
      console.error("Error in checkAuth:", errorMsg);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  driverRegistration: async (driverData) => {
    try {
      set({ isRegistering: true });
      const driverRegistrationRes = await axiosInstance.post(
        "auth/register",
        driverData,
      );
      set({ authUser: driverRegistrationRes.data.user });
      Alert.alert("Success", "Driver registered successfully");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to register driver";
      Alert.alert("Error", errorMsg);
      console.error("Error in driverRegistration:", error);
    } finally {
      set({ isRegistering: false });
    }
  },

  driverLogin: async (driverData) => {
    try {
      set({ isLoggingIn: true });
      const loginRes = await axiosInstance.post("auth/login", driverData);
      set({ authUser: loginRes.data.user });
      Alert.alert("Success", "Logged in successfully");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to login driver";
      Alert.alert("Error", errorMsg);
      console.error("Error in driverLogin", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  driverLogout: async () => {
    try {
      set({ isLoggingOut: true });
      await axiosInstance.post("auth/logout");
      set({ authUser: null });
      Alert.alert("Logout successful");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to logout driver";
      Alert.alert("Error", errorMsg);
      console.error("Error in driverLogout", error);
    } finally {
      set({ isLoggingOut: false });
    }
  },

  fetchTruckCompanies: async () => {
    try {
      set({ isFetchingTruckCompanies: true });
      const fetchTruckCompaniesRes = await axiosInstance.get(
        "auth/truck-companies",
      );

      set({ truckCompanies: fetchTruckCompaniesRes.data.data });
    } catch (error) {
      console.error("Error in fetchTruckCompanies", error);
    } finally {
      set({ isFetchingTruckCompanies: false });
    }
  },
}));
