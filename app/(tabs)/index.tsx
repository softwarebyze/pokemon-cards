import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Swiper } from "@/components/Swiper";
import { PokemonCard } from "@/components/PokemonCard";
import { fetchPokemonInRange } from "@/fetchPokemon";
import {
  mapPokemonToCardData,
  PokemonForCard,
} from "@/utils/mapPokemonToCardData";
import { usePokemonStore } from "@/pokemon/store";
import { Text, useThemeColor } from "@/components/Themed";

export default function SwipeScreen() {
  const { favorites, addFavorite, skipped, addSkipped } = usePokemonStore();
  const accentColor = useThemeColor({}, "tint");

  const BATCH_SIZE = 20;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["pokemon"],
      queryFn: async ({ pageParam }) => {
        const startId = pageParam;
        const endId = startId + BATCH_SIZE - 1;
        return fetchPokemonInRange(startId, endId);
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.length === 0) return undefined;
        const highestId = Math.max(...lastPage.map((pokemon) => pokemon.id));
        return highestId + 1;
      },
    });

  const pokemonCards = data?.pages
    .flatMap((page) => page)
    .map(mapPokemonToCardData)
    .filter((pokemon) => {
      // Skip if already in favorites or skipped
      const isFavorite = favorites.some((f) => f.id === pokemon.id);
      const isSkipped = skipped.some((s) => s.id === pokemon.id);
      return !isFavorite && !isSkipped;
    });

  if (isLoading || isFetchingNextPage && pokemonCards?.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={accentColor} />
        <Text style={styles.loadingText}>Loading Pokémon...</Text>
      </View>
    );
  }

  if (
    (!pokemonCards || pokemonCards?.length === 0) &&
    !isLoading &&
    !isFetchingNextPage
  ) {
    return (
      <View style={styles.centeredContainer}>
        <Text>No more Pokémon to show</Text>
      </View>
    );
  }

  const renderCard = (card: PokemonForCard) => <PokemonCard pokemon={card} />;

  const onSwipedLeft = (card: PokemonForCard) => {
    if (!card) return;
    addSkipped(card);
  };

  const onSwipedRight = (card: PokemonForCard) => {
    if (!card) return;
    addFavorite(card);
  };

  const onSwipedAll = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  if (!pokemonCards) return null;

  return (
    <View style={styles.container}>
      <Swiper
        cards={pokemonCards}
        renderCard={renderCard}
        onSwipedLeft={onSwipedLeft}
        onSwipedRight={onSwipedRight}
        onSwipedAll={onSwipedAll}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
  },
});
