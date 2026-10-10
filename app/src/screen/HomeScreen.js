import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import SlideButton from "../components/SliderButton.js";
import { useAuthStore } from "../store/useAuthStore.js";

const TABS = [
  { key: "ongoing", label: "ON GOING" },
  { key: "completed", label: "COMPLETED" },
];

function ProfileHeader({ name, avatarUri, compact }) {
  const size = compact ? 40 : 48;
  return (
    <View className="flex-row items-center px-5 pt-2 pb-3">
      {avatarUri ? (
        <Image
          source={{ uri: avatarUri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : (
        <View
          className="bg-gray-300"
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      )}
      <Text
        numberOfLines={1}
        className="flex-1 ml-3 text-xs font-atkinson-bold text-black tracking-wider"
      >
        {name.toUpperCase()}
      </Text>
    </View>
  );
}

function StatusTabs({ active, onChange }) {
  return (
    <View className="flex-row border-b border-gray-200">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            className="flex-1 items-center py-3"
          >
            <Text
              className={`text-[11px] font-atkinson-bold tracking-wider ${
                isActive ? "text-red-600" : "text-black"
              }`}
            >
              {tab.label}
            </Text>
            <View
              className={`absolute bottom-0 h-[2px] w-full ${
                isActive ? "bg-red-600" : "bg-transparent"
              }`}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

function BottomNav({ active = "home", onNavigate }) {
  const items = [
    { key: "home", icon: "home", iconOff: "home-outline", label: "Home" },
    // { key: "history", icon: "time", iconOff: "time-outline", label: "History" },
    {
      key: "profile",
      icon: "person",
      iconOff: "person-outline",
      label: "Profile",
    },
  ];

  return (
    <View className="flex-row items-center justify-around bg-white border-t border-gray-100 pt-2">
      {items.map((item) => {
        const isActive = item.key === active;
        return (
          <Pressable
            key={item.key}
            onPress={() => onNavigate?.(item.key)}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            hitSlop={12}
            className="flex-1 items-center py-1"
          >
            <Ionicons
              name={isActive ? item.icon : item.iconOff}
              size={26}
              color="#000"
            />
          </Pressable>
        );
      })}
    </View>
  );
}

export default function HomeScreen() {
  const { userData, fetchDriverData } = useAuthStore();

  useEffect(() => {
    fetchDriverData();
  }, []);

  const driverFullName =
    userData?.firstName && userData?.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : `${userData.username || "Driver"}`;

  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState("ongoing");
  const [inQueue, setInQueue] = useState(false);

  // Maliit na phone? paliitin ang spacing.
  const compact = height < 700;

  const handleStartQueue = () => {
    navigation.navigate("QrScanner");
    // TODO: tawagin dito yung API para mag-join sa queue
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
        <ProfileHeader name={driverFullName} compact={compact} />
        <StatusTabs active={activeTab} onChange={setActiveTab} />

        {activeTab === "ongoing" ? (
          <View className="flex-1 px-6">
            <View className="flex-1 items-center justify-center py-2">
              <View className="flex-1 w-full items-center justify-center">
                <Image
                  source={require("../../assets/Delivery.png")}
                  resizeMode="contain"
                  style={{ width: "100%", height: "100%", zIndex: -1000 }}
                />
              </View>

              <Text
                className="text-sm font-atkinson-bold text-black tracking-wider"
                style={{ marginTop: compact ? 12 : 24 }}
              >
                {inQueue ? "IN QUEUE" : "NOT IN QUEUE"}
              </Text>
            </View>

            <View
              style={{ paddingBottom: compact ? 12 : 20 }}
              className="mb-20"
            >
              {inQueue ? (
                <Pressable
                  onPress={() => setInQueue(false)}
                  accessibilityRole="button"
                  className="h-14 rounded-md bg-red-600 items-center justify-center"
                >
                  <Text className="text-white text-xs font-atkinson-bold tracking-wider">
                    LEAVE QUEUE
                  </Text>
                </Pressable>
              ) : (
                <SlideButton onSlideComplete={handleStartQueue} />
              )}
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-sm font-atkinson-bold text-black tracking-wider">
              NO COMPLETED JOBS YET
            </Text>
          </View>
        )}

        <BottomNav
          active="home"
          onNavigate={(key) => {
            if (key !== "home") navigation.navigate(key);
          }}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
