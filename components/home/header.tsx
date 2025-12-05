import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { 
  TextInput, 
  TouchableOpacity, 
  View, 
  StyleSheet,
  Platform,
  Dimensions 
} from "react-native";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const isDesktop = width >= 1024;

type HeaderProps = {
  onMenuPress: () => void;
};

export default function Header({ onMenuPress }: HeaderProps) {
  return (
    <View style={styles.container}>
      {/* Burger Menu */}
      <TouchableOpacity 
        onPress={onMenuPress} 
        style={styles.iconButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons 
          name="menu" 
          size={isDesktop ? 32 : isTablet ? 30 : 28} 
          color="#003366"
        />
      </TouchableOpacity>

      {/* Search Bar */}
      <TouchableOpacity 
        style={styles.searchContainer}
        onPress={() => router.push("/(tabs)/search")}
        activeOpacity={0.8}
      >
        <View style={styles.searchInner}>
          <Ionicons 
            name="search" 
            size={isDesktop ? 20 : 18} 
            color="#666" 
            style={styles.searchIcon}
          />
          <View style={styles.searchInputWrapper}>
            <TextInput
              placeholder="Cari buku, penulis, atau kategori..."
              placeholderTextColor="#999"
              style={styles.searchInput}
              editable={false}
              onPressIn={() => router.push("/(tabs)/search")}
            />
          </View>
          {Platform.OS === 'web' && (
            <View style={styles.searchHint}>
              <Ionicons name="return-down-back" size={14} color="#999" />
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Notification */}
      <TouchableOpacity 
        onPress={() => router.push("/notification")}
        style={styles.iconButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={styles.notifContainer}>
          <Ionicons 
            name="notifications-outline" 
            size={isDesktop ? 32 : isTablet ? 30 : 28} 
            color="#003366"
          />
          <View style={styles.notifBadge}>
            <Ionicons name="ellipse" size={8} color="#FF4081" />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: isDesktop ? 24 : isTablet ? 20 : 16,
    paddingVertical: isDesktop ? 16 : isTablet ? 14 : 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    gap: isDesktop ? 16 : isTablet ? 14 : 12,
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: isDesktop ? 14 : isTablet ? 12 : 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      },
    }),
  },
  searchInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: isDesktop ? 16 : isTablet ? 14 : 12,
    height: isDesktop ? 48 : isTablet ? 44 : 40,
  },
  searchIcon: {
    marginRight: isDesktop ? 12 : isTablet ? 10 : 8,
  },
  searchInputWrapper: {
    flex: 1,
  },
  searchInput: {
    fontSize: isDesktop ? 16 : isTablet ? 15 : 14,
    color: "#333",
    padding: 0,
    height: "100%",
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  searchHint: {
    marginLeft: 8,
    opacity: 0.6,
  },
  notifContainer: {
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: isDesktop ? -2 : -4,
    right: isDesktop ? -2 : -4,
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 1,
  },
});