import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

export default function SplashScreen() {
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 900, easing: (t) => t });
    opacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    translateY.value = withDelay(300, withTiming(0, { duration: 800 }));

    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <LinearGradient colors={["#0d1b2a", "#0d1b2a"]} style={styles.container}>
      {/* Glow belakang logo */}
      <View style={styles.glow} />

      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image
          source={require("../assets/BookZone.png")}
          style={{ height: 55 }}
        />
      </Animated.View>

      <Animated.View style={[styles.textContainer, textStyle]}>
        <Text style={styles.subtitle}>Explore your knowledge.</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0d1b2a",
  },

  logoContainer: {
    marginBottom: 15,
  },

  glow: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 200,
    backgroundColor: "#0467ED55",
    top: "35%",
    filter: "blur(40px)",
  },

  textContainer: {
    alignItems: "center",
  },

  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: "white",
    marginTop: 8,
  },

  subtitle: {
    fontSize: 16,
    marginTop: 6,
    color: "#dbe2ef",
    fontStyle: "italic",
  },
});
