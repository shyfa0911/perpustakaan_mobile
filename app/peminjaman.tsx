import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import booksJSON from "../data.json";

type Props = {
  bookId: number;
  onClose: () => void;
};

export default function BorrowBook({ bookId, onClose }: Props) {
  const book = booksJSON.books.find((b) => b.id === bookId);
  const [name, setName] = useState("");
  const [kelas, setKelas] = useState("");
  const [nipd, setNipd] = useState("");

  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
  const [borrowDate] = useState(today);

  const [returnDate, setReturnDate] = useState("");
  const [pickerVisible, setPickerVisible] = useState(false);

  const handleBorrow = async () => {
    if (!name || !kelas || !nipd || !returnDate) {
      alert("✨ Ups! Semua field wajib diisi dulu yaa!");
      return;
    }

    const newHistory = {
      id: Date.now(),
      bookTitle: book?.judul,
      name,
      kelas,
      nipd,
      borrowDate,
      returnDate,
    };

    const existing = await AsyncStorage.getItem("history");
    const arr = existing ? JSON.parse(existing) : [];

    arr.push(newHistory);

    await AsyncStorage.setItem("history", JSON.stringify(arr));

    alert("📚✨ Yeay! Peminjaman berhasil! Lihat di menu History yaa 💙");
    onClose();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>📖 Form Peminjaman</Text>

        <Text style={styles.label}>Judul Buku</Text>
        <Text style={styles.bookTitle}>{book?.judul}</Text>

        <Text style={styles.label}>Nama Peminjam</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nama"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Kelas</Text>
        <TextInput
          style={styles.input}
          placeholder="10 IPA 2"
          value={kelas}
          onChangeText={setKelas}
        />

        <Text style={styles.label}>NIPD</Text>
        <TextInput
          style={styles.input}
          placeholder="12345678"
          keyboardType="numeric"
          value={nipd}
          onChangeText={setNipd}
        />

        <Text style={styles.label}>Tanggal Pinjam</Text>
        <Text style={styles.fixedDate}>{borrowDate}</Text>

        <Text style={styles.label}>Tanggal Kembali</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setPickerVisible(true)}
        >
          <Text>{returnDate || "Pilih tanggal kembali"}</Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={pickerVisible}
          mode="date"
          onConfirm={(date) => {
            setReturnDate(date.toISOString().split("T")[0]);
            setPickerVisible(false);
          }}
          onCancel={() => setPickerVisible(false)}
        />

        <TouchableOpacity style={styles.btnBorrow} onPress={handleBorrow}>
          <Text style={styles.btnText}>Konfirmasi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "center",
  },

  card: {
    padding: 24,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    backdropFilter: "blur(12px)",
  },

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 24,
    textAlign: "center",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e4e4e4",
    marginBottom: 6,
  },

  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#8ab4ff",
  },

  input: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginBottom: 16,
  },

  fixedDate: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginBottom: 16,
    color: "#fff",
  },

  btnBorrow: {
    backgroundColor: "#4f86f7",
    paddingVertical: 14,
    borderRadius: 26,
    alignItems: "center",
    marginTop: 6,
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
