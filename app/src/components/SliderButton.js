import React, { useState } from "react";
import { View, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withSpring,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

const BUTTON_HEIGHT = 80;
const THUMB_RATIO = 0.28;
const ICON_SIZE = 30;
const FONT_SIZE = 15;
const PADDING = 4;

const COMPLETE_THRESHOLD = 0.8;

export default function SlideButton({
  onSlideComplete,
  label = "SLIDE TO START QUEUE",
  disabled = false,
}) {
  const [thumbWidth, setThumbWidth] = useState(0);

  const maxX = useSharedValue(0);
  const translateX = useSharedValue(0);
  const busy = useSharedValue(false);

  const handleLayout = (e) => {
    const innerWidth = e.nativeEvent.layout.width - PADDING * 2;
    const tw = innerWidth * THUMB_RATIO;

    setThumbWidth(tw);
    maxX.value = innerWidth - tw;
  };

  const pan = Gesture.Pan()
    .enabled(!disabled)
    .onUpdate((e) => {
      if (busy.value) return;
      translateX.value = Math.min(Math.max(e.translationX, 0), maxX.value);
    })
    .onEnd(() => {
      if (busy.value) return;

      if (translateX.value >= maxX.value * COMPLETE_THRESHOLD) {
        busy.value = true;

        translateX.value = withTiming(
          maxX.value,
          { duration: 150, easing: Easing.out(Easing.quad) },
          (finished) => {
            if (!finished) {
              busy.value = false;
              return;
            }

            runOnJS(onSlideComplete)();

            translateX.value = withDelay(
              300,
              withTiming(
                0,
                { duration: 450, easing: Easing.inOut(Easing.cubic) },
                () => {
                  busy.value = false;
                },
              ),
            );
          },
        );
      } else {
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
          overshootClamping: true,
        });
      }
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, Math.max(maxX.value * 0.6, 1)],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <View
      onLayout={handleLayout}
      style={{ height: BUTTON_HEIGHT, padding: PADDING }}
      className={`w-full rounded-lg justify-center overflow-hidden ${
        disabled ? "bg-green-300" : "bg-[#33cc00]"
      }`}
    >
      <Animated.View
        style={[{ paddingLeft: thumbWidth }, labelStyle]}
        className="absolute inset-0 justify-center items-center"
        pointerEvents="none"
      >
        <Text
          style={{ fontSize: FONT_SIZE }}
          className="text-white font-atkinson-bold tracking-wider"
        >
          {label}
        </Text>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[{ width: thumbWidth, height: "100%" }, thumbStyle]}
          className="bg-white rounded-md justify-center items-center"
        >
          <View className="flex-row items-center">
            {[0, 1, 2].map((i) => (
              <Feather
                key={i}
                name="chevron-right"
                size={ICON_SIZE}
                color="black"
                style={{ marginRight: i < 2 ? -ICON_SIZE / 2 : 0 }}
              />
            ))}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
