import { ScrollView, StyleSheet } from "react-native";
import { fetchPokemonInRange } from "@/fetchPokemon";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PokemonCard } from "@/components/PokemonCard";

export default function SwipeScreen() {
  const [id, setId] = useState(1);
  const BATCH_SIZE = 4;
  const { data: pokemons } = useQuery({
    queryFn: async () => await fetchPokemonInRange(id, id + BATCH_SIZE),
    queryKey: ["pokemon", id],
  });

  if (!pokemons) return null;

  const thePokemon = pokemons[0]!;

  const pokemon = {
    name: thePokemon.name,
    exp: thePokemon.base_experience,
    imgUrl: thePokemon.sprites.front_default,
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <PokemonCard pokemon={pokemon} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 8,
    fontWeight: "bold",
  },
});
