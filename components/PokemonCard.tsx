import { StyleSheet, View } from "react-native";
import { Text } from "./Themed";
import { Image } from "expo-image";
import { PokemonForCard } from "@/utils/mapPokemonToCardData";

export const PokemonCard = ({ pokemon }: { pokemon: PokemonForCard }) => {
  return (
    <View style={styles.pokemonCard}>
      <Text>{pokemon.id}</Text>
      <Image style={styles.image} source={{ uri: pokemon.imgUrl }} />
      <Text style={styles.name}>{pokemon.name}</Text>
      <Text style={styles.exp}>{pokemon.exp}xp</Text>
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
    backgroundColor: "white",
  },
  name: {
    fontSize: 48,
  },
  exp: {
    fontSize: 20,
  },
  image: {
    width: 300,
    height: 300,
  },
});
