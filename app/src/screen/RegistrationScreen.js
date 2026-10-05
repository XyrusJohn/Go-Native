import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { useAuthStore } from "../store/useAuthStore.js";
import CompanyDropdown from "../components/CompanyDropdown.js";

export default function RegistrationScreen() {
  const navigation = useNavigation();

  const {
    truckCompanies,
    fetchTruckCompanies,
    driverRegistration,
    isRegistering,
  } = useAuthStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] =
    useState("Select Company");

  // Store data for input fields
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    phoneNumber: "",
    middleInitial: "",
    password: "",
    confirmPassword: "",
    email: "",
    truck_company_id: "",
  });

  useEffect(() => {
    fetchTruckCompanies();
  }, []);

  const handleRegister = () => {
    // Check if all required fields are filled
    if (
      !formData.lastName ||
      !formData.firstName ||
      !formData.phoneNumber ||
      !formData.middleInitial ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.email ||
      !formData.truck_company_id
    ) {
      Alert.alert("Incomplete Form", "Please fill in all required fields.");
      return;
    }
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      Alert.alert(
        "Password Error",
        "Your passwords do not match. Please try again.",
      );
      return;
    }
    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address (e.g. johndoe@gmail.com).",
      );
      return;
    }

    Alert.alert("Success", "Form is valid and ready to submit!");
    // Sends the form data to the backend
    driverRegistration(formData);
  };
  // Handles company selection from the dropdown
  const handleCompanySelect = (company) => {
    setFormData({ ...formData, truck_company_id: company.id });
    setSelectedCompanyName(company.name);
    setIsDropdownOpen(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* CUSTOM HEADER */}
        <View className="flex-row items-center justify-center pt-4 pb-4 bg-white">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-4 left-6 z-10"
          >
            <Feather name="arrow-left" size={28} color="black" />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-xl font-atkinson-bold text-black">
              Driver Registration
            </Text>
            <Text className="text-xs font-atkinson text-slate-400 mt-1">
              Fill in all required field
            </Text>
          </View>
        </View>

        {/* FORM CONTAINER (Fixed view without scrolling as requested) */}
        {/* TODO: Must be scrollable since some of input fields are hidden */}
        <View className="flex-1 px-6 py-6">
          {/* LAST NAME */}
          <View className="mb-4">
            <Text className="text-sm font-atkinson-bold text-black mb-2">
              Last Name
            </Text>
            <TextInput
              className="bg-white border border-slate-300 rounded-2xl px-4 py-4 font-atkinson text-slate-800"
              placeholder="e.g. Dela Cruz"
              placeholderTextColor="#9ca3af"
              value={formData.lastName}
              onChangeText={(text) =>
                setFormData({ ...formData, lastName: text })
              }
            />
          </View>

          {/* FIRST NAME */}
          <View className="mb-4">
            <Text className="text-sm font-atkinson-bold text-black mb-2">
              First Name
            </Text>
            <TextInput
              className="bg-white border border-slate-300 rounded-2xl px-4 py-4 font-atkinson text-slate-800"
              placeholder="e.g. Juan"
              placeholderTextColor="#9ca3af"
              value={formData.firstName}
              onChangeText={(text) =>
                setFormData({ ...formData, firstName: text })
              }
            />
          </View>

          {/* TWO COLUMNS: PHONE NUMBER & MIDDLE INITIAL */}
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 mr-3">
              <Text className="text-sm font-atkinson-bold text-black mb-2">
                Phone Number
              </Text>
              <TextInput
                className="bg-white border border-slate-300 rounded-2xl px-4 py-4 font-atkinson text-slate-800"
                placeholder="e.g. 09123456789"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                value={formData.phoneNumber}
                onChangeText={(text) =>
                  setFormData({ ...formData, phoneNumber: text })
                }
              />
            </View>
            <View className="w-1/3">
              <Text className="text-sm font-atkinson-bold text-black mb-2">
                Middle Initial
              </Text>
              <TextInput
                className="bg-white border border-slate-300 rounded-2xl px-4 py-4 font-atkinson text-slate-800 text-center"
                placeholder="e.g. P"
                placeholderTextColor="#9ca3af"
                maxLength={2}
                value={formData.middleInitial}
                onChangeText={(text) =>
                  setFormData({ ...formData, middleInitial: text })
                }
              />
            </View>
          </View>

          {/* PASSWORD */}
          <View className="mb-4">
            <Text className="text-sm font-atkinson-bold text-black mb-2">
              Password
            </Text>
            <TextInput
              className="bg-white border border-slate-300 rounded-2xl px-4 py-4 font-atkinson text-slate-800"
              placeholder="********"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
            />
          </View>

          {/* CONFIRM PASSWORD */}
          <View className="mb-4">
            <Text className="text-sm font-atkinson-bold text-black mb-2">
              Confirm Password
            </Text>
            <TextInput
              className="bg-white border border-slate-300 rounded-2xl px-4 py-4 font-atkinson text-slate-800"
              placeholder="********"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, confirmPassword: text })
              }
            />
          </View>

          {/* EMAIL */}
          <View className="mb-4">
            <Text className="text-sm font-atkinson-bold text-black mb-2">
              Email
            </Text>
            <TextInput
              className="bg-white border border-slate-300 rounded-2xl px-4 py-4 font-atkinson text-slate-800"
              placeholder="johndoe@gmail.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
          </View>

          {/* TRUCK COMPANY DROPDOWN TRIGGER */}
          <View className="mb-8">
            <Text className="text-sm font-atkinson-bold text-black mb-2">
              Truck Company
            </Text>
            {/* When pressed, opens the dropdown */}
            <TouchableOpacity
              onPress={() => setIsDropdownOpen(true)}
              className="bg-white border border-slate-300 rounded-2xl px-4 py-4 flex-row justify-between items-center"
            >
              <Text
                className={`font-atkinson ${
                  formData.truck_company_id
                    ? "text-slate-800"
                    : "text-slate-400"
                }`}
              >
                {selectedCompanyName}
              </Text>
              <Feather name="chevron-down" size={20} color="black" />
            </TouchableOpacity>
          </View>

          {/* IMPORTED COMPANY DROPDOWN MODAL */}
          <CompanyDropdown
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            companies={truckCompanies}
            selectedId={formData.truck_company_id}
            onSelect={handleCompanySelect}
          />

          {/* SUBMIT BUTTON */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={isRegistering}
            className={`bg-black rounded-2xl py-5 items-center justify-center mb-8 ${
              isRegistering ? "opacity-70" : ""
            }`}
          >
            {isRegistering ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-atkinson-bold text-lg tracking-widest">
                CONFIRM
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
