import { router } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

export default function CardBuku({ item }: any) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/detail?id=${item.id}`)}
      style={styles.cardWrapper}
      activeOpacity={0.8}
    >
      <View style={styles.card}>
        {/* Cover */}
        <Image source={{ uri: item.cover }} style={styles.cover} />

        {/* Overlay gelap */}
        <View style={styles.overlay} />

        {/* Wishlist Heart */}
        <View style={styles.heart}>
          <Text style={{ fontSize: 20, color: "white" }}>♡</Text>
        </View>

        {/* Badge kategori */}
        <View style={styles.badge}>
          <Text style={{ fontSize: 11, fontWeight: "600", color: "#1e3a8a" }}>
            {item.kategori}
          </Text>
        </View>

        {/* Content bawah */}
        <View style={styles.bottomContent}>
          <Text style={styles.title} numberOfLines={1}>
            {item.judul}
          </Text>

          <Text style={styles.sinopsis} numberOfLines={2}>
            {item.sinopsis?.slice(0, 50)}...
          </Text>

          <View style={styles.rating}>
            <Text style={styles.ratingText}>4.5 ⭐</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: "48%",
    marginVertical: 8,
  },
  card: {
    height: 220,
    borderRadius: 20,
    backgroundColor: "#dbeafe",
    overflow: "hidden",
    position: "relative",

    // Shadow simple
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cover: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(13, 27, 42, 0.4)", // gelap tipis
  },
  heart: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  bottomContent: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  sinopsis: {
    color: "white",
    fontSize: 12,
    marginTop: 2,
    opacity: 0.9,
    fontStyle: "italic",
  },
  rating: {
    marginTop: 4,
    alignItems: "flex-end",
  },
  ratingText: {
    color: "white",
    fontWeight: "bold",
  },
});
