import { PropsWithChildren } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Text } from "./Themed";

const { width } = Dimensions.get("window");

const THRESHOLD = width / 8;

type SwiperCardProps = PropsWithChildren<{
  zIndex: number;
  handleSwipe: (direction: number) => void;
  swipeEnabled?: boolean;
}>;

export const SwiperCard = ({
  handleSwipe,
  children,
  zIndex,
  swipeEnabled = true,
}: SwiperCardProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${translateX.value / 10}deg` },
    ],
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      const { translationX } = event;
      const swipedFarEnough = Math.abs(translationX) > THRESHOLD;

      if (swipedFarEnough) {
        const direction = translationX > 0 ? 1 : -1;

        translateX.value = withTiming(
          direction * width * 2,
          {
            duration: 100,
          },
          () => {
            runOnJS(handleSwipe)(direction);
          }
        );
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    })
    .enabled(swipeEnabled);

  const leftOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-width / 8, -width / 16, 0],
      [1, 0.6, 0],
      { extrapolateRight: "clamp" }
    );
    return { opacity };
  });

  const rightOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, width / 16, width / 8],
      [0, 0.6, 1],
      { extrapolateLeft: "clamp" }
    );
    return { opacity };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[animatedStyle, styles.cardContainer, { zIndex }]}>
        {children}
        <Animated.View style={[leftOverlayStyle, styles.leftOverlay]}>
          <Text style={styles.nopeText}>NOPE</Text>
        </Animated.View>
        <Animated.View style={[rightOverlayStyle, styles.rightOverlay]}>
          <Text style={styles.likeText}>LIKE</Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  leftOverlay: {
    position: "absolute",
    top: 140,
    right: 40,
  },
  rightOverlay: {
    position: "absolute",
    top: 140,
    left: 40,
  },
  nopeText: {
    fontSize: 40,
    color: "red",
    fontWeight: "bold",
  },
  likeText: {
    fontSize: 40,
    color: "green",
    fontWeight: "bold",
  },
});
