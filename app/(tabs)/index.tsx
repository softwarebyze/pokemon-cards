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

export default function SwipeScreen() {
  const { favorites, addFavorite, skipped, addSkipped } = usePokemonStore();

  const BATCH_SIZE = 20;

  const { data } = useQuery({
    queryFn: async () => await fetchPokemonInRange(1, BATCH_SIZE),
    queryKey: ["pokemon", 1, BATCH_SIZE],
    select: (data) => data.map(mapPokemonToCardData),
  });

  if (!data) return null;

  const theCards = data.filter(
    (p) =>
      !favorites.some((f) => f.id === p.id) &&
      !skipped.some((s) => s.id === p.id)
  );

  const renderCard = (card: PokemonForCard) => <PokemonCard pokemon={card} />;

  const onSwipedLeft = (index: number) => {
    console.log(`Swiped left on ${theCards[index]?.name}`);
    addSkipped(theCards[index]);
  };
  const onSwipedRight = (index: number) => {
    const card = theCards[index];
    console.log(`Swiped right on ${card.name}`);
    if (!card) return;
    addFavorite(card);
  };

  // const onSwipedAll = () => // fetch next batch? if i % batch_size === 0 ... fetch more?

  return (
    <View style={{ flex: 1 }}>
      <Swiper
        cards={theCards}
        renderCard={renderCard}
        onSwipedLeft={onSwipedLeft}
        onSwipedRight={onSwipedRight}
        // onSwipedAll={onSwipedAll}
      />
    </View>
  );
}
