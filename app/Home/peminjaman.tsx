// app/peminjaman.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Card,
  RadioButton,
  HelperText,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

export default function Peminjaman() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Ambil data buku dari params
  const bookData = params.bookData ? JSON.parse(params.bookData as string) : null;
  
  // Data user dummy
  const dummyUsers = [
    { nama: "Andi Wijaya", nim: "1234567890", prodi: "Teknik Informatika", email: "andi@email.com", noHp: "081234567890" },
    { nama: "Budi Santoso", nim: "0987654321", prodi: "Sistem Informasi", email: "budi@email.com", noHp: "082345678901" },
    { nama: "Citra Lestari", nim: "1122334455", prodi: "Manajemen", email: "citra@email.com", noHp: "083456789012" },
  ];
  
  // State form - Default pilih user pertama
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [tanggalPinjam, setTanggalPinjam] = useState(new Date().toLocaleDateString('id-ID'));
  const [tanggalKembali, setTanggalKembali] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toLocaleDateString('id-ID');
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // User yang dipilih
  const selectedUser = dummyUsers[selectedUserIndex];

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Data yang akan disubmit
    const submissionData = {
      buku: {
        id: bookData?.id,
        judul: bookData?.judul,
        penulis: bookData?.penulis,
        kategori: bookData?.kategori,
      },
      peminjam: selectedUser,
      tanggalPinjam,
      tanggalKembali,
      tanggalPengajuan: new Date().toLocaleDateString('id-ID'),
      status: "pending"
    };
    
    console.log("Data peminjaman:", submissionData);
    
    // Simulasi submit
    setTimeout(() => {
      Alert.alert(
        "Sukses!", 
        `Peminjaman buku "${bookData?.judul}" berhasil diajukan oleh ${selectedUser.nama}`,
        [{ 
          text: "OK", 
          onPress: () => router.back() 
        }]
      );
      setIsSubmitting(false);
    }, 1500);
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
                key={index}
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
                  <Text style={styles.userDetail}>Email: {user.email}</Text>
                  <Text style={styles.userDetail}>HP: {user.noHp}</Text>
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
              <Text style={styles.detailLabel}>Tanggal Pinjam:</Text>
              <Text style={styles.detailValue}>{tanggalPinjam}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tanggal Kembali:</Text>
              <Text style={styles.detailValue}>{tanggalKembali}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Durasi:</Text>
              <Text style={styles.detailValue}>7 hari</Text>
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
});