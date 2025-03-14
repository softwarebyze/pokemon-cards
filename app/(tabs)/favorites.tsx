import { FlatList, StyleSheet } from "react-native";
import { usePokemonStore } from "@/pokemon/store";
import { Text, View } from "@/components/Themed";
import { ProgressCircle } from "@/components/ProgressCircle";
import { Image } from "expo-image";

export default function FavoritesScreen() {
  const favorites = usePokemonStore((state) => state.favorites);
  return (
    <FlatList
      data={favorites}
      scrollToOverflowEnabled
      keyExtractor={(f) => f.id.toString()}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item: favorite }) => (
        <View style={styles.row}>
          <View style={styles.left}>
            <Image style={styles.image} source={{ uri: favorite.imgUrl }} />
            <Text style={styles.title}>{favorite.name}</Text>
          </View>
          <ProgressCircle value={favorite.exp} max={563} size={46} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingInline: 8,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  image: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 20,
  },
  separator: {
    backgroundColor: "lightgrey",
    height: StyleSheet.hairlineWidth,
  },
});
