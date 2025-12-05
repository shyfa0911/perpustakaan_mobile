// app/(tabs)/index.tsx
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

const { width } = Dimensions.get("window");

export default function Favorite() {
  const data = booksJSON.books.slice(0, 5); // ambil 5 buku terpopuler
  const [index, setIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

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
          {data.map((book, i) => (
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
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 18,
                      color: "#003366",
                      marginBottom: 6,
                    }}
                    numberOfLines={2}
                  >
                    {book.judul}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#333" }}>
                    {book.penulis}
                  </Text>

                  <TouchableOpacity
                    style={{
                      marginTop: 10,
                      backgroundColor: "#4f86f7",
                      paddingVertical: 6,
                      paddingHorizontal: 12,
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
          ))}
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
