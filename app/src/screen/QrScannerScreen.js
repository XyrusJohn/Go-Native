import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  Easing,
  PanResponder,
  Linking,
  useWindowDimensions,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const PURPLE = "#A100FF";
const PURPLE_SOFT = "rgba(161,0,255,0.10)";
const ZOOM_MIN = 1;
const ZOOM_MAX = 5;
const clamp = (n) => Math.max(0, Math.min(1, n));

// ---------- Corner bracket ----------
function Corner({ position, size = 54, thickness = 8 }) {
  const isTop = position.startsWith("top");
  const isLeft = position.endsWith("Left");
  const r = 18;

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        width: size,
        height: size,
        [isTop ? "top" : "bottom"]: 0,
        [isLeft ? "left" : "right"]: 0,
        borderColor: PURPLE,
        borderTopWidth: isTop ? thickness : 0,
        borderBottomWidth: isTop ? 0 : thickness,
        borderLeftWidth: isLeft ? thickness : 0,
        borderRightWidth: isLeft ? 0 : thickness,
        borderTopLeftRadius: isTop && isLeft ? r : 0,
        borderTopRightRadius: isTop && !isLeft ? r : 0,
        borderBottomLeftRadius: !isTop && isLeft ? r : 0,
        borderBottomRightRadius: !isTop && !isLeft ? r : 0,
      }}
    />
  );
}

