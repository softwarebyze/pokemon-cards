import React, { useEffect, useState } from "react";
import { Dimensions, View, StyleSheet } from "react-native";
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
  onSwipedAll?: () => void;
}

export const Swiper = <T extends Item>({
  cards,
  renderCard,
  renderNextCard,
  onSwipedLeft,
  onSwipedRight,
  onSwipedAll,
}: SwiperProps<T>) => {
  const [cardIndex, setCardIndex] = useState(0);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Reset animation values when cardIndex changes
  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
  }, [cardIndex]);

  // Reset cardIndex when cards array changes
  useEffect(() => {
    setCardIndex(0);
  }, [cards]);

  const handleSwipe = (direction: number) => {
    if (cards.length === 0) return;

    const currentCard = cards[cardIndex];

    if (direction > 0) {
      onSwipedRight(currentCard);
    } else {
      onSwipedLeft(currentCard);
    }

    const nextIndex = cardIndex + 1;
    setCardIndex(nextIndex);

    // If we've swiped all cards, call the callback
    if (nextIndex >= cards.length && onSwipedAll) {
      onSwipedAll();
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

  if (cards.length === 0 || cardIndex >= cards.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Loading more Pokémon...</Text>
      </View>
    );
  }

  return cards
    .map((card, i) => {
      if (i === cardIndex) {
        return (
          <GestureDetector key={card.id} gesture={panGesture}>
            <Animated.View style={[animatedStyle, styles.cardContainer]}>
              {renderCard(card)}
              <Animated.View style={[leftOverlayStyle, styles.leftOverlay]}>
                <Text style={styles.nopeText}>NOPE</Text>
              </Animated.View>
              <Animated.View style={[rightOverlayStyle, styles.rightOverlay]}>
                <Text style={styles.likeText}>LIKE</Text>
              </Animated.View>
            </Animated.View>
          </GestureDetector>
        );
      } else if (i > cardIndex) {
        return (
          <Animated.View key={card.id} style={styles.nextCardContainer}>
            {renderNextCard(card)}
          </Animated.View>
        );
      }
      return null;
    })
    .filter(Boolean)
    .reverse();
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
  },
  cardContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  nextCardContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
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
