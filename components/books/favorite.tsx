import { useState, useRef, useEffect } from "react";
import {
  View,
  Dimensions,
  Animated,
  PanResponder,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import booksJSON from "@/data.json";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("window");

export default function Favorite() {
  const data = booksJSON.books.slice(0, 5); // ambil 5 buku terpopuler
  const [index, setIndex] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Load wishlist saat komponen mount
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const savedWishlist = await AsyncStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.log('Error loading wishlist:', error);
    }
  };

  const goNext = () => {
    const next = (index + 1) % data.length;
    animateSlide(next);
    setIndex(next);
  };

  const goPrev = () => {
    const prev = (index - 1 + data.length) % data.length;
    animateSlide(prev);
    setIndex(prev);
  };

  const animateSlide = (toIndex: number) => {
    Animated.timing(slideAnim, {
      toValue: -width * toIndex,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const toggleWishlist = async (bookId: string) => {
    try {
      const savedWishlist = await AsyncStorage.getItem('wishlist');
      let wishlistArray = savedWishlist ? JSON.parse(savedWishlist) : [];
      
      if (wishlistArray.includes(bookId)) {
        // Remove from wishlist
        wishlistArray = wishlistArray.filter((id: string) => id !== bookId);
      } else {
        // Add to wishlist
        wishlistArray.push(bookId);
      }
      
      await AsyncStorage.setItem('wishlist', JSON.stringify(wishlistArray));
      setWishlist(wishlistArray);
    } catch (error) {
      console.log('Error updating wishlist:', error);
    }
  };

  // swipe manual
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 20,
      onPanResponderRelease: (_, gs) => {
        if (gs.dx > 50) goPrev();
        else if (gs.dx < -50) goNext();
      },
    })
  ).current;

  // auto-slide
  useEffect(() => {
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [index]);

  return (
    <View style={{ paddingVertical: 16 }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "900",
          color: "#003366",
          paddingHorizontal: 16,
          marginBottom: 12,
        }}
      >
        Terpopuler
      </Text>

      <View
        style={{
          width: "100%",
          height: 220,
          overflow: "hidden",
        }}
      >
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            flexDirection: "row",
            width: width * data.length,
            transform: [{ translateX: slideAnim }],
          }}
        >
          {data.map((book, i) => {
            const isWishlisted = wishlist.includes(book.id);
            
            return (
              <View
                key={i}
                style={{
                  width,
                  paddingHorizontal: 16,
                }}
              >
                <BlurView
                  intensity={40}
                  tint="light"
                  style={{
                    flex: 1,
                    borderRadius: 16,
                    overflow: "hidden",
                    flexDirection: "row",
                    padding: 12,
                    alignItems: "center",
                    backgroundColor: "#ffffff60",
                  }}
                >
                  <Image
                    source={{ uri: book.cover }}
                    style={{
                      width: 100,
                      height: 150,
                      borderRadius: 12,
                    }}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 18,
                          color: "#003366",
                          marginBottom: 6,
                          flex: 1,
                        }}
                        numberOfLines={2}
                      >
                        {book.judul || book.title}
                      </Text>
                      <TouchableOpacity
                        onPress={() => toggleWishlist(book.id)}
                        style={{
                          padding: 4,
                        }}
                      >
                        <Icon 
                          name={isWishlisted ? "heart" : "heart-outline"} 
                          size={24} 
                          color={isWishlisted ? "#FF4081" : "#003366"} 
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 14, color: "#333", marginBottom: 8 }}>
                      {book.penulis || book.author}
                    </Text>
                    
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                      <Text style={{ fontSize: 12, color: "#666", marginRight: 10 }}>
                        ⭐ {book.rating || "4.5"}
                      </Text>
                      <View style={{ 
                        backgroundColor: book.difficulty === 'Mudah' ? '#4CAF50' :
                                       book.difficulty === 'Sedang' ? '#FF9800' : '#F44336',
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 6,
                      }}>
                        <Text style={{ fontSize: 10, color: "white", fontWeight: "600" }}>
                          {book.difficulty || "Sedang"}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={{
                        backgroundColor: "#4f86f7",
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 12,
                        alignSelf: "flex-start",
                      }}
                    >
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                        Pinjam
                      </Text>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </View>
            );
          })}
        </Animated.View>

        {/* tombol prev/next */}
        <TouchableOpacity
          onPress={goPrev}
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: [{ translateY: -20 }],
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: 100,
            padding: 6,
          }}
        >
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goNext}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: [{ translateY: -20 }],
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: 100,
            padding: 6,
          }}
        >
          <Ionicons name="chevron-forward" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}