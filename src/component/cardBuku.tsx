import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import booksJSON from "../../data.json";

export default function CardBuku() {
  const [booksData, setBooksData] = useState<any[]>([]);

  useEffect(() => {
    try {
      setBooksData(booksJSON.books);
    } catch (error) {
      console.log("Error loading books data");
    }
  }, []);

  const renderBook = ({ item }: { item: any }) => (
    <View style={{ flex: 1, margin: 8 }}>
      <Link href={{ pathname: "./detail", params: { id: item.id } }} asChild>
        <Card style={{ height: 220, backgroundColor: "#fff" }}>
          <Card.Content style={{ paddingTop: 8 }}>
            <Text
              variant="titleMedium"
              style={{
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 4,
              }}
            >
              {item.judul}
            </Text>
            <Text
              variant="bodySmall"
              style={{ textAlign: "center", color: "#666" }}
            >
              {item.penulis}
            </Text>
            <Text
              variant="bodySmall"
              style={{ textAlign: "center", color: "#666" }}
            >
              Rak: {item.id_rak}
            </Text>
          </Card.Content>
        </Card>
      </Link>
    </View>
  );

  return (
    <SafeAreaView>
      <FlatList
        data={booksData}
        renderItem={renderBook}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
