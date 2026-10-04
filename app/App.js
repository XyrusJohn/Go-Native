import "./global.css";
import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-100 p-6">
      <Text className="text-4xl font-extrabold text-blue-600 mb-4 tracking-tight">
        It Works! 🎉
      </Text>

      <Text className="text-base text-slate-600 text-center mb-8">
        NativeWind v4 is successfully configured. You can now start building
        your UI using Tailwind classes directly in React Native.
      </Text>

      <TouchableOpacity className="bg-blue-600 px-6 py-3 rounded-xl active:bg-blue-800">
        <Text className="text-white font-semibold text-lg">Sample Button</Text>
      </TouchableOpacity>

      <StatusBar style="dark" />
    </View>
  );
}