function Viewfinder({
  size,
  zoom = 0,
  active = true,
  scanned = false,
  permission,
  onRequestPermission,
  onBarcodeScanned,
  onScanAgain,
}) {
  const inset = 20;
  const travel = size - inset * 2 - 4;

  const scanY = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;
  const ping = useRef(new Animated.Value(0)).current;
  const blink = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loops = [
      // scan line up and down
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanY, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(scanY, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ),
      // corners animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(breathe, {
            toValue: 1,
            duration: 1300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(breathe, {
            toValue: 0,
            duration: 1300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ),
      // focus ping
      Animated.loop(
        Animated.timing(ping, {
          toValue: 1,
          duration: 1700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ),
      // "SCANNING" blink
      Animated.loop(
        Animated.sequence([
          Animated.timing(blink, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(blink, {
            toValue: 0,
            duration: 650,
            useNativeDriver: true,
          }),
        ]),
      ),
    ];
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [scanY, breathe, ping, blink]);

  const lineY = scanY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, travel],
  });
  const cornerScale = breathe.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.965],
  });
  const cornerOpacity = breathe.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });
  const pingScale = ping.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 3.2],
  });
  const pingOpacity = ping.interpolate({
    inputRange: [0, 1],
    outputRange: [0.55, 0],
  });

  return (
    <View
      className="bg-black overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: 18,
        shadowColor: PURPLE,
        shadowOpacity: 0.35,
        shadowRadius: 22,
        shadowOffset: { width: 0, height: 8 },
        elevation: 10,
      }}
    >
      {permission?.granted && active && (
        <CameraView
          style={absFill}
          facing="back"
          zoom={zoom}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={scanned ? undefined : onBarcodeScanned}
        />
      )}

      {/* faint grid */}
      {[1 / 3, 2 / 3].map((p) => (
        <View key={`v${p}`} pointerEvents="none">
          <View
            style={{
              position: "absolute",
              left: size * p,
              top: 0,
              width: StyleHairline,
              backgroundColor: "rgba(255,255,255,0.10)",
              height: size,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: size * p,
              left: 0,
              width: size,
              height: StyleHairline,
              backgroundColor: "rgba(255,255,255,0.10)",
            }}
          />
        </View>
      ))}

      {/* corners (breathing) */}
      <Animated.View
        pointerEvents="none"
        style={{
          ...absFill,
          opacity: cornerOpacity,
          transform: [{ scale: cornerScale }],
        }}
      >
        <Corner position="topLeft" />
        <Corner position="topRight" />
        <Corner position="bottomLeft" />
        <Corner position="bottomRight" />
      </Animated.View>

      {/* focus dot + ping ring */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: size * 0.22,
          left: size * 0.22,
          width: 10,
          height: 10,
        }}
      >
        <Animated.View
          style={{
            ...absFill,
            borderRadius: 5,
            backgroundColor: PURPLE,
            opacity: pingOpacity,
            transform: [{ scale: pingScale }],
          }}
        />
        <View
          style={{
            ...absFill,
            borderRadius: 5,
            backgroundColor: PURPLE,
          }}
        />
      </View>

      {/* scan line + glow */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: inset,
          left: 14,
          right: 14,
          height: 4,
          transform: [{ translateY: lineY }],
        }}
      >
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: -22,
            height: 48,
            borderRadius: 24,
            backgroundColor: PURPLE,
            opacity: 0.1,
          }}
        />
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: -8,
            height: 20,
            borderRadius: 10,
            backgroundColor: PURPLE,
            opacity: 0.22,
          }}
        />
        <View
          style={{
            height: 4,
            borderRadius: 2,
            backgroundColor: PURPLE,
            shadowColor: PURPLE,
            shadowOpacity: 1,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 0 },
          }}
        />
      </Animated.View>

      {/* status chip */}
      <View
        className="absolute left-0 right-0 items-center"
        style={{ bottom: 14 }}
      >
        <Pressable
          disabled={!scanned}
          onPress={onScanAgain}
          accessibilityRole="button"
          accessibilityLabel="Scan again"
          className="flex-row items-center rounded-full px-3 py-1"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        >
          <Animated.View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: PURPLE,
              marginRight: 6,
              opacity: scanned ? 1 : blink,
            }}
          />
          <Text
            className="text-white font-atkinson-bold"
            style={{ fontSize: 9, letterSpacing: 1.5 }}
          >
            {scanned ? "QR DETECTED · TAP TO SCAN AGAIN" : "SCANNING"}
          </Text>
        </Pressable>
      </View>

      {!permission?.granted && (
        <View
          className="absolute items-center justify-center px-6"
          style={{ ...absFill, backgroundColor: "rgba(0,0,0,0.88)" }}
        >
          <Ionicons name="camera-outline" size={34} color="#fff" />
          <Text
            className="text-white text-center font-atkinson-bold mt-3"
            style={{ fontSize: 12 }}
          >
            {permission
              ? "Camera access is needed to scan QR codes"
              : "Checking camera permission..."}
          </Text>
          {permission && (
            <Pressable
              onPress={onRequestPermission}
              accessibilityRole="button"
              className="mt-4 rounded-full px-5 py-2"
              style={{ backgroundColor: PURPLE }}
            >
              <Text
                className="text-white font-atkinson-bold"
                style={{ fontSize: 11, letterSpacing: 1 }}
              >
                {permission.canAskAgain ? "ALLOW CAMERA" : "OPEN SETTINGS"}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const StyleHairline = 1;
const absFill = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 };

const PAD = 16;
const THUMB = 28;

function ZoomSlider({ value, onChange }) {
  const [w, setW] = useState(0);
  const widthRef = useRef(1);
  const startRef = useRef(value);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        const v = clamp((e.nativeEvent.locationX - PAD) / widthRef.current);
        startRef.current = v;
        onChangeRef.current?.(v);
      },
      onPanResponderMove: (_, g) => {
        onChangeRef.current?.(
          clamp(startRef.current + g.dx / widthRef.current),
        );
      },
    }),
  ).current;

  const ticks = [0, 1, 2, 3, 4];

  return (
    <View>
      <View
        {...pan.panHandlers}
        style={{ height: 44, justifyContent: "center" }}
      >
        <View
          pointerEvents="none"
          style={{
            height: 44,
            justifyContent: "center",
            paddingHorizontal: PAD,
          }}
        >
          {/* track */}
          <View
            onLayout={(e) => {
              widthRef.current = e.nativeEvent.layout.width || 1;
              setW(e.nativeEvent.layout.width);
            }}
            className="bg-gray-200 rounded-full"
            style={{ height: 6 }}
          >
            <View
              className="rounded-full"
              style={{
                height: 6,
                width: `${value * 100}%`,
                backgroundColor: PURPLE,
              }}
            />
          </View>

          {ticks.map((i) => (
            <View
              key={i}
              style={{
                position: "absolute",
                left: PAD + (w * i) / 4 - 1,
                top: 14,
                width: 2,
                height: 4,
                borderRadius: 1,
                backgroundColor: value >= i / 4 ? "#fff" : "#D1D5DB",
                opacity: value >= i / 4 ? 0.8 : 1,
              }}
            />
          ))}

          <View
            style={{
              position: "absolute",
              left: PAD + value * w - THUMB / 2,
              top: 22 - THUMB / 2,
              width: THUMB,
              height: THUMB,
              borderRadius: THUMB / 2,
              backgroundColor: "#fff",
              borderWidth: 3,
              borderColor: PURPLE,
              shadowColor: PURPLE,
              shadowOpacity: 0.35,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
              elevation: 6,
            }}
          />
        </View>
      </View>

      <View pointerEvents="none" style={{ height: 16, marginHorizontal: PAD }}>
        {ticks.map((i) => {
          const active = Math.abs(value - i / 4) < 0.125;
          return (
            <Text
              key={i}
              style={{
                position: "absolute",
                left: `${i * 25}%`,
                width: 28,
                marginLeft: -14,
                textAlign: "center",
                fontSize: 10,
                color: active ? PURPLE : "#9CA3AF",
                fontWeight: active ? "700" : "500",
              }}
            >
              {ZOOM_MIN + i}x
            </Text>
          );
        })}
      </View>
    </View>
  );
}

