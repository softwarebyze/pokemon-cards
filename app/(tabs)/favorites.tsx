import { StyleSheet } from "react-native";
import { usePokemonStore } from "@/pokemon/store";
import { Text, View } from "@/components/Themed";
import { ProgressCircle } from "@/components/ProgressCircle";

export default function FavoritesScreen() {
  const favorites = usePokemonStore((state) => state.favorites);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      {favorites.map((favorite) => (
        <Text key={favorite.id}>
          {favorite.id} {favorite.name} {favorite.exp}
          <ProgressCircle value={favorite.exp} max={563} size={46} />
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
