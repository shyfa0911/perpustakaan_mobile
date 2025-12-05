// app/about.tsx
import { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

export default function About() {
  const router = useRouter();

  const features = [
    "📚 Katalog Buku Digital",
    "🔍 Pencarian Buku Cepat",
    "📱 Pinjam Buku Online",
    "🔔 Notifikasi Pengembalian",
    "📊 Dashboard Admin",
    "👥 Multi-user Akses",
  ];

  const contactInfo = [
    { icon: "location-on", label: "Alamat", value: "Jl. Pendidikan No. 123, Depok" },
    { icon: "phone", label: "Telepon", value: "(021) 1234-5678" },
    { icon: "email", label: "Email", value: "perpus@smktarunabhakti.sch.id" },
    { icon: "school", label: "Website", value: "www.smktarunabhakti.sch.id" },
  ];

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
        <Text style={styles.headerTitle}>Tentang</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo & Sekolah */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <MaterialIcons name="school" size={60} color="#1976d2" />
          </View>
          <Text style={styles.schoolName}>SMK Taruna Bhakti</Text>
          <Text style={styles.appName}>Sistem Perpustakaan Digital</Text>
        </View>

        {/* Deskripsi */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Tentang Aplikasi</Text>
            <Text style={styles.description}>
              Aplikasi Perpustakaan Digital SMK Taruna Bhakti merupakan sistem 
              manajemen perpustakaan modern yang memudahkan siswa, guru, dan staf 
              dalam mengakses koleksi buku digital, melakukan peminjaman, dan 
              pengelolaan administrasi perpustakaan.
            </Text>
          </Card.Content>
        </Card>

        {/* Visi Misi */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Visi & Misi</Text>
            
            <View style={styles.visionItem}>
              <MaterialIcons name="visibility" size={20} color="#1976d2" />
              <View style={styles.textContainer}>
                <Text style={styles.subTitle}>Visi</Text>
                <Text style={styles.visionText}>
                  Menjadi perpustakaan digital terdepan yang mendukung 
                  pembelajaran dan pengembangan literasi digital di SMK Taruna Bhakti.
                </Text>
              </View>
            </View>

            <View style={styles.missionItem}>
              <MaterialIcons name="assignment" size={20} color="#4CAF50" />
              <View style={styles.textContainer}>
                <Text style={styles.subTitle}>Misi</Text>
                <Text style={styles.missionText}>
                  1. Menyediakan akses buku digital yang lengkap dan terkini{"\n"}
                  2. Meningkatkan minat baca melalui teknologi digital{"\n"}
                  3. Memudahkan proses administrasi peminjaman buku{"\n"}
                  4. Mendukung program literasi sekolah
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Fitur */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Fitur Utama</Text>
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureIcon}>{feature.split(" ")[0]}</Text>
                  <Text style={styles.featureText}>{feature.substring(3)}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Kontak */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Kontak & Informasi</Text>
            
            {contactInfo.map((item, index) => (
              <View key={index} style={styles.contactItem}>
                <MaterialIcons name={item.icon as any} size={22} color="#666" />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>{item.label}</Text>
                  <Text style={styles.contactValue}>{item.value}</Text>
                </View>
              </View>
            ))}

            <Button
              mode="contained"
              onPress={() => Linking.openURL("https://maps.google.com")}
              style={styles.mapButton}
              icon="map"
            >
              Lihat Lokasi di Google Maps
            </Button>
          </Card.Content>
        </Card>

        {/* Developer */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Pengembang</Text>
            <Text style={styles.devText}>
              Aplikasi ini dikembangkan oleh Tim IT SMK Taruna Bhakti 
              menggunakan teknologi React Native dan dikelola oleh 
              Bagian Teknologi Informasi sekolah.
            </Text>
            
            <View style={styles.devInfo}>
              <MaterialIcons name="code" size={20} color="#666" />
              <Text style={styles.techText}>React Native • TypeScript • Firebase</Text>
            </View>

            <Button
              mode="outlined"
              onPress={() => Linking.openURL("mailto:it.support@smktarunabhakti.sch.id")}
              style={styles.supportButton}
              icon="support"
            >
              Hubungi Support IT
            </Button>
          </Card.Content>
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 Perpustakaan Digital SMK Taruna Bhakti
          </Text>
          <Text style={styles.versionText}>Versi 1.0.0</Text>
        </View>
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
    padding: 8 
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  content: { 
    flex: 1,
    padding: 16,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#1976d2",
  },
  schoolName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 4,
  },
  appName: {
    fontSize: 16,
    color: "#666",
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  visionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  missionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  visionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  missionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureItem: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    textAlign: "center",
    color: "#333",
    fontWeight: "500",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  contactInfo: {
    marginLeft: 16,
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  mapButton: {
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
  },
  devText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
    lineHeight: 22,
  },
  devInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  techText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 12,
  },
  supportButton: {
    borderRadius: 8,
    borderColor: "#1976d2",
  },
  footer: {
    alignItems: "center",
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  footerText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  versionText: {
    fontSize: 11,
    color: "#999",
  },
});