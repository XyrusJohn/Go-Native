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
          DRIVER OPERATOR ACCESS
        </Text>

        <View className="mb-12">
          <Text className="text-5xl font-atkinson text-black mb-2 leading-tight">
            Sign Into <Text className="text-slate-400">Your</Text>
          </Text>
          <Text className="text-5xl font-atkinson text-slate-400 leading-tight">
            Fleet
          </Text>
        </View>

        {/* INPUT FORM */}
        <View className="mb-8">
          <Text className="text-xs font-atkinson-bold text-black mb-2 uppercase">
            Username
          </Text>
          <TextInput
            className="border border-slate-200 rounded-xl px-4 py-4 font-atkinson-bold text-slate-700 mb-6"
            placeholder="RI100000000"
            placeholderTextColor="#9ca3af"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Text className="text-xs font-atkinson-bold text-black mb-2 uppercase">
            Password
          </Text>
          <TextInput
            className="border border-slate-200 rounded-xl px-4 py-4 font-atkinson-bold text-slate-700 mb-8"
            placeholder="***********"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* SUBMIT BUTTON */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoggingIn}
            className={`bg-black rounded-xl py-4 items-center justify-center ${
              isLoggingIn ? "opacity-90" : ""
            }`}
          >
            {isLoggingIn ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-atkinson-bold text-lg tracking-widest">
                LOGIN
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* SEPARATOR LINE */}
        {/* <View className="border-b border-slate-300 mx-8 mb-6" />*/}

        {/* FOOTER LINK */}
        <View className="flex-row justify-center items-center">
          <Text className="text-sm text-black font-atkinson">
            Doesn't have account?{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
            <Text className="text-sm text-black font-atkinson-bold underline decoration-black">
              Register here
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
