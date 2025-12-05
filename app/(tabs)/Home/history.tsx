// app/Home/history.tsx
import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import storage from "../../../src/utils/storage";

interface HistoryItem {
  id: number;
  buku: {
    id: number;
    judul: string;
    penulis: string;
    kategori: string;
    cover: string;
    isbn: string;
  };
  peminjam: {
    id: number;
    nama: string;
    nim: string;
    prodi: string;
    email: string;
    noHp: string;
  };
  tanggalPinjam: string;
  tanggalKembali: string;
  tanggalPengajuan: string;
  tanggalPengembalianAktual?: string;
  status: string;
  denda: number;
}

export default function HistoryScreen() {
  const router = useRouter();
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("semua");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load data dari AsyncStorage
  const loadHistory = async () => {
    try {
      const data = await storage.getItem('historyList');
      if (data) {
        const parsedData = JSON.parse(data);
        setHistoryList(parsedData);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  // Format tanggal
  const formatTanggal = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filter data
  const filteredData = historyList.filter((item) => {
    if (selectedFilter === "semua") return true;
    if (selectedFilter === "dikembalikan") return item.status === "dikembalikan";
    if (selectedFilter === "terlambat") return item.denda > 0;
    return true;
  });

  // Warna status
  const getStatusColor = (status: string, denda: number) => {
    if (denda > 0) return "#EF4444"; // merah untuk terlambat
    if (status === "dikembalikan") return "#10B981"; // hijau untuk selesai
    return "#6B7280"; // abu untuk lainnya
  };

  // Teks status
  const getStatusText = (denda: number) => {
    if (denda > 0) return "Terlambat";
    return "Selesai";
  };

  // Hitung apakah terlambat
  const isTerlambat = (tanggalKembali: string) => {
    const kembali = new Date(tanggalKembali);
    const now = new Date();
    return kembali < now;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.header}>
          <Text style={styles.title}>Riwayat Peminjaman</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text>Memuat riwayat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Riwayat Peminjaman</Text>
        <Text style={styles.user}>
          Total: {historyList.length} peminjaman
        </Text>
      </View>

      {/* Filter */}
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
            <Image source={{ uri: item.buku.cover }} style={styles.cover} />

            {/* Info buku */}
            <View style={styles.info}>
              <Text style={styles.bookTitle} numberOfLines={2}>
                {item.buku.judul}
              </Text>
              <Text style={styles.bookAuthor}>{item.buku.penulis}</Text>
              <Text style={styles.category}>{item.buku.kategori}</Text>

              <View style={styles.dateRow}>
                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>Pinjam</Text>
                  <Text style={styles.dateValue}>
                    {formatTanggal(item.tanggalPinjam)}
                  </Text>
                </View>

                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>Kembali</Text>
                  <Text style={styles.dateValue}>
                    {formatTanggal(item.tanggalKembali)}
                  </Text>
                </View>
              </View>

              <View style={styles.peminjamInfo}>
                <Text style={styles.peminjamLabel}>Peminjam:</Text>
                <Text style={styles.peminjamName}>{item.peminjam.nama}</Text>
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
                  { backgroundColor: getStatusColor(item.status, item.denda) },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(item.status, item.denda) },
                ]}
              >
                {getStatusText(item.denda)}
              </Text>
              
              {item.tanggalPengembalianAktual && (
                <Text style={styles.kembaliDate}>
                  Kembali: {formatTanggal(item.tanggalPengembalianAktual)}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="time-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Belum ada riwayat peminjaman</Text>
            <Text style={styles.emptySubtext}>
              Buku yang sudah dikembalikan akan muncul di sini
            </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    alignItems: "flex-start",
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
  bookAuthor: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: "#3B82F6",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
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
  peminjamInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  peminjamLabel: {
    fontSize: 12,
    color: "#888",
    marginRight: 4,
  },
  peminjamName: {
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
    width: 90,
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
    marginBottom: 4,
  },
  kembaliDate: {
    fontSize: 10,
    color: "#888",
    textAlign: "center",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    marginTop: 10,
    fontWeight: "500",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 5,
    textAlign: "center",
  },
});