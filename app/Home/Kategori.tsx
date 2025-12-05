import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CardBuku from "@/components/books/cardBuku";
import booksData from "@/data.json";

const categories = [
  { id: "all", name: "Semua", icon: "book-multiple", color: "#4a90e2" },
  { id: "novel", name: "Novel", icon: "book-open-page-variant", color: "#9b59b6" },
  { id: "non-fiksi", name: "Non-Fiksi", icon: "book-education", color: "#e74c3c" },
  { id: "buku paket", name: "Buku Paket", icon: "book-open", color: "#2196f3" },
];

export default function KategoriScreen() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredBooks, setFilteredBooks] = useState(booksData.books);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredBooks(booksData.books);
    } else {
      const filtered = booksData.books.filter(
        (book) => book.kategori.toLowerCase() === selectedCategory.toLowerCase()
      );
      setFilteredBooks(filtered);
    }
  }, [selectedCategory]);

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => {
    const isSelected = selectedCategory === item.id;
    
    return (
      <TouchableOpacity
        onPress={() => setSelectedCategory(item.id)}
        activeOpacity={0.7}
        style={styles.categoryItem}
      >
        <LinearGradient
          colors={
            isSelected
              ? [item.color, `${item.color}dd`]
              : ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.categoryGradient,
            isSelected && { borderWidth: 2, borderColor: item.color },
          ]}
        >
          <Icon
            name={item.icon}
            size={24}
            color={isSelected ? "white" : "rgba(255,255,255,0.7)"}
          />
          <Text
            style={[
              styles.categoryText,
              isSelected && styles.categoryTextActive,
            ]}
          >
            {item.name}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1b2a" />
      
      <LinearGradient
        colors={["#0d1b2a", "#1b263b", "#0d1b2a"]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Kategori</Text>
        </View>

        {/* Category Filter */}
        <View style={styles.categorySection}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {/* Books Grid */}
        <FlatList
          data={filteredBooks}
          renderItem={({ item }) => <CardBuku item={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.booksList}
          showsVerticalScrollIndicator={false}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1b2a",
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryItem: {
    marginRight: 8,
  },
  categoryGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    minWidth: 100,
  },
  categoryText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "white",
    fontWeight: "bold",
  },
  booksList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
});