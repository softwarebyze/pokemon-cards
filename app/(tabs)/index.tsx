import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Swiper } from "@/components/Swiper";
import { PokemonCard } from "@/components/PokemonCard";
import { fetchPokemonInRange } from "@/fetchPokemon";
import {
  mapPokemonToCardData,
  PokemonForCard,
} from "@/utils/mapPokemonToCardData";
import { usePokemonStore } from "@/pokemon/store";
import { Text } from "@/components/Themed";

export default function SwipeScreen() {
  const { favorites, addFavorite, skipped, addSkipped } = usePokemonStore();

  const BATCH_SIZE = 20;

  const { data, isLoading } = useQuery({
    queryFn: async () => await fetchPokemonInRange(1, BATCH_SIZE),
    queryKey: ["pokemon", 1, BATCH_SIZE],
    select: (data) => data.map(mapPokemonToCardData),
  });

  if (isLoading)
    return (
      <View style={{ margin: "auto" }}>
        <Text>Loading...</Text>
      </View>
    );

  if (!data) return null;

  const renderCard = (card: PokemonForCard) => <PokemonCard pokemon={card} />;
  const renderNextCard = (card: PokemonForCard) => (
    <PokemonCard pokemon={card} next />
  );
  const onSwipedLeft = (card: PokemonForCard) => {
    console.log(`Swiped left on ${card?.name}`);
    addSkipped(card);
  };
  const onSwipedRight = (card: PokemonForCard) => {
    console.log(`Swiped right on ${card?.name}`);
    if (!card) return;
    addFavorite(card);
  };

  // const onSwipedAll = () => // fetch next batch? if i % batch_size === 0 ... fetch more?

  return (
    <View style={{ flex: 1 }}>
      <Swiper
        cards={data}
        renderCard={renderCard}
        renderNextCard={renderNextCard}
        onSwipedLeft={onSwipedLeft}
        onSwipedRight={onSwipedRight}
        // onSwipedAll={onSwipedAll}
      />
    </View>
  );
}
