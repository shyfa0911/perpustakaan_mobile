// components/CardBukuKategori.tsx (VERSI KATEGORI BESAR)
import { router } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CardKategori({ item }: any) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    checkWishlistStatus();
  }, []);

  const checkWishlistStatus = async () => {
    try {
      const savedWishlist = await AsyncStorage.getItem('wishlist');
      if (savedWishlist) {
        const wishlistArray = JSON.parse(savedWishlist);
        setIsWishlisted(wishlistArray.includes(item.id));
      }
    } catch (error) {
      console.log('Error checking wishlist:', error);
    }
  };

  const handleWishlistPress = async () => {
    try {
      const savedWishlist = await AsyncStorage.getItem('wishlist');
      let wishlistArray = savedWishlist ? JSON.parse(savedWishlist) : [];
      
      if (isWishlisted) {
        wishlistArray = wishlistArray.filter((id: string) => id !== item.id);
      } else {
        wishlistArray.push(item.id);
      }
      
      await AsyncStorage.setItem('wishlist', JSON.stringify(wishlistArray));
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.log('Error updating wishlist:', error);
    }
  };

  // Warna kategori
  const getCategoryColor = (kategori: string) => {
    const colors: any = {
      "Teknologi": "#3b82f6",
      "Fiksi": "#8b5cf6",
      "Sains": "#10b981",
      "Sejarah": "#f59e0b",
      "Bisnis": "#ef4444",
      "Seni": "#ec4899",
      "Pendidikan": "#06b6d4",
      "Kesehatan": "#22c55e",
    };
    return colors[kategori] || "#6b7280";
  };

  const kategori = item.kategori || item.category || "Umum";
  const categoryColor = getCategoryColor(kategori);

  return (
    <TouchableOpacity
      onPress={() => router.push(`/Home/detail?id=${item.id}`)}
      style={styles.cardWrapper}
      activeOpacity={0.8}
    >
      <View style={styles.card}>
        {/* Cover */}
        <Image source={{ uri: item.cover }} style={styles.cover} />

        {/* Overlay gradient */}
        <View style={styles.overlay} />

        {/* Wishlist Heart */}
        <TouchableOpacity
          style={[styles.heart, isWishlisted && styles.heartActive]}
          onPress={(e) => {
            e.stopPropagation();
            handleWishlistPress();
          }}
        >
          <Icon 
            name={isWishlisted ? "heart" : "heart-outline"} 
            size={20} 
            color={isWishlisted ? "#FF4081" : "white"} 
          />
        </TouchableOpacity>

        {/* Kategori Badge - BESAR & COLORFUL */}
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <Icon name="tag" size={12} color="#fff" />
          <Text style={styles.categoryText}>
            {kategori}
          </Text>
        </View>

        {/* Content bawah */}
        <View style={styles.bottomContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {item.judul || item.title}
            </Text>
            <View style={styles.rating}>
              <Icon name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating || "4.5"}</Text>
            </View>
          </View>

          <Text style={styles.author} numberOfLines={1}>
            {item.penulis || item.author}
          </Text>

          {/* Kategori info tambahan */}
          <View style={styles.categoryInfo}>
            <Icon name="bookshelf" size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.categoryInfoText}>
              Kategori: {kategori}
            </Text>
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
    height: 240, // lebih tinggi buat kategori
    borderRadius: 20,
    backgroundColor: "#dbeafe",
    overflow: "hidden",
    position: "relative",
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
    backgroundColor: "rgba(13, 27, 42, 0.5)",
  },
  heart: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  heartActive: {
    backgroundColor: "rgba(255, 64, 129, 0.3)",
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#3b82f6",
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 4,
  },
  bottomContent: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ratingText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 11,
    marginLeft: 3,
  },
  author: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  categoryInfoText: {
    fontSize: 10,
    color: "rgba(255,255,255,0.9)",
    marginLeft: 4,
    fontWeight: "500",
  },
});