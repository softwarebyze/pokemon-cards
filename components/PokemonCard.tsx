import { StyleSheet, View } from "react-native";
import { Text } from "./Themed";
import { Image } from "expo-image";

export const PokemonCard = ({
  pokemon,
}: {
  pokemon: { name: string; exp: number; imgUrl: string };
}) => {
  return (
    <View style={styles.pokemonCard}>
      <Image
        source={{ uri: pokemon.imgUrl }}
        style={{ width: 300, height: 300 }}
      />
      <Text style={styles.name}>{pokemon.name}</Text>
      <Text style={styles.exp}>{pokemon.exp}</Text>
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
  exp: {
    fontSize: 20,
  },
});
