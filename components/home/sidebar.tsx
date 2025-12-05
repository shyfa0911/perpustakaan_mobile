import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { BlurView } from "expo-blur";

type SidebarProps = {
  visible: boolean;
  onClose: () => void;
};

export default function Sidebar({ visible, onClose }: SidebarProps) {
  if (!visible) return null;

  return (
    <Pressable
      onPress={onClose}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 50,
        backgroundColor: "rgba(0,0,0,0.3)",
        flexDirection: "row",
      }}
    >
      {/* STOP klik di panel supaya TIDAK nutup */}
      <Pressable
        onPress={(e) => e.stopPropagation()}
        style={{
          width: "70%",
          height: "100%",
        }}
      >
        <BlurView
          intensity={70}
          tint="light"
          style={{
            flex: 1,
            backgroundColor: "rgba(30, 80, 200, 0.35)",
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 26,
              fontWeight: "bold",
              marginBottom: 20,
              color: "white",
            }}
          >
            Menu
          </Text>

          {[
            "Home",
            "Peminjaman",
            "Wishlist",
            "Kategori",
            "Pengaturan",
            "Tentang",
            "Logout",
          ].map((item) => (
            <TouchableOpacity key={item} style={{ marginVertical: 12 }}>
              <Text style={{ fontSize: 18, color: "#fff" }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </BlurView>
      </Pressable>
    </Pressable>
  );
}
