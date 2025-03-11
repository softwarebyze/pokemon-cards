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
      <Text>{pokemon.name}</Text>
      <Image
        source={{ uri: pokemon.imgUrl }}
        style={{ width: 80, height: 80 }}
      />
      <Text>{pokemon.exp}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pokemonCard: {
    borderWidth: 1,
  },
});
