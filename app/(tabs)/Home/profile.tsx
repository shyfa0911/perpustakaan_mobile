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
  const [showPassword, setShowPassword] = useState(false);

  // DATA USER (yang bisa diubah: username, email, password)
  const [user, setUser] = useState({
    username: "shyfa felian",
    email: "shyfafelian700@gmail.com",
    password: "shyfa cantik",
    // Data yang tidak bisa diubah
    kelas: "11",
    jurusan: "RPL 5",
    nipd: "7837749927",
    role: "Siswa",
    totalPinjam: 12,
  });

  // STATE EDIT FORM (hanya untuk data yang bisa diubah)
  const [editForm, setEditForm] = useState({
    username: user.username,
    email: user.email,
    password: user.password,
  });

  const handleSave = () => {
    setUser({ ...user, ...editForm });
    setIsEditing(false);
  };

  const initials = user.username
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

              <Text style={styles.name}>{user.username}</Text>
              <Text style={styles.email}>{user.email}</Text>
              
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{user.role}</Text>
              </View>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="create-outline" size={18} color="white" />
                <Text style={styles.editText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            {/* INFO AKADEMIK */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="school-outline" size={18} color="#1976D2" /> Informasi Akademik
              </Text>
              
              <View style={styles.infoGrid}>
                <View style={styles.infoCard}>
                  <Ionicons name="people-outline" size={24} color="#1976D2" />
                  <Text style={styles.infoLabel}>Kelas</Text>
                  <Text style={styles.infoValue}>{user.kelas}</Text>
                </View>

                <View style={styles.infoCard}>
                  <Ionicons name="code-slash-outline" size={24} color="#1976D2" />
                  <Text style={styles.infoLabel}>Jurusan</Text>
                  <Text style={styles.infoValue}>{user.jurusan}</Text>
                </View>

                <View style={styles.infoCard}>
                  <Ionicons name="card-outline" size={24} color="#1976D2" />
                  <Text style={styles.infoLabel}>NIPD</Text>
                  <Text style={styles.infoValue}>{user.nipd}</Text>
                </View>

                <View style={styles.infoCard}>
                  <Ionicons name="book-outline" size={24} color="#1976D2" />
                  <Text style={styles.infoLabel}>Total Pinjam</Text>
                  <Text style={styles.infoValue}>{user.totalPinjam}</Text>
                </View>
              </View>
            </View>

            {/* INFORMASI AKUN */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="person-outline" size={18} color="#1976D2" /> Informasi Akun
              </Text>
              
              <View style={styles.accountInfo}>
                <View style={styles.accountItem}>
                  <View style={styles.accountLeft}>
                    <Ionicons name="person-circle-outline" size={20} color="#1976D2" />
                    <Text style={styles.accountLabel}>Username</Text>
                  </View>
                  <Text style={styles.accountValue}>{user.username}</Text>
                </View>

                <View style={styles.accountItem}>
                  <View style={styles.accountLeft}>
                    <Ionicons name="mail-outline" size={20} color="#1976D2" />
                    <Text style={styles.accountLabel}>Email</Text>
                  </View>
                  <Text style={styles.accountValue}>{user.email}</Text>
                </View>

                <View style={styles.accountItem}>
                  <View style={styles.accountLeft}>
                    <Ionicons name="lock-closed-outline" size={20} color="#1976D2" />
                    <Text style={styles.accountLabel}>Password</Text>
                  </View>
                  <Text style={styles.accountValue}>••••••••••</Text>
                </View>
              </View>
            </View>

            {/* REVIEW */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="chatbox-outline" size={18} color="#1976D2" /> Tulis Review Aplikasi
              </Text>

              <TextInput
                placeholder="Tulis pendapatmu tentang aplikasi perpustakaan ini..."
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
                  if (review.trim()) {
                    alert("Review terkirim!\n\n" + review);
                    setReview("");
                  } else {
                    alert("Mohon tulis review terlebih dahulu");
                  }
                }}
              >
                Kirim Review
              </Button>
            </View>

            {/* LOGOUT */}
            <TouchableOpacity style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ========== EDIT MODE ========== */}
        {isEditing && (
          <View style={styles.editBox}>
            <Text style={styles.editTitle}>Edit Profile</Text>
            <Text style={styles.editSubtitle}>Ubah informasi akun Anda</Text>

            {/* USERNAME */}
            <Text style={styles.label}>
              <Ionicons name="person-outline" size={14} /> Username
            </Text>
            <TextInput
              style={styles.editInput}
              value={editForm.username}
              onChangeText={(t) => setEditForm({ ...editForm, username: t })}
              placeholder="Masukkan username"
              placeholderTextColor="#7A8FA6"
            />

            {/* EMAIL */}
            <Text style={styles.label}>
              <Ionicons name="mail-outline" size={14} /> Email
            </Text>
            <TextInput
              style={styles.editInput}
              value={editForm.email}
              onChangeText={(t) => setEditForm({ ...editForm, email: t })}
              placeholder="Masukkan email"
              placeholderTextColor="#7A8FA6"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* PASSWORD */}
            <Text style={styles.label}>
              <Ionicons name="lock-closed-outline" size={14} /> Password
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={editForm.password}
                onChangeText={(t) => setEditForm({ ...editForm, password: t })}
                placeholder="Masukkan password"
                placeholderTextColor="#7A8FA6"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#1976D2"
                />
              </TouchableOpacity>
            </View>

            {/* INFO */}
            <View style={styles.editInfo}>
              <Ionicons name="information-circle-outline" size={16} color="#1976D2" />
              <Text style={styles.editInfoText}>
                Data NIPD, Kelas, dan Jurusan tidak dapat diubah
              </Text>
            </View>

            {/* BUTTON */}
            <View style={styles.editActions}>
              <Button
                onPress={() => {
                  setEditForm({
                    username: user.username,
                    email: user.email,
                    password: user.password,
                  });
                  setIsEditing(false);
                }}
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
    backgroundColor: "#F0F4F8",
    padding: 16,
  },

  /* ---------- HEADER ---------- */
  header: {
    alignItems: "center",
    marginVertical: 20,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  avatarInitial: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1976D2",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1976D2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
    color: "#0D1B2A",
  },

  email: {
    fontSize: 14,
    color: "#5A6C7D",
    marginTop: 4,
  },

  badge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },

  badgeText: {
    color: "#1976D2",
    fontWeight: "600",
    fontSize: 12,
  },

  editBtn: {
    marginTop: 12,
    backgroundColor: "#1976D2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  editText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },

  /* ---------- SECTION ---------- */
  section: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 16,
    color: "#0D1B2A",
    marginBottom: 16,
    fontWeight: "bold",
  },

  /* ---------- INFO GRID ---------- */
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  infoCard: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  infoLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 8,
    fontWeight: "500",
  },

  infoValue: {
    fontSize: 16,
    color: "#0D1B2A",
    fontWeight: "bold",
    marginTop: 4,
  },

  /* ---------- ACCOUNT INFO ---------- */
  accountInfo: {
    gap: 12,
  },

  accountItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  accountLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  accountLabel: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },

  accountValue: {
    fontSize: 14,
    color: "#0D1B2A",
    fontWeight: "600",
  },

  /* ---------- REVIEW ---------- */
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 12,
    height: 120,
    color: "#0D1B2A",
    textAlignVertical: "top",
    backgroundColor: "#F8FAFC",
  },

  sendBtn: {
    marginTop: 12,
    borderRadius: 12,
  },

  /* ---------- LOGOUT ---------- */
  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DC2626",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 20,
    gap: 8,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  logoutText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },

  /* ---------- EDIT MODE ---------- */
  editBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  editTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0D1B2A",
    textAlign: "center",
  },

  editSubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    color: "#0D1B2A",
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "600",
  },

  editInput: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 12,
    color: "#0D1B2A",
    backgroundColor: "#F8FAFC",
    fontSize: 14,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
  },

  passwordInput: {
    flex: 1,
    padding: 12,
    color: "#0D1B2A",
    fontSize: 14,
  },

  eyeIcon: {
    padding: 12,
  },

  editInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
    gap: 8,
  },

  editInfoText: {
    flex: 1,
    fontSize: 12,
    color: "#1976D2",
  },

  editActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },

  cancelBtn: {
    borderRadius: 12,
    flex: 1,
    borderColor: "#1976D2",
  },

  saveBtn: {
    borderRadius: 12,
    flex: 1,
  },
});