import { useState } from "react";
import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Swiper } from "@/components/Swiper";
import { PokemonCard } from "@/components/PokemonCard";
import { fetchPokemonInRange } from "@/fetchPokemon";
import {
  mapPokemonToCardData,
  PokemonForCard,
} from "@/utils/mapPokemonToCardData";

export default function SwipeScreen() {
  const [i, setI] = useState(0);

  const BATCH_SIZE = 20;

  const { data: theCards } = useQuery({
    queryFn: async () => await fetchPokemonInRange(1, BATCH_SIZE),
    queryKey: ["pokemon", 1, BATCH_SIZE],
    select: (data) => data.map(mapPokemonToCardData),
  });

  if (!theCards) return null;

  const renderCard = (card: PokemonForCard) => <PokemonCard pokemon={card} />;

  const onSwipedLeft = (index: number) => {
    setI((prevI) => prevI + 1);
    console.log(`Swiped left on ${theCards[index]?.name}`);
  };
  const onSwipedRight = (index: number) => {
    setI((prevI) => prevI + 1);
    console.log(`Swiped right on ${theCards[index]?.name}`);
  };

  // const onSwipedAll = () => // fetch next batch? if i % batch_size === 0 ... fetch more?

  return (
    <View style={{ flex: 1 }}>
      <Swiper
        cards={theCards}
        cardIndex={i}
        renderCard={renderCard}
        onSwipedLeft={onSwipedLeft}
        onSwipedRight={onSwipedRight}
        // onSwipedAll={onSwipedAll}
      />
    </View>
  );
}
