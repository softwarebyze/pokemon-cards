import React, { useEffect, useState } from "react";
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
import { Text } from "./Themed";

const { width } = Dimensions.get("window");
const THRESHOLD = width / 8;

interface Item {
  id: string | number;
}

interface SwiperProps<T extends Item> {
  cards: T[];
  renderCard: (card: T) => React.ReactElement;
  renderNextCard: (card: T) => React.ReactElement;
  onSwipedLeft: (card: T) => void;
  onSwipedRight: (card: T) => void;
}

export const Swiper = <T extends Item>({
  cards,
  renderCard,
  renderNextCard,
  onSwipedLeft,
  onSwipedRight,
}: SwiperProps<T>) => {
  const [cardIndex, setCardIndex] = useState(0);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
  }, [cardIndex]);

  const handleSwipe = (direction: number) => {
    setCardIndex((prevCardIndex) => prevCardIndex + 1);
    if (direction > 0) {
      onSwipedRight(cards[cardIndex]);
    } else {
      onSwipedLeft(cards[cardIndex]);
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

  if (cardIndex >= cards.length) {
    return <Text>No mo</Text>;
  }

  return cards
    .map((card, i) => {
      if (i === cardIndex) {
        return (
          <GestureDetector key={card.id} gesture={panGesture}>
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
              {renderCard(card)}
              <Animated.View
                style={[
                  leftOverlayStyle,
                  { position: "absolute", top: 140, right: 40 },
                ]}
              >
                <Text
                  style={{ fontSize: 40, color: "red", fontWeight: "bold" }}
                >
                  NOPE
                </Text>
              </Animated.View>
              <Animated.View
                style={[
                  rightOverlayStyle,
                  { position: "absolute", top: 140, left: 40 },
                ]}
              >
                <Text
                  style={{ fontSize: 40, color: "green", fontWeight: "bold" }}
                >
                  LIKE
                </Text>
              </Animated.View>
            </Animated.View>
          </GestureDetector>
        );
      } else if (i > cardIndex) {
        return (
          <Animated.View
            key={card.id}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
            }}
          >
            {renderNextCard(card)}
          </Animated.View>
        );
      }
    })
    .reverse();
};
