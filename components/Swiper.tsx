import React from "react";
import { View, StyleSheet } from "react-native";

import { Text } from "./Themed";
import { SwiperCard } from "./SwiperCard";

interface Item {
  id: string | number;
}

interface SwiperProps<T extends Item> {
  cards: T[];
  renderCard: (card: T, next: boolean) => React.ReactElement;
  onSwipedLeft: (card: T) => void;
  onSwipedRight: (card: T) => void;
  onSwipedAll?: () => void;
}

export const Swiper = <T extends Item>({
  cards,
  renderCard,
  onSwipedLeft,
  onSwipedRight,
  onSwipedAll,
}: SwiperProps<T>) => {
  const handleSwipe = (direction: number) => {
    if (cards.length === 0) return;

    const currentCard = cards[0];

    if (direction > 0) {
      onSwipedRight(currentCard);
    } else {
      onSwipedLeft(currentCard);
    }

    // If we've swiped all cards, call the callback
    if (cards.length === 1 && onSwipedAll) {
      onSwipedAll();
    }
  };

  if (cards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Loading more Pokémon...</Text>
      </View>
    );
  }

  return cards.slice(0, 2).map((card, index) => {
    return (
      <SwiperCard
        key={card.id}
        handleSwipe={handleSwipe}
        zIndex={cards.length - index}
        swipeEnabled={index === 0}
      >
        {renderCard(card, index > 0)}
      </SwiperCard>
    );
  });
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
});
