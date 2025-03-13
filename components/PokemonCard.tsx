import { StyleSheet } from "react-native";
import { Text, useThemeColor, View } from "./Themed";
import { Image } from "expo-image";
import { PokemonForCard } from "@/utils/mapPokemonToCardData";
import { ProgressCircle } from "./ProgressCircle";

export const PokemonCard = ({ pokemon }: { pokemon: PokemonForCard }) => {
  const borderColor = useThemeColor({}, "text");

  return (
    <View style={[styles.pokemonCard, { borderColor }]}>
      <Text>{pokemon.id}</Text>
      <Image style={styles.image} source={{ uri: pokemon.imgUrl }} />
      <Text style={styles.name}>{pokemon.name}</Text>
      <ProgressCircle value={pokemon.exp} max={563} size={46} />
    </View>
  );
};

const styles = StyleSheet.create({
  pokemonCard: {
    borderWidth: 1,
    padding: 20,
    alignSelf: "center",
    borderRadius: 8,
    margin: "auto",
  },
  name: {
    fontSize: 48,
  },
  image: {
    width: 300,
    height: 300,
    userSelect: "none",
    pointerEvents: "none",
  },
});
