import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../store/useAuthStore.js";

export default function LoginScreen() {
  const navigation = useNavigation();

  const { driverLogin, isLoggingIn } = useAuthStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Basic check para hindi mag-submit ng blanko
    if (!username || !password) return;
    driverLogin({ username, password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-8">
        {/* TOP HEADER */}
        <Text className="text-xs font-atkinson-bold text-slate-800 tracking-wider mb-4">
          Home
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