function StepButton({ icon, onPress, label }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="items-center justify-center rounded-full bg-gray-100 border border-gray-200"
      style={({ pressed }) => ({
        width: 36,
        height: 36,
        marginTop: 4,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Ionicons name={icon} size={18} color="#111" />
    </Pressable>
  );
}

function ZoomCard({ value, onChange }) {
  const zoom = ZOOM_MIN + value * (ZOOM_MAX - ZOOM_MIN);

  return (
    <View
      className="w-full bg-white border border-gray-200 px-4 pt-4 pb-3"
      style={{
        borderRadius: 24,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
        elevation: 4,
      }}
    >
      {/* header */}
      <View className="flex-row items-center justify-between px-1 mb-1">
        <View className="flex-row items-center">
          <View
            className="items-center justify-center rounded-full"
            style={{ width: 28, height: 28, backgroundColor: PURPLE_SOFT }}
          >
            <Ionicons name="search" size={14} color={PURPLE} />
          </View>
          <Text className="ml-2 text-sm font-atkinson-bold text-black">
            Camera Zoom
          </Text>
        </View>
        <View
          className="rounded-full px-3 py-1"
          style={{ backgroundColor: PURPLE_SOFT }}
        >
          <Text
            className="font-atkinson-bold"
            style={{ color: PURPLE, fontSize: 12 }}
          >
            {zoom.toFixed(1)}x
          </Text>
        </View>
      </View>

      {/* controls */}
      <View className="flex-row items-start">
        <StepButton
          icon="remove"
          label="Zoom out"
          onPress={() => onChange(clamp(value - 0.25))}
        />
        <View className="flex-1">
          <ZoomSlider value={value} onChange={onChange} />
        </View>
        <StepButton
          icon="add"
          label="Zoom in"
          onPress={() => onChange(clamp(value + 0.25))}
        />
      </View>
    </View>
  );
}

// ---------- Screen ----------
export default function ScanQRScreen({ onScan }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { width, height } = useWindowDimensions();
  const [zoom, setZoom] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const scanLock = useRef(false);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    if (isFocused) {
      scanLock.current = false;
      setScanned(false);
    }
  }, [isFocused]);

  const handleBarcodeScanned = ({ data }) => {
    if (scanLock.current) return;
    scanLock.current = true;
    setScanned(true);

    if (onScan) onScan(data);
    else console.log("QR scanned:", data);
  };

  const handleScanAgain = () => {
    scanLock.current = false;
    setScanned(false);
  };

  const handlePermissionPress = () => {
    if (permission?.canAskAgain) requestPermission();
    else Linking.openSettings();
  };

  const enter = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 550,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter]);

  const frameSize = Math.min(width * 0.7, height * 0.38, 320);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      {/* HEADER */}
      <View className="px-5 pt-2 pb-2 flex-row items-start">
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="w-10 h-10 justify-center"
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </Pressable>
        <View className="flex-1 items-center">
          <Text className="text-xl font-atkinson-bold text-black">Scan QR</Text>
          <Text className="text-xs text-gray-500 mt-1">
            Point Camera at ticket queue
          </Text>
        </View>
        <View className="w-10" />
      </View>

      {/* BODY */}
      <Animated.View
        className="flex-1 items-center justify-evenly px-6"
        style={{
          opacity: enter,
          transform: [
            {
              translateY: enter.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0],
              }),
            },
          ],
        }}
      >
        <Viewfinder
          size={frameSize}
          zoom={zoom}
          active={isFocused}
          scanned={scanned}
          permission={permission}
          onRequestPermission={handlePermissionPress}
          onBarcodeScanned={handleBarcodeScanned}
          onScanAgain={handleScanAgain}
        />

        <Text className="text-center text-sm font-atkinson-bold text-black px-4">
          Align the <Text style={{ color: PURPLE }}>QR code</Text> within the
          purple frame to scan automatically
        </Text>

        <ZoomCard value={zoom} onChange={setZoom} />
      </Animated.View>
    </SafeAreaView>
  );
}
