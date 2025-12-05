import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Modal,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");

const onboardingData = [
  {
    id: "1",
    title: "Temukan Buku Favoritmu",
    description: "Jelajahi koleksi ribuan buku dari berbagai genre dan penulis terbaik",
    icon: "book-search",
    color: "#4a90e2",
  },
  {
    id: "2",
    title: "Baca Dimana Saja",
    description: "Akses buku digital kapan saja dan di mana saja dengan mudah",
    icon: "cellphone",
    color: "#FF9800",
  },
  {
    id: "3",
    title: "Simpan ke Wishlist",
    description: "Kumpulkan buku favorit dalam wishlist untuk dibaca nanti",
    icon: "heart",
    color: "#E91E63",
  },
  {
    id: "4",
    title: "Mulai Membaca Sekarang",
    description: "Bergabung dengan komunitas pembaca dan mulai petualangan membaca",
    icon: "rocket-launch",
    color: "#4CAF50",
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      // Animasi fade out
      setIsTransitioning(true);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        flatListRef.current?.scrollToIndex({
          index: currentIndex + 1,
          animated: false,
        });
        setCurrentIndex(currentIndex + 1);
        
        // Animasi fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setIsTransitioning(false);
        });
      });
    } else {
      handleShowModal();
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
    Animated.parallel([
      Animated.timing(modalAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSkip = () => {
    handleShowModal();
  };

  const handleLogin = () => {
    router.replace("/(auth)/login");
  };

  const handleRegister = () => {
    router.replace("/(auth)/register");
  };

  const renderItem = ({ item }: { item: typeof onboardingData[0] }) => (
    <Animated.View style={[styles.slide, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={["#0d1b2a", "#1b263b"]}
        style={styles.gradientBackground}
      >
        {/* Icon Container */}
        <Animated.View 
          style={[
            styles.iconContainer, 
            { 
              backgroundColor: `${item.color}20`,
              transform: [{ scale: fadeAnim }]
            }
          ]}
        >
          <Icon name={item.icon} size={80} color={item.color} />
        </Animated.View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {onboardingData.map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.paginationDot,
            index === currentIndex && styles.paginationDotActive,
            {
              opacity: index === currentIndex ? 1 : 0.5,
            }
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1b2a" />
      
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Lewati</Text>
      </TouchableOpacity>

      {/* Onboarding Slides */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={!isTransitioning}
        onScroll={({ nativeEvent }) => {
          const index = Math.round(nativeEvent.contentOffset.x / width);
          if (index !== currentIndex && !isTransitioning) {
            setCurrentIndex(index);
          }
        }}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
      />

      {/* Pagination */}
      {renderPagination()}

      {/* Next/Get Started Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, currentIndex === onboardingData.length - 1 && styles.getStartedButton]}
          onPress={handleNext}
          activeOpacity={0.8}
          disabled={isTransitioning}
        >
          <LinearGradient
            colors={
              currentIndex === onboardingData.length - 1
                ? ["#4CAF50", "#8BC34A"]
                : ["#0467ED", "#2a9df4"]
            }
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>
                {currentIndex === onboardingData.length - 1 ? "Mulai Sekarang" : "Lanjut"}
              </Text>
              <Icon
                name={currentIndex === onboardingData.length - 1 ? "rocket" : "arrow-right"}
                size={20}
                color="white"
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Modal for Login/Register */}
      <Modal
        visible={showModal}
        transparent
        animationType="none"
        onRequestClose={() => setShowModal(false)}
      >
        <Animated.View 
          style={[
            styles.modalOverlay,
            {
              opacity: modalAnim,
            }
          ]}
        >
          <Animated.View 
            style={[
              styles.modalContent,
              {
                transform: [
                  { scale: scaleAnim },
                  {
                    translateY: modalAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              }
            ]}
          >
            <LinearGradient
              colors={["#1b263b", "#0d1b2a"]}
              style={styles.modalGradient}
            >
              {/* Decorative Icon */}
              <View style={styles.modalIconContainer}>
                <Icon name="book-open-variant" size={60} color="#4CAF50" />
              </View>

              {/* Modal Title */}
              <Text style={styles.modalTitle}>Selamat Datang!</Text>
              <Text style={styles.modalSubtitle}>
                Pilih untuk melanjutkan
              </Text>

              {/* Action Buttons */}
              <View style={styles.modalButtons}>
                {/* Register Button */}
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleRegister}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#4CAF50", "#8BC34A"]}
                    style={styles.modalButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Icon name="account-plus" size={24} color="white" />
                    <Text style={styles.modalButtonText}>Daftar</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleLogin}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#0467ED", "#2a9df4"]}
                    style={styles.modalButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Icon name="login" size={24} color="white" />
                    <Text style={styles.modalButtonText}>Masuk</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Close button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.closeButtonText}>Nanti Saja</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1b2a",
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  skipText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
  slide: {
    width,
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
  },
  contentContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 40,
  },
  description: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: "#4a90e2",
  },
  buttonContainer: {
    paddingHorizontal: 40,
    marginBottom: 50,
  },
  button: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#0467ED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  getStartedButton: {
    shadowColor: "#4CAF50",
  },
  buttonGradient: {
    paddingVertical: 18,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.85,
    borderRadius: 24,
    overflow: "hidden",
  },
  modalGradient: {
    padding: 30,
    alignItems: "center",
  },
  modalIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(76, 175, 80, 0.3)",
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 30,
    textAlign: "center",
  },
  modalButtons: {
    width: "100%",
    gap: 12,
  },
  modalButton: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
  },
  modalButtonGradient: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
  },
  closeButtonText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 16,
    fontWeight: "500",
  },
});