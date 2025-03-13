import React, { useRef } from "react";
import { Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  interpolate,
} from "react-native-reanimated";
import { Text, View } from "./Themed";

const { width } = Dimensions.get("window");
const THRESHOLD = width / 8;

interface SwiperProps<T> {
  cards: T[];
  renderCard: (card: T, index: number) => React.ReactElement;
  onSwipedLeft: (index: number) => void;
  onSwipedRight: (index: number) => void;
}

export const Swiper = <T,>({
  cards,
  renderCard,
  onSwipedLeft,
  onSwipedRight,
}: SwiperProps<T>) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const cardIndex = useRef(0);

  const currentCard = cards[cardIndex.current];
  const nextCard = cards[cardIndex.current + 1];

  const handleSwipe = (direction: number) => {
    console.log("handleSwipe", { direction });
    if (direction > 0) {
      onSwipedRight(cardIndex.current);
    } else {
      onSwipedLeft(cardIndex.current);
    }
  };

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
            duration: 300,
          },
          () => {
            runOnJS(handleSwipe)(direction);
            translateX.value = 0;
            translateY.value = 0;
          }
        );
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${translateX.value / 10}deg` },
    ],
  }));

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
    <>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            animatedStyle,
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 2,
            },
          ]}
        >
          {renderCard(currentCard, cardIndex.current)}
          <Animated.View
            style={[
              leftOverlayStyle,
              { position: "absolute", top: 0, right: 0 },
            ]}
          >
            <Text style={{ fontSize: 24, color: "red", fontWeight: "bold" }}>
              NOPE
            </Text>
          </Animated.View>
          <Animated.View
            style={[
              rightOverlayStyle,
              { position: "absolute", top: 0, left: 0 },
            ]}
          >
            <Text style={{ fontSize: 24, color: "green", fontWeight: "bold" }}>
              LIKE
            </Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      {nextCard && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        >
          {renderCard(nextCard, cardIndex.current + 1)}
        </View>
      )}
    </>
  );
};
