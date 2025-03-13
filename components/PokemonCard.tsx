import { StyleSheet } from "react-native";
import { Text, useThemeColor, View } from "./Themed";
import { Image } from "expo-image";
import { PokemonForCard } from "@/utils/mapPokemonToCardData";
import { ProgressCircle } from "./ProgressCircle";
import { useSharedValue } from "react-native-reanimated";

export const PokemonCard = ({ pokemon }: { pokemon: PokemonForCard }) => {
  const borderColor = useThemeColor({}, "text");
  const exp = useSharedValue(pokemon.exp);

  return (
    <View style={[styles.pokemonCard, { borderColor }]}>
      <Text>{pokemon.id}</Text>
      <Image style={styles.image} source={{ uri: pokemon.imgUrl }} />
      <Text style={styles.name}>{pokemon.name}</Text>
      <Text style={styles.exp}>{pokemon.exp}xp</Text>
      <ProgressCircle value={exp} max={563} size={30} />
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
  image: {
    width: 300,
    height: 300,
    userSelect: "none",
    pointerEvents: "none",
  },
});
