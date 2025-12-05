import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const [review, setReview] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // DATA DUMMY
  const [user, setUser] = useState({
    name: "Shyfa Felia",
    email: "shyfa@example.com",
    totalPinjam: 12,
  });

  // STATE EDIT FORM
  const [editForm, setEditForm] = useState(user);

  const handleSave = () => {
    setUser(editForm);
    setIsEditing(false);
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ========== VIEW MODE ========== */}
        {!isEditing && (
          <>
            {/* HEADER */}
            <View style={styles.header}>
              <View style={styles.avatarInitial}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>

              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="create-outline" size={18} color="white" />
                <Text style={styles.editText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            {/* INFO */}
            <View style={styles.infoBox}>
              <View style={styles.infoItem}>
                <Ionicons name="book-outline" size={22} color="#1976D2" />
                <Text style={styles.infoText}>
                  Total Peminjaman: {user.totalPinjam}
                </Text>
              </View>
            </View>

            {/* REVIEW */}
            <View style={styles.reviewBox}>
              <Text style={styles.sectionTitle}>Tulis Review Aplikasi</Text>

              <TextInput
                placeholder="Tulis pendapatmu di sini..."
                placeholderTextColor="#7A8FA6"
                multiline
                style={styles.input}
                value={review}
                onChangeText={setReview}
              />

              <Button
                mode="contained"
                style={styles.sendBtn}
                buttonColor="#1976D2"
                onPress={() => {
                  alert("Review terkirim!\n\n" + review);
                  setReview("");
                }}
              >
                Kirim Review
              </Button>
            </View>

            {/* LOGOUT */}
            <TouchableOpacity style={styles.logoutBtn}>
              <Ionicons name="log-out" size={20} color="white" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ========== EDIT MODE ========== */}
        {isEditing && (
          <View style={styles.editBox}>
            <Text style={styles.editTitle}>Edit Profile</Text>

            {/* NAMA */}
            <Text style={styles.label}>Nama</Text>
            <TextInput
              style={styles.editInput}
              value={editForm.name}
              onChangeText={(t) => setEditForm({ ...editForm, name: t })}
              placeholder="Nama lengkap"
              placeholderTextColor="#7A8FA6"
            />

            {/* EMAIL */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.editInput}
              value={editForm.email}
              onChangeText={(t) => setEditForm({ ...editForm, email: t })}
              placeholder="Email"
              placeholderTextColor="#7A8FA6"
            />

            {/* BUTTON */}
            <View style={styles.editActions}>
              <Button
                onPress={() => setIsEditing(false)}
                mode="outlined"
                textColor="#1976D2"
                style={styles.cancelBtn}
              >
                Batal
              </Button>

              <Button
                onPress={handleSave}
                mode="contained"
                buttonColor="#1976D2"
                style={styles.saveBtn}
              >
                Simpan
              </Button>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9F2FF", // Biru pastel lembut
    padding: 20,
  },

  /* ---------- HEADER ---------- */
  header: {
    alignItems: "center",
    marginVertical: 20,
  },

  avatarInitial: {
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: "#1976D2",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    color: "#0D1B2A",
  },

  email: {
    fontSize: 14,
    color: "#0D1B2A",
    opacity: 0.6,
  },

  editBtn: {
    marginTop: 12,
    backgroundColor: "#1976D2",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  editText: {
    color: "white",
    fontWeight: "bold",
  },

  /* ---------- INFO ---------- */
  infoBox: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginVertical: 15,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  infoText: {
    color: "#0D1B2A",
    fontSize: 16,
  },

  /* ---------- REVIEW ---------- */
  reviewBox: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
  },

  sectionTitle: {
    fontSize: 16,
    color: "#0D1B2A",
    marginBottom: 10,
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    borderColor: "#1976D2",
    borderRadius: 10,
    padding: 12,
    height: 100,
    color: "#0D1B2A",
    textAlignVertical: "top",
  },

  sendBtn: {
    marginTop: 15,
    borderRadius: 10,
  },

  /* ---------- LOGOUT ---------- */
  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E53935",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    gap: 8,
  },

  logoutText: {
    color: "white",
    fontWeight: "bold",
  },

  /* ---------- EDIT MODE ---------- */
  editBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
  },

  editTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0D1B2A",
    marginBottom: 15,
    textAlign: "center",
  },

  label: {
    fontSize: 14,
    color: "#0D1B2A",
    marginTop: 10,
    marginBottom: 5,
  },

  editInput: {
    borderWidth: 1,
    borderColor: "#1976D2",
    borderRadius: 10,
    padding: 10,
    color: "#0D1B2A",
  },

  editActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  cancelBtn: {
    borderRadius: 10,
    width: "45%",
    borderColor: "#1976D2",
  },

  saveBtn: {
    borderRadius: 10,
    width: "45%",
  },
});
