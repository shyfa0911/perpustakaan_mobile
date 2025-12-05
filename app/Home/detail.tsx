import { useLocalSearchParams, useRouter } from "expo-router"; // import useRouter
import {
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Card, Text, Chip, Button } from "react-native-paper";
import booksJSON from "../../data.json";
import { MaterialIcons } from "@expo/vector-icons";

export default function Detail() {
  const params = useLocalSearchParams();
  const router = useRouter(); // <- gunakan router
  const bookId = Number(params.id);

  const book = booksJSON.books.find((b) => b.id === bookId);

  if (!book) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Buku tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Arrow Back Kecil */}
      <TouchableOpacity
        style={styles.arrowBackSmall}
        onPress={() => router.back()} // <- pakai router.back()
      >
        <MaterialIcons name="arrow-back" size={28} />
      </TouchableOpacity>

      <ScrollView style={{ flex: 1, backgroundColor: "#fafafa" }}>
        {/* COVER BESAR */}
        <Image
          source={{ uri: book.cover }}
          style={{ width: "100%", height: 320, resizeMode: "cover" }}
        />

        <View style={{ padding: 20 }}>
          {/* Judul */}
          <Text
            variant="headlineMedium"
            style={{ fontWeight: "bold", marginBottom: 6 }}
          >
            {book.judul}
          </Text>

          {/* Penulis */}
          <Text
            variant="titleSmall"
            style={{ color: "#666", marginBottom: 10 }}
          >
            {book.penulis}
          </Text>

          {/* Chip kategori */}
          <Chip
            style={{ alignSelf: "flex-start", backgroundColor: "#eaeaea" }}
            textStyle={{ textTransform: "capitalize" }}
          >
            {book.kategori}
          </Chip>

          {/* Card Informasi Buku */}
          <Card style={{ marginTop: 20, borderRadius: 16 }}>
            <Card.Content>
              <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                Informasi Buku
              </Text>
              <Text style={{ marginTop: 8 }}>
                <Text style={{ fontWeight: "bold" }}>ISBN:</Text> {book.isbn}
              </Text>
              <Text>
                <Text style={{ fontWeight: "bold" }}>Penerbit:</Text>{" "}
                {book.penerbit}
              </Text>
              <Text>
                <Text style={{ fontWeight: "bold" }}>Jumlah Halaman:</Text>{" "}
                {book.jumlah_halaman}
              </Text>
              <Text>
                <Text style={{ fontWeight: "bold" }}>Tahun Terbit:</Text>{" "}
                {book.tahun_terbit}
              </Text>
              <Text>
                <Text style={{ fontWeight: "bold" }}>Rak:</Text> {book.id_rak}
              </Text>
            </Card.Content>
          </Card>

          {/* SINOPSIS */}
          <Text
            variant="titleMedium"
            style={{ marginTop: 20, fontWeight: "bold" }}
          >
            Sinopsis
          </Text>
          <Text style={{ marginTop: 10, color: "#555", lineHeight: 22 }}>
            {book.sinopsis}
          </Text>

          {/* BUTTON PINJAM */}
          <Button
            mode="contained"
            onPress={() => router.push(`/Home/peminjaman?bookData=${encodeURIComponent(JSON.stringify(book))}`)}
            style={{ marginTop: 30, borderRadius: 12, paddingVertical: 5 }}
          >
            Pinjam Buku
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  arrowBackSmall: {
    position: "absolute",
    top: 40,
    left: 16,
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
