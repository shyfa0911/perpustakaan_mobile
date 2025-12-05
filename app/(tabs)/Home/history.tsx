import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Data peminjaman (simplified)
const historyData = [
  {
    id: "1",
    judul: "Bumi Manusia",
    cover:
      "https://image.gramedia.net/rs:fit:0:0/plain/https://cdn.gramedia.com/uploads/items/bumi-manusia-edit.jpg",
    kategori: "novel",
    tanggalPinjam: "15 Jan 2024",
    tanggalKembali: "22 Jan 2024",
    status: "dikembalikan",
    denda: 0,
  },
  {
    id: "2",
    judul: "Cantik Itu Luka",
    cover:
      "https://image.gramedia.net/rs:fit:0:0/plain/https://cdn.gramedia.com/uploads/items/9786020366517_Cantik-Itu-Luka-Hard-Cover---Limited-Edition.jpg",
    kategori: "novel",
    tanggalPinjam: "20 Jan 2024",
    tanggalKembali: "27 Jan 2024",
    status: "dipinjam",
    denda: 0,
  },
  {
    id: "3",
    judul: "Bahasa Indonesia SMA Kelas X",
    cover:
      "https://static.buku.kemdikbud.go.id/content/image/coverteks/coverkurikulum21/Bahasa_Indonesia_BS_KLS_X_Rev_Cover.png",
    kategori: "Buku Paket",
    tanggalPinjam: "10 Jan 2024",
    tanggalKembali: "17 Jan 2024",
    status: "terlambat",
    denda: 5000,
  },
];

export default function HistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState("semua");

  // Filter data
  const filteredData = historyData.filter((item) => {
    if (selectedFilter === "semua") return true;
    return item.status === selectedFilter;
  });

  // Warna status
  const getStatusColor = (status: string) => {
    if (status === "dipinjam") return "#3B82F6";
    if (status === "dikembalikan") return "#10B981";
    if (status === "terlambat") return "#EF4444";
    return "#6B7280";
  };

  // Teks status
  const getStatusText = (status: string) => {
    if (status === "dipinjam") return "Dipinjam";
    if (status === "dikembalikan") return "Selesai";
    if (status === "terlambat") return "Terlambat";
    return status;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Riwayat Peminjaman</Text>
      </View>

      {/* Filter - SANGAT SIMPLE */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            selectedFilter === "semua" && styles.filterBtnActive,
          ]}
          onPress={() => setSelectedFilter("semua")}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === "semua" && styles.filterTextActive,
            ]}
          >
            Semua
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterBtn,
            selectedFilter === "dipinjam" && styles.filterBtnActive,
          ]}
          onPress={() => setSelectedFilter("dipinjam")}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === "dipinjam" && styles.filterTextActive,
            ]}
          >
            Dipinjam
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterBtn,
            selectedFilter === "dikembalikan" && styles.filterBtnActive,
          ]}
          onPress={() => setSelectedFilter("dikembalikan")}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === "dikembalikan" && styles.filterTextActive,
            ]}
          >
            Selesai
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterBtn,
            selectedFilter === "terlambat" && styles.filterBtnActive,
          ]}
          onPress={() => setSelectedFilter("terlambat")}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === "terlambat" && styles.filterTextActive,
            ]}
          >
            Terlambat
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            {/* Cover buku */}
            <Image source={{ uri: item.cover }} style={styles.cover} />

            {/* Info buku */}
            <View style={styles.info}>
              <Text style={styles.bookTitle}>{item.judul}</Text>
              <Text style={styles.category}>{item.kategori}</Text>

              <View style={styles.dateRow}>
                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>Pinjam</Text>
                  <Text style={styles.dateValue}>{item.tanggalPinjam}</Text>
                </View>

                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>Kembali</Text>
                  <Text style={styles.dateValue}>{item.tanggalKembali}</Text>
                </View>
              </View>

              {item.denda > 0 && (
                <Text style={styles.denda}>
                  Denda: Rp {item.denda.toLocaleString()}
                </Text>
              )}
            </View>

            {/* Status */}
            <View style={styles.statusBox}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(item.status) },
                ]}
              >
                {getStatusText(item.status)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="time-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Belum ada riwayat</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  user: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },
  filterBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
  },
  filterBtnActive: {
    backgroundColor: "#3B82F6",
  },
  filterText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#fff",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cover: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 8,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dateLabel: {
    fontSize: 12,
    color: "#888",
  },
  dateValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  denda: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "600",
  },
  statusBox: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    marginTop: 10,
  },
});
