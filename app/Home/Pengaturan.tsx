// app/settings.tsx
import { useState } from "react";
import {
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Text, Card, Divider, Button } from "react-native-paper";
import { 
  MaterialIcons, 
  Ionicons, 
  Feather,
  MaterialCommunityIcons 
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;
const isDesktop = width >= 1024;

export default function Settings() {
  const router = useRouter();
  
  // State untuk toggle
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Konfirmasi Logout",
      "Apakah Anda yakin ingin keluar dari aplikasi?",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            // Clear user data dari AsyncStorage
            try {
              await AsyncStorage.multiRemove(['userToken', 'userData', 'wishlist']);
              router.replace("/(auth)/login");
            } catch (error) {
              console.error("Error clearing storage:", error);
              router.replace("/(auth)/login");
            }
          }
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      "Bersihkan Cache",
      "Cache akan dihapus. Aplikasi mungkin perlu restart.",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Bersihkan", 
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert(
                "Berhasil",
                "Cache berhasil dibersihkan",
                [{ text: "OK", onPress: () => router.replace("/") }]
              );
            } catch (error) {
              Alert.alert("Error", "Gagal membersihkan cache");
            }
          }
        },
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Hapus Riwayat",
      "Semua riwayat peminjaman akan dihapus permanen.",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Hapus", 
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('historyList');
              Alert.alert("Berhasil", "Riwayat berhasil dihapus");
            } catch (error) {
              Alert.alert("Error", "Gagal menghapus riwayat");
            }
          }
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showSwitch = false, 
    switchValue = false,
    onSwitchChange,
    danger = false
  }: any) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, danger && styles.dangerIcon]}>
          {icon}
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, danger && styles.dangerText]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: "#D1D5DB", true: "#10B981" }}
          thumbColor="#fff"
        />
      ) : (
        <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengaturan</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <View style={styles.avatar}>
              <MaterialIcons name="person" size={40} color="#fff" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Admin Perpustakaan</Text>
              <Text style={styles.profileEmail}>admin@perpustakaan.com</Text>
              <Text style={styles.profileRole}>Administrator</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Settings Sections */}
        
        {/* Notifikasi */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="notifications" size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Notifikasi</Text>
            </View>
            <Divider style={styles.divider} />
            
            <SettingItem
              icon={<Ionicons name="notifications-outline" size={22} color="#3B82F6" />}
              title="Notifikasi Peminjaman"
              subtitle="Notifikasi jatuh tempo pengembalian"
              showSwitch={true}
              switchValue={notificationsEnabled}
              onSwitchChange={setNotificationsEnabled}
            />
            
            <SettingItem
              icon={<Feather name="bell" size={22} color="#8B5CF6" />}
              title="Suara Notifikasi"
              subtitle="Bunyikan suara saat notifikasi"
              showSwitch={true}
              switchValue={soundEnabled}
              onSwitchChange={setSoundEnabled}
            />
            
            <SettingItem
              icon={<MaterialIcons name="vibration" size={22} color="#F59E0B" />}
              title="Getar"
              subtitle="Getar saat notifikasi"
              showSwitch={true}
              switchValue={vibrationEnabled}
              onSwitchChange={setVibrationEnabled}
            />
          </Card.Content>
        </Card>

        {/* Tampilan */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="palette" size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>Tampilan</Text>
            </View>
            <Divider style={styles.divider} />
            
            <SettingItem
              icon={<MaterialIcons name="dark-mode" size={22} color="#6B7280" />}
              title="Mode Gelap"
              subtitle="Aktifkan tampilan gelap"
              showSwitch={true}
              switchValue={darkModeEnabled}
              onSwitchChange={setDarkModeEnabled}
            />
            
            <SettingItem
              icon={<MaterialIcons name="font-download" size={22} color="#8B5CF6" />}
              title="Ukuran Font"
              subtitle="Sesuaikan ukuran teks"
              onPress={() => Alert.alert("Info", "Fitur akan segera hadir")}
            />
            
            <SettingItem
              icon={<MaterialIcons name="language" size={22} color="#3B82F6" />}
              title="Bahasa"
              subtitle="Bahasa Indonesia"
              onPress={() => Alert.alert("Info", "Fitur akan segera hadir")}
            />
          </Card.Content>
        </Card>

        {/* Keamanan */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="security" size={20} color="#EF4444" />
              <Text style={styles.sectionTitle}>Keamanan & Akun</Text>
            </View>
            <Divider style={styles.divider} />
            
            <SettingItem
              icon={<MaterialIcons name="fingerprint" size={22} color="#10B981" />}
              title="Biometrik"
              subtitle="Login dengan sidik jari/wajah"
              showSwitch={true}
              switchValue={biometricEnabled}
              onSwitchChange={setBiometricEnabled}
            />
            
            <SettingItem
              icon={<MaterialIcons name="sync" size={22} color="#3B82F6" />}
              title="Sinkronisasi Otomatis"
              subtitle="Sinkron data secara otomatis"
              showSwitch={true}
              switchValue={autoSyncEnabled}
              onSwitchChange={setAutoSyncEnabled}
            />
            
            <SettingItem
              icon={<MaterialIcons name="lock" size={22} color="#F59E0B" />}
              title="Ubah Password"
              subtitle="Perbarui kata sandi akun"
              onPress={() => Alert.alert("Info", "Fitur akan segera hadir")}
            />
          </Card.Content>
        </Card>

        {/* Penyimpanan */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="database" size={20} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>Penyimpanan & Cache</Text>
            </View>
            <Divider style={styles.divider} />
            
            <SettingItem
              icon={<MaterialIcons name="storage" size={22} color="#6B7280" />}
              title="Bersihkan Cache"
              subtitle="Hapus data sementara"
              onPress={handleClearCache}
            />
            
            <SettingItem
              icon={<MaterialIcons name="history" size={22} color="#3B82F6" />}
              title="Hapus Riwayat"
              subtitle="Hapus semua riwayat peminjaman"
              onPress={handleClearHistory}
              danger={true}
            />
            
            <SettingItem
              icon={<MaterialIcons name="data-usage" size={22} color="#10B981" />}
              title="Penggunaan Data"
              subtitle="Lihat penggunaan penyimpanan"
              onPress={() => Alert.alert("Info", "Fitur akan segera hadir")}
            />
          </Card.Content>
        </Card>

        {/* Tentang */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="info" size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Tentang</Text>
            </View>
            <Divider style={styles.divider} />
            
            <SettingItem
              icon={<MaterialIcons name="description" size={22} color="#6B7280" />}
              title="Ketentuan Layanan"
              onPress={() => Alert.alert("Ketentuan Layanan", "Isi ketentuan layanan...")}
            />
            
            <SettingItem
              icon={<MaterialIcons name="privacy-tip" size={22} color="#10B981" />}
              title="Kebijakan Privasi"
              onPress={() => Alert.alert("Kebijakan Privasi", "Isi kebijakan privasi...")}
            />
            
            <SettingItem
              icon={<MaterialIcons name="code" size={22} color="#8B5CF6" />}
              title="Versi Aplikasi"
              subtitle="v1.0.0"
              onPress={() => Alert.alert("Versi", "Perpustakaan Digital v1.0.0")}
            />
            
            <SettingItem
              icon={<MaterialIcons name="contact-support" size={22} color="#F59E0B" />}
              title="Bantuan & Dukungan"
              onPress={() => router.push("/support")}
            />
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon="logout"
          buttonColor="#EF4444"
        >
          Keluar dari Akun
        </Button>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 Perpustakaan Digital
          </Text>
          <Text style={styles.footerVersion}>
            v1.0.0 • Build 2024.12.01
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#1976d2",
    paddingTop: isDesktop ? 60 : 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  backButton: { 
    padding: 8 
  },
  headerTitle: {
    color: "#fff",
    fontSize: isDesktop ? 20 : 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  content: { 
    flex: 1,
  },
  scrollContent: {
    padding: isDesktop ? 24 : isTablet ? 20 : 16,
    paddingBottom: 40,
  },
  profileCard: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: "#1976d2",
    elevation: 4,
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  sectionCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  divider: {
    marginBottom: 8,
    backgroundColor: "#f3f4f6",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dangerIcon: {
    backgroundColor: "#FEE2E2",
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  dangerText: {
    color: "#DC2626",
  },
  settingSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  logoutButton: {
    marginTop: 24,
    marginBottom: 16,
    borderRadius: 10,
    paddingVertical: 8,
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  footerText: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 10,
    color: "#9CA3AF",
  },
});