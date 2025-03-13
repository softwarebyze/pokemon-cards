import React, { useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  interpolate,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const THRESHOLD = width / 8;

interface SwiperProps<T> {
  cards: T[];
  cardIndex: number;
  renderCard: (card: T, index: number) => React.ReactElement;
  onSwipedLeft: (index: number) => void;
  onSwipedRight: (index: number) => void;
}

export const Swiper = <T,>({
  cards,
  cardIndex,
  renderCard,
  onSwipedLeft,
  onSwipedRight,
}: SwiperProps<T>) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Reset animation values when cardIndex changes from parent
  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
  }, [cardIndex]);

  const handleSwipe = (direction: number) => {
    console.log("handleSwipe", { direction });
    if (direction > 0) {
      onSwipedRight(cardIndex);
    } else {
      onSwipedLeft(cardIndex);
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
          { duration: 300 },
          () => {
            runOnJS(handleSwipe)(direction);
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
      [1, 0.5, 0],
      { extrapolateRight: "clamp" }
    );
    return { opacity };
  });

  const rightOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, width / 4, width / 2],
      [0, 0.5, 1],
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
              margin: "auto",
            },
          ]}
        >
          {renderCard(cards[cardIndex], cardIndex)}
          <Animated.View
            style={[
              leftOverlayStyle,
              { position: "absolute", top: 50, right: 0 },
            ]}
          >
            <Text style={{ fontSize: 24, color: "red", fontWeight: "bold" }}>
              NOPE
            </Text>
          </Animated.View>
          <Animated.View
            style={[
              rightOverlayStyle,
              { position: "absolute", top: 50, left: 0 },
            ]}
          >
            <Text style={{ fontSize: 24, color: "green", fontWeight: "bold" }}>
              LIKE
            </Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      {cardIndex < cards.length - 1 && (
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
          {renderCard(cards[cardIndex + 1], cardIndex + 1)}
        </View>
      )}
    </>
  );
};
