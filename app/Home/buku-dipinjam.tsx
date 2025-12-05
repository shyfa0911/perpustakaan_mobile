// app/buku-dipinjam.tsx
import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from "react-native";
import { Text, Card, Button, Chip, Badge } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import storage from "../../src/utils/storage";

interface PeminjamanItem {
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
  status: string;
  denda: number;
}

export default function BukuDipinjam() {
  const router = useRouter();
  const [peminjamanList, setPeminjamanList] = useState<PeminjamanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load data dari AsyncStorage
  const loadPeminjaman = async () => {
    try {
      const data = await storage.getItem('peminjamanList');
      if (data) {
        const parsedData = JSON.parse(data);
        setPeminjamanList(parsedData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert("Error", "Gagal memuat data peminjaman");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPeminjaman();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadPeminjaman();
  };

  // Format tanggal
  const formatTanggal = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Hitung sisa hari
  const hitungSisaHari = (tanggalKembali: string) => {
    const now = new Date();
    const kembali = new Date(tanggalKembali);
    const diffTime = kembali.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Status warna
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'dipinjam': return '#2196F3'; // biru
      case 'dikembalikan': return '#4CAF50'; // hijau
      case 'terlambat': return '#F44336'; // merah
      default: return '#9E9E9E'; // abu
    }
  };

  // Status label
  const getStatusLabel = (status: string, tanggalKembali: string) => {
    if (status === 'terlambat') return 'Terlambat';
    if (status === 'dikembalikan') return 'Dikembalikan';

    const sisaHari = hitungSisaHari(tanggalKembali);
    if (sisaHari < 0) return 'Terlambat';
    if (sisaHari <= 2) return `Hampir Jatuh Tempo (${sisaHari} hari)`;
    return `Dipinjam (${sisaHari} hari lagi)`;
  };

  // Fungsi pengembalian buku
  const handleKembalikan = (id: number) => {
    Alert.alert(
      "Konfirmasi Pengembalian",
      "Apakah Anda yakin buku sudah dikembalikan?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Ya, Kembalikan",
          onPress: () => updateStatus(id, 'dikembalikan')
        },
      ]
    );
  };

  // Update status
  const updateStatus = async (id: number, newStatus: string) => {
    try {
      // Cari item yang akan dikembalikan
      const returnedItem = peminjamanList.find(item => item.id === id);

      if (newStatus === 'dikembalikan' && returnedItem) {
        // Hitung denda jika terlambat
        const tanggalKembali = new Date(returnedItem.tanggalKembali);
        const sekarang = new Date();
        const selisihHari = Math.ceil((sekarang.getTime() - tanggalKembali.getTime()) / (1000 * 60 * 60 * 24));
        const denda = selisihHari > 0 ? selisihHari * 2000 : 0;

        // Buat data untuk history
        const historyItem = {
          ...returnedItem,
          status: 'dikembalikan',
          denda: denda,
          tanggalPengembalianAktual: sekarang.toISOString(),
        };

        // Simpan ke history
        const existingHistory = await storage.getItem('historyList');
        const historyList = existingHistory ? JSON.parse(existingHistory) : [];
        historyList.push(historyItem);
        await storage.setItem('historyList', JSON.stringify(historyList));

        // Hapus dari peminjaman list
        const updatedList = peminjamanList.filter(item => item.id !== id);
        await storage.setItem('peminjamanList', JSON.stringify(updatedList));
        setPeminjamanList(updatedList);

        Alert.alert(
          "Sukses",
          `Buku "${returnedItem.buku.judul}" berhasil dikembalikan${denda > 0 ? ` dengan denda Rp ${denda.toLocaleString()}` : ''}`
        );
      } else {
        // Update status biasa
        const updatedList = peminjamanList.map(item => {
          if (item.id === id) {
            return { ...item, status: newStatus };
          }
          return item;
        });

        await storage.setItem('peminjamanList', JSON.stringify(updatedList));
        setPeminjamanList(updatedList);
        Alert.alert("Sukses", "Status buku berhasil diperbarui");
      }
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert("Error", "Gagal memperbarui status");
    }
  };

  // Hapus peminjaman
  const handleHapus = (id: number) => {
    Alert.alert(
      "Hapus Peminjaman",
      "Apakah Anda yakin ingin menghapus data peminjaman ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => hapusPeminjaman(id)
        },
      ]
    );
  };

  const hapusPeminjaman = async (id: number) => {
    try {
      const updatedList = peminjamanList.filter(item => item.id !== id);
      await AsyncStorage.setItem('peminjamanList', JSON.stringify(updatedList));
      setPeminjamanList(updatedList);
      Alert.alert("Sukses", "Data peminjaman berhasil dihapus");
    } catch (error) {
      Alert.alert("Error", "Gagal menghapus data");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Buku Dipinjam</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text>Memuat data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buku Dipinjam</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Statistik */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{peminjamanList.length}</Text>
                <Text style={styles.statLabel}>Total Dipinjam</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {peminjamanList.filter(item => hitungSisaHari(item.tanggalKembali) < 0).length}
                </Text>
                <Text style={styles.statLabel}>Terlambat</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Daftar Buku Dipinjam */}
        {peminjamanList.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <MaterialIcons name="book" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>Belum ada buku dipinjam</Text>
              <Text style={styles.emptyText}>
                Pinjam buku terlebih dahulu dari katalog
              </Text>
              <Button
                mode="contained"
                onPress={() => router.push("/")}
                style={styles.browseButton}
              >
                Jelajahi Buku
              </Button>
            </Card.Content>
          </Card>
        ) : (
          peminjamanList.map((item) => {
            const sisaHari = hitungSisaHari(item.tanggalKembali);
            const isTerlambat = sisaHari < 0;
            const isAlmostDue = sisaHari <= 2 && sisaHari >= 0;

            return (
              <Card key={item.id} style={styles.peminjamanCard}>
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <View style={styles.bookHeader}>
                      <Image
                        source={{ uri: item.buku.cover }}
                        style={styles.bookCover}
                      />
                      <View style={styles.bookHeaderInfo}>
                        <Text style={styles.bookTitle} numberOfLines={2}>
                          {item.buku.judul}
                        </Text>
                        <Text style={styles.bookAuthor}>{item.buku.penulis}</Text>
                      </View>
                    </View>

                    <TouchableOpacity onPress={() => handleHapus(item.id)}>
                      <MaterialIcons name="delete-outline" size={22} color="#F44336" />
                    </TouchableOpacity>
                  </View>

                  {/* Info Peminjam */}
                  <View style={styles.peminjamInfo}>
                    <MaterialIcons name="person" size={16} color="#666" />
                    <Text style={styles.peminjamText}>{item.peminjam.nama}</Text>
                    <Text style={styles.peminjamDetail}>({item.peminjam.nim})</Text>
                  </View>

                  {/* Tanggal */}
                  <View style={styles.dateContainer}>
                    <View style={styles.dateItem}>
                      <MaterialIcons name="calendar-today" size={14} color="#666" />
                      <Text style={styles.dateLabel}>Pinjam:</Text>
                      <Text style={styles.dateValue}>{formatTanggal(item.tanggalPinjam)}</Text>
                    </View>
                    <View style={styles.dateItem}>
                      <MaterialIcons name="event" size={14} color="#666" />
                      <Text style={styles.dateLabel}>Kembali:</Text>
                      <Text style={styles.dateValue}>{formatTanggal(item.tanggalKembali)}</Text>
                    </View>
                  </View>

                  {/* Status & Aksi */}
                  <View style={styles.actionContainer}>
                    <Chip
                      style={[
                        styles.statusChip,
                        { backgroundColor: getStatusColor(item.status) + '20' }
                      ]}
                      textStyle={{ color: getStatusColor(item.status) }}
                    >
                      {getStatusLabel(item.status, item.tanggalKembali)}
                    </Chip>

                    {item.status === 'dipinjam' && (
                      <Button
                        mode="contained"
                        compact
                        onPress={() => handleKembalikan(item.id)}
                        style={styles.kembaliButton}
                      >
                        Kembalikan
                      </Button>
                    )}
                  </View>

                  {/* Warning jika hampir jatuh tempo */}
                  {isAlmostDue && (
                    <View style={styles.warningContainer}>
                      <MaterialIcons name="warning" size={16} color="#FF9800" />
                      <Text style={styles.warningText}>
                        Jatuh tempo dalam {sisaHari} hari!
                      </Text>
                    </View>
                  )}

                  {/* Warning jika terlambat */}
                  {isTerlambat && (
                    <View style={styles.dangerContainer}>
                      <MaterialIcons name="error" size={16} color="#F44336" />
                      <Text style={styles.dangerText}>
                        Terlambat {Math.abs(sisaHari)} hari! Denda: Rp {Math.abs(sisaHari) * 2000}
                      </Text>
                    </View>
                  )}
                </Card.Content>
              </Card>
            );
          })
        )}

        {/* Spacer */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#1976d2",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    padding: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1976d2",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#eee",
  },
  emptyCard: {
    marginTop: 40,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    marginBottom: 24,
    textAlign: "center",
  },
  browseButton: {
    borderRadius: 8,
    paddingHorizontal: 24,
  },
  peminjamanCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bookHeader: {
    flexDirection: "row",
    flex: 1,
    marginRight: 12,
  },
  bookCover: {
    width: 50,
    height: 70,
    borderRadius: 6,
    marginRight: 12,
  },
  bookHeaderInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 13,
    color: "#666",
  },
  peminjamInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    padding: 8,
    borderRadius: 6,
  },
  peminjamText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 6,
    marginRight: 4,
  },
  peminjamDetail: {
    fontSize: 12,
    color: "#666",
  },
  dateContainer: {
    marginBottom: 12,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  dateLabel: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
    marginRight: 4,
    width: 60,
  },
  dateValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  statusChip: {
    height: 32,
  },
  kembaliButton: {
    height: 32,
    borderRadius: 6,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 10,
    backgroundColor: "#FFF3E0",
    borderRadius: 6,
  },
  warningText: {
    fontSize: 12,
    color: "#FF9800",
    marginLeft: 6,
    fontWeight: "500",
  },
  dangerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 10,
    backgroundColor: "#FFEBEE",
    borderRadius: 6,
  },
  dangerText: {
    fontSize: 12,
    color: "#F44336",
    marginLeft: 6,
    fontWeight: "500",
  },
});
