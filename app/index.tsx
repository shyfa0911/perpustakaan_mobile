import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from "react-native-reanimated";

export default function SplashScreen() {
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    scale.value = withTiming(1, {
      duration: 900,
      easing: Easing.out(Easing.ease),
    });

    opacity.value = withDelay(
      300,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) })
    );

    translateY.value = withDelay(
      300,
      withTiming(0, { duration: 800, easing: Easing.out(Easing.ease) })
    );

    const timer = setTimeout(() => {
      router.replace("/(auth)/Onboarding");
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
      <View style={styles.glow} />

      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image
          source={require("../assets/BookZone.png")}
          style={{ height: 55, width: 200, resizeMode: "contain" }}
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
    marginBottom: 20,
  },

  glow: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 200,
    backgroundColor: "#0467ED33",
    top: "38%",
  },

  textContainer: {
    alignItems: "center",
  },

  subtitle: {
    fontSize: 16,
    marginTop: 6,
    color: "#dbe2ef",
    fontStyle: "italic",
  },
});
