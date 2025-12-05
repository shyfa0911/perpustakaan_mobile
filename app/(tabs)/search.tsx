import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import CardBuku from "../../components/books/cardBuku";
import booksJSON from "../../data.json";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setBooks(booksJSON.books);
  }, []);

  // === AKAN JALAN HANYA KALAU USER TEKAN TOMBOL SEARCH ===
  const performSearch = () => {
    if (!query.trim()) return;

    const result = books.filter((b) =>
      b.judul.toLowerCase().includes(query.toLowerCase())
    );

    setFiltered(result);

    // Simpan history sekali (bukan per huruf)
    if (!history.includes(query)) {
      setHistory((prev) => [query, ...prev]); // taruh paling atas
    }
  };

  // Ketika history di tap
  const useHistoryItem = (text: string) => {
    setQuery(text);
    const result = books.filter((b) =>
      b.judul.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(result);
  };

  return (
    <View style={styles.container}>
      {/* SEARCH BAR */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={22} color="#003366" />

        <TextInput
          style={styles.input}
          placeholder="Cari buku..."
          value={query}
          onChangeText={setQuery} // perbaikan: tidak langsung search
          onSubmitEditing={performSearch} // tekan enter
        />

        {/* BUTTON SEARCH */}
        <TouchableOpacity onPress={performSearch}>
          <Ionicons name="arrow-forward-circle" size={28} color="#003366" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HISTORY */}
        {query === "" && history.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.historyTitle}>Riwayat Pencarian</Text>

            {history.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.historyItem}
                onPress={() => useHistoryItem(item)}
              >
                <Ionicons name="time-outline" size={18} color="#003366" />
                <Text style={styles.historyText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* HASIL PENCARIAN */}
        {query !== "" && (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              marginTop: 6,
            }}
          >
            {filtered.map((item, i) => (
              <CardBuku key={i} item={item} />
            ))}

            {filtered.length === 0 && (
              <Text
                style={{ textAlign: "center", marginTop: 20, opacity: 0.7 }}
              >
                Buku tidak ditemukan.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f6fb",
    padding: 12,
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    elevation: 3,
    marginBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },

  historyTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#003366",
    marginBottom: 4,
  },
  historyItem: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  historyText: {
    fontSize: 15,
  },
});
