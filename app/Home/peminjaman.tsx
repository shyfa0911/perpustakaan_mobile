// app/peminjaman.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import storage from "../../src/utils/storage";

export default function Peminjaman() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Ambil data buku dari params
  const bookData = params.bookData ? JSON.parse(params.bookData as string) : null;
  
  // Data user dummy
  const dummyUsers = [
    { id: 1, nama: "Andi Wijaya", nim: "1234567890", prodi: "Teknik Informatika", email: "andi@email.com", noHp: "081234567890" },
    { id: 2, nama: "Budi Santoso", nim: "0987654321", prodi: "Sistem Informasi", email: "budi@email.com", noHp: "082345678901" },
    { id: 3, nama: "Citra Lestari", nim: "1122334455", prodi: "Manajemen", email: "citra@email.com", noHp: "083456789012" },
  ];
  
  // State form
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const selectedUser = dummyUsers[selectedUserIndex];

  // Fungsi untuk simpan data peminjaman
  const savePeminjaman = async (data: any) => {
    try {
      // Ambil data yang sudah ada
      const existingData = await AsyncStorage.getItem('peminjamanList');
      let peminjamanList = existingData ? JSON.parse(existingData) : [];
      
      // Tambah data baru
      peminjamanList.push(data);
      
      // Simpan kembali
      await AsyncStorage.setItem('peminjamanList', JSON.stringify(peminjamanList));
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    // Tampilkan modal konfirmasi
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
  setShowConfirmModal(false);
  setIsSubmitting(true);
  
  const tanggalPinjam = new Date();
  const tanggalKembali = new Date();
  tanggalKembali.setDate(tanggalKembali.getDate() + 7);
  
  // Data peminjaman
  const peminjamanData = {
    id: Date.now(),
    buku: {
      id: bookData?.id,
      judul: bookData?.judul,
      penulis: bookData?.penulis,
      kategori: bookData?.kategori,
      cover: bookData?.cover,
      isbn: bookData?.isbn,
    },
    peminjam: selectedUser,
    tanggalPinjam: tanggalPinjam.toISOString(),
    tanggalKembali: tanggalKembali.toISOString(),
    tanggalPengajuan: new Date().toISOString(),
    status: "dipinjam",
    denda: 0,
  };
  
  try {
    // Simpan ke AsyncStorage
    const saved = await savePeminjaman(peminjamanData);
    
    if (saved) {
      // TUNGGU SEBENTAR LALU REDIRECT LANGSUNG
      setTimeout(() => {
        setIsSubmitting(false);
        router.replace("/Home/buku-dipinjam"); // <- GANTI INI
      }, 500);
    } else {
      Alert.alert("❌ Gagal", "Gagal menyimpan data peminjaman");
      setIsSubmitting(false);
    }
  } catch (error) {
    Alert.alert("❌ Error", "Terjadi kesalahan saat menyimpan data");
    setIsSubmitting(false);
  }
};

  if (!bookData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Form Peminjaman</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text>Data buku tidak ditemukan</Text>
          <Button mode="contained" onPress={() => router.back()} style={styles.button}>
            Kembali
          </Button>
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
        <Text style={styles.headerTitle}>Form Peminjaman</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Buku */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Buku yang Dipinjam</Text>
            <View style={styles.bookInfo}>
              <View style={styles.bookText}>
                <Text style={styles.bookTitle}>{bookData.judul}</Text>
                <Text style={styles.bookAuthor}>Penulis: {bookData.penulis}</Text>
                <Text style={styles.bookCategory}>Kategori: {bookData.kategori}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Pilih User */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Pilih Peminjam</Text>
            <Text style={styles.sectionSubtitle}>Pilih data peminjam dari daftar:</Text>
            
            {dummyUsers.map((user, index) => (
              <TouchableOpacity
                key={user.id}
                style={[
                  styles.userOption,
                  selectedUserIndex === index && styles.userOptionSelected
                ]}
                onPress={() => setSelectedUserIndex(index)}
              >
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.nama}</Text>
                  <Text style={styles.userDetail}>NIM: {user.nim}</Text>
                  <Text style={styles.userDetail}>Prodi: {user.prodi}</Text>
                </View>
                {selectedUserIndex === index && (
                  <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                )}
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>

        {/* Detail Peminjaman */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Detail Peminjaman</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Durasi Pinjam:</Text>
              <Text style={styles.detailValue}>7 hari</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Batas Kembali:</Text>
              <Text style={styles.detailValue}>
                {new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString('id-ID')}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Peminjam:</Text>
              <Text style={styles.detailValue}>{selectedUser.nama}</Text>
            </View>
            
            <View style={styles.terms}>
              <Text style={styles.termsTitle}>Syarat & Ketentuan:</Text>
              <Text style={styles.termsText}>• Buku harus dikembalikan dalam kondisi baik</Text>
              <Text style={styles.termsText}>• Denda keterlambatan Rp 2.000/hari</Text>
              <Text style={styles.termsText}>• Tunjukkan KTM saat pengambilan buku</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Tombol */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Mengajukan..." : "Ajukan Peminjaman"}
        </Button>
        
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.cancelButton}
          disabled={isSubmitting}
        >
          Batal
        </Button>
      </ScrollView>

      {/* Modal Konfirmasi */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <MaterialIcons name="help-outline" size={32} color="#1976d2" />
              <Text style={styles.modalTitle}>Konfirmasi Peminjaman</Text>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Apakah Anda yakin ingin meminjam buku:
              </Text>
              
              <Text style={styles.modalBookTitle}>"{bookData.judul}"</Text>
              
              <View style={styles.modalDetail}>
                <View style={styles.modalDetailRow}>
                  <MaterialIcons name="person" size={18} color="#666" />
                  <Text style={styles.modalDetailLabel}>Peminjam:</Text>
                  <Text style={styles.modalDetailValue}>{selectedUser.nama}</Text>
                </View>
                
                <View style={styles.modalDetailRow}>
                  <MaterialIcons name="school" size={18} color="#666" />
                  <Text style={styles.modalDetailLabel}>NIM:</Text>
                  <Text style={styles.modalDetailValue}>{selectedUser.nim}</Text>
                </View>
                
                <View style={styles.modalDetailRow}>
                  <MaterialIcons name="calendar-today" size={18} color="#666" />
                  <Text style={styles.modalDetailLabel}>Batas Kembali:</Text>
                  <Text style={styles.modalDetailValue}>
                    {new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString('id-ID')}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.modalWarning}>
                Pastikan data di atas sudah benar sebelum mengajukan peminjaman.
              </Text>
            </View>
            
            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setShowConfirmModal(false)}
                style={styles.modalCancelButton}
              >
                Batal
              </Button>
              <Button
                mode="contained"
                onPress={confirmSubmit}
                style={styles.modalConfirmButton}
                loading={isSubmitting}
              >
                Ya, Ajukan Peminjaman
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5" 
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
    padding: 8 
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: { 
    flex: 1, 
    padding: 16 
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  bookInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookText: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  bookCategory: {
    fontSize: 14,
    color: "#1976d2",
    fontStyle: "italic",
  },
  userOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  userOptionSelected: {
    borderColor: "#4CAF50",
    backgroundColor: "#f0f9f0",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  userDetail: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  terms: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  termsText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  submitButton: { 
    marginTop: 8, 
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#1976d2",
  },
  cancelButton: { 
    marginTop: 12, 
    marginBottom: 24, 
    paddingVertical: 6,
    borderRadius: 8,
    borderColor: "#1976d2",
  },
  button: {
    marginTop: 20,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  modalHeader: {
    backgroundColor: '#f0f7ff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
    marginTop: 12,
    textAlign: 'center',
  },
  modalContent: {
    padding: 24,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalBookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  modalDetail: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalDetailLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginRight: 6,
    minWidth: 100,
  },
  modalDetailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  modalWarning: {
    fontSize: 14,
    color: '#FF9800',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    borderColor: '#1976d2',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#1976d2',
  },
});