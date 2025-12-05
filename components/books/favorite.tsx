import { useState, useRef, useEffect } from "react";
import {
  View,
  Dimensions,
  Animated,
  PanResponder,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import booksJSON from "@/data.json";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85; // 85% dari lebar layar
const CARD_HEIGHT = 180;

export default function Favorite() {
  const data = booksJSON.books.slice(0, 5);
  const [index, setIndex] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Load wishlist
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
    Animated.spring(slideAnim, {
      toValue: -((CARD_WIDTH + 10) * toIndex), // +10 untuk margin
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const toggleWishlist = async (bookId: string) => {
    try {
      const savedWishlist = await AsyncStorage.getItem('wishlist');
      let wishlistArray = savedWishlist ? JSON.parse(savedWishlist) : [];
      
      if (wishlistArray.includes(bookId)) {
        wishlistArray = wishlistArray.filter((id: string) => id !== bookId);
      } else {
        wishlistArray.push(bookId);
      }
      
      await AsyncStorage.setItem('wishlist', JSON.stringify(wishlistArray));
      setWishlist(wishlistArray);
    } catch (error) {
      console.log('Error updating wishlist:', error);
    }
  };

  // Swipe manual
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 10,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          goPrev();
        } else if (gestureState.dx < -50) {
          goNext();
        }
      },
    })
  ).current;

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [index]);

  // Indikator dots
  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {data.map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === index ? styles.activeDot : styles.inactiveDot
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buku Terpopuler</Text>
      <Text style={styles.subtitle}>Rekomendasi buku yang sedang tren</Text>

      <View style={styles.carouselContainer}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.carousel,
            {
              width: (CARD_WIDTH + 10) * data.length,
              transform: [{ translateX: slideAnim }],
            }
          ]}
        >
          {data.map((book, i) => {
            const isWishlisted = wishlist.includes(book.id);
            
            return (
              <View key={i} style={styles.cardWrapper}>
                <BlurView intensity={30} tint="light" style={styles.card}>
                  {/* Book Cover */}
                  <Image
                    source={{ uri: book.cover }}
                    style={styles.bookCover}
                  />
                  
                  {/* Book Info */}
                  <View style={styles.bookInfo}>
                    <View style={styles.headerRow}>
                      <Text style={styles.bookTitle} numberOfLines={2}>
                        {book.judul || book.title}
                      </Text>
                      <TouchableOpacity
                        onPress={() => toggleWishlist(book.id)}
                        style={styles.heartButton}
                      >
                        <Icon 
                          name={isWishlisted ? "heart" : "heart-outline"} 
                          size={22} 
                          color={isWishlisted ? "#FF4081" : "#666"} 
                        />
                      </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.bookAuthor} numberOfLines={1}>
                      {book.penulis || book.author}
                    </Text>
                    
                    <View style={styles.metaContainer}>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.ratingText}>
                          {book.rating || "4.5"}
                        </Text>
                      </View>
                      
                      <View style={[
                        styles.difficultyBadge,
                        book.difficulty === 'Mudah' && styles.easyBadge,
                        book.difficulty === 'Sedang' && styles.mediumBadge,
                        book.difficulty === 'Sulit' && styles.hardBadge,
                      ]}>
                        <Text style={styles.difficultyText}>
                          {book.difficulty || "Sedang"}
                        </Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity style={styles.borrowButton}>
                      <Text style={styles.borrowButtonText}>Pinjam Sekarang</Text>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </View>
            );
          })}
        </Animated.View>

        {/* Navigation Buttons */}
        <TouchableOpacity onPress={goPrev} style={[styles.navButton, styles.prevButton]}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={goNext} style={[styles.navButton, styles.nextButton]}>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Dots Indicator */}
      {renderDots()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  carouselContainer: {
    height: CARD_HEIGHT + 40,
    overflow: "visible",
  },
  carousel: {
    flexDirection: "row",
    height: CARD_HEIGHT,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: 10,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    flexDirection: "row",
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bookCover: {
    width: 90,
    height: 135,
    borderRadius: 10,
    marginRight: 12,
  },
  bookInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#003366",
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  heartButton: {
    padding: 4,
  },
  bookAuthor: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF9800",
    marginLeft: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  easyBadge: {
    backgroundColor: "#4CAF50",
  },
  mediumBadge: {
    backgroundColor: "#FF9800",
  },
  hardBadge: {
    backgroundColor: "#F44336",
  },
  difficultyText: {
    fontSize: 10,
    color: "white",
    fontWeight: "600",
  },
  borrowButton: {
    backgroundColor: "#4f86f7",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  borrowButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
  },
  navButton: {
    position: "absolute",
    top: CARD_HEIGHT / 2 - 20,
    backgroundColor: "rgba(0, 51, 102, 0.7)",
    borderRadius: 20,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  prevButton: {
    left: -10,
  },
  nextButton: {
    right: -10,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#4f86f7",
    width: 24,
  },
  inactiveDot: {
    backgroundColor: "#E0E0E0",
  },
});