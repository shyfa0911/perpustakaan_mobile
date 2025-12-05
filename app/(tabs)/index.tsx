import Favorite from "@/components/books/favorite";
import Sidebar from "@/components/home/sidebar";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CardBuku from "../../components/books/cardBuku";
import booksJSON from "../../data.json";

export default function HomeScreen() {
  const [sidebar, setSidebar] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(booksJSON.books);

  // SEARCH FUNCTION
  const handleSearch = (text: string) => {
    setQuery(text);
    const res = booksJSON.books.filter((b) =>
      b.judul.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredBooks(res);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f6fb" }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          gap: 10,
          paddingVertical: 8,
          backgroundColor: "#fff",
        }}
      >
        <TouchableOpacity onPress={() => setSidebar(true)}>
          <Ionicons name="menu" size={30} />
        </TouchableOpacity>

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
            value={query}
            onChangeText={handleSearch}
            style={{ fontSize: 14 }}
          />
        </View>

        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={30} />
        </TouchableOpacity>
      </View>

      {/* SIDEBAR */}
      <Sidebar visible={sidebar} onClose={() => setSidebar(false)} />

      {/* MAIN CONTENT */}
      <ScrollView style={{ flex: 1, padding: 12 }}>
        {/* FAVORITE */}
        <Favorite />

        {/* GRID BUKU */}
        <View style={{ padding: 16 }}>
          <FlatList
            data={booksJSON.books}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <CardBuku item={item} />}
            getItemLayout={(data, index) => ({
              length: 220, // tinggi card + margin
              offset: 220 * index,
              index,
            })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
