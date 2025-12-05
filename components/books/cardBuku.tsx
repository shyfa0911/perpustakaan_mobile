import { router } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CardBuku({ item }: any) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Load status wishlist saat komponen mount
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
        // Remove from wishlist
        wishlistArray = wishlistArray.filter((id: string) => id !== item.id);
      } else {
        // Add to wishlist
        wishlistArray.push(item.id);
      }
      
      await AsyncStorage.setItem('wishlist', JSON.stringify(wishlistArray));
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.log('Error updating wishlist:', error);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/Home/detail?id=${item.id}`)}
      style={styles.cardWrapper}
      activeOpacity={0.8}
    >
      <View style={styles.card}>
        {/* Cover */}
        <Image source={{ uri: item.cover }} style={styles.cover} />

        {/* Overlay gelap */}
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

        {/* Badge kategori */}
        <View style={styles.badge}>
          <Text style={{ fontSize: 11, fontWeight: "600", color: "#1e3a8a" }}>
            {item.kategori || item.category}
          </Text>
        </View>

        {/* Content bawah */}
        <View style={styles.bottomContent}>
          <Text style={styles.title} numberOfLines={1}>
            {item.judul || item.title}
          </Text>

          <Text style={styles.author} numberOfLines={1}>
            {item.penulis || item.author}
          </Text>

          <View style={styles.rating}>
            <Text style={styles.ratingText}>⭐ {item.rating || "4.5"}</Text>
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
    backgroundColor: "rgba(13, 27, 42, 0.4)",
  },
  heart: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  heartActive: {
    backgroundColor: "rgba(255, 64, 129, 0.3)",
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
  author: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    marginTop: 2,
  },
  rating: {
    marginTop: 4,
    alignItems: "flex-end",
  },
  ratingText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});