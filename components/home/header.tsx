import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router"; // IMPORT ROUTER
import { TextInput, TouchableOpacity, View } from "react-native";

type HeaderProps = {
  onMenuPress: () => void;
};

export default function Header({ onMenuPress }: HeaderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        gap: 10,
      }}
    >
      {/* BURGER */}
      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons name="menu" size={30} />
      </TouchableOpacity>

      {/* SEARCH */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
          borderRadius: 10,
          paddingHorizontal: 10,
          height: 40,
          justifyContent: "center",
        }}
      >
        <TextInput
          placeholder="Cari buku..."
          style={{ fontSize: 14 }}
          onFocus={() => router.push("/(tabs)/search")} // Ketika di-focus, langsung ke search
        />
      </View>

      {/* NOTIF */}
      <TouchableOpacity onPress={() => router.push("/notification")}>
        <Ionicons name="notifications-outline" size={30} />
      </TouchableOpacity>
    </View>
  );
}
