import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import booksJSON from "@/data.json";

export default function Detail() {
  const params = useLocalSearchParams();
  const bookId = params?.id;
  const book =
    booksJSON.books.find((b) => b.id === Number(bookId)) || booksJSON.books[0];

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <View style={{ padding: 16 }}>
        <IconButton
          icon="arrow-left"
          size={24}
          style={{ marginBottom: 16 }}
          onPress={() => router.back()}
        />

        <Card style={{ padding: 16, borderRadius: 16 }}>
          <Card.Content>
            <Text
              variant="headlineMedium"
              style={{
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              {book.judul}
            </Text>
            <Text style={{ textAlign: "center", marginBottom: 8 }}>
              Penulis: {book.penulis}
            </Text>
            <Text style={{ textAlign: "center", marginBottom: 8 }}>
              Rak: {book.id_rak}
            </Text>
            <Text
              style={{ fontWeight: "bold", marginTop: 16, marginBottom: 8 }}
            >
              Deskripsi:
            </Text>
            <Text>{book.sinopsis}</Text>

            <Text
              style={{ fontWeight: "bold", marginTop: 16, marginBottom: 8 }}
            >
              Jumlah Halaman:
            </Text>
            <Text>{book.jumlah_halaman} halaman</Text>

            <Text
              style={{ fontWeight: "bold", marginTop: 16, marginBottom: 8 }}
            >
              Tahun Terbit:
            </Text>
            <Text>{book.tahun_terbit}</Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}
