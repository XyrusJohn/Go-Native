import "./global.css";
import { useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  useFonts,
  AtkinsonHyperlegible_400Regular,
  AtkinsonHyperlegible_700Bold,
} from "@expo-google-fonts/atkinson-hyperlegible";

import { useAuthStore } from "./src/store/useAuthStore.js";

import LoginScreen from "./src/screen/LoginScreen.js";
import RegistrationScreen from "./src/screen/RegistrationScreen.js";
import HomeScreen from "./src/screen/HomeScreen.js";

const Stack = createNativeStackNavigator();
export default function App() {
  const [fontsLoaded] = useFonts({
    AtkinsonHyperlegible_400Regular,
    AtkinsonHyperlegible_700Bold,
  });

  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (!fontsLoaded || isCheckingAuth) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-slate-600 font-medium">
          Loading session...
        </Text>
      </View>
    );
  }
  // for dev purposes, skip login
  const SKIP_LOGIN = __DEV__ && true;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {SKIP_LOGIN || authUser ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Registration"
              component={RegistrationScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
