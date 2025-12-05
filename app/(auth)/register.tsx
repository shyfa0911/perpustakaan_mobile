import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = () => {
    // Validasi
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Harap isi semua field");
      return;
    }
    
    if (!validateEmail(email)) {
      Alert.alert("Error", "Format email tidak valid");
      return;
    }
    
    if (password.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter");
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert("Error", "Password tidak cocok");
      return;
    }
    
    setIsLoading(true);
    
    // Simulasi proses register
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "Sukses", 
        "Registrasi berhasil!",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)")
          }
        ]
      );
    }, 1500);
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const navigateToLogin = () => {
    router.push("/(auth)/login");
  };

  return (
    <LinearGradient colors={["#0d1b2a", "#0d1b2a", "#1b263b"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* HEADER */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>Book</Text>
                <Text style={[styles.logoText, styles.logoHighlight]}>Zone</Text>
              </View>
              <Icon name="account-plus" size={40} color="#4a90e2" style={styles.logoIcon} />
              <Text style={styles.welcomeText}>Buat Akun Baru</Text>
              <Text style={styles.subtitle}>Bergabung dengan komunitas pembaca</Text>
            </View>

            {/* FORM */}
            <View style={styles.formContainer}>
              {/* Username Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Icon name="account-outline" size={20} color="#4a90e2" />
                </View>
                <TextInput
                  placeholder="Username"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Icon name="email-outline" size={20} color="#4a90e2" />
                </View>
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Icon name="lock-outline" size={20} color="#4a90e2" />
                </View>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#4a90e2" 
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Icon name="lock-check-outline" size={20} color="#4a90e2" />
                </View>
                <TextInput
                  placeholder="Konfirmasi Password"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  style={styles.passwordToggle}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Icon 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#4a90e2" 
                  />
                </TouchableOpacity>
              </View>

              {/* Password Strength Indicator */}
              <View style={styles.passwordStrength}>
                <Text style={styles.passwordStrengthText}>
                  Kekuatan password: {password.length >= 8 ? "Kuat" : password.length >= 6 ? "Sedang" : "Lemah"}
                </Text>
                <View style={styles.strengthBar}>
                  <View 
                    style={[
                      styles.strengthFill,
                      { 
                        width: `${Math.min(password.length * 10, 100)}%`,
                        backgroundColor: password.length >= 8 ? "#4CAF50" : 
                                       password.length >= 6 ? "#FF9800" : "#F44336"
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.passwordHint}>
                  Minimal 6 karakter, disarankan 8 karakter atau lebih
                </Text>
              </View>

              {/* Terms Checkbox */}
              <View style={styles.termsContainer}>
                <TouchableOpacity style={styles.checkbox}>
                  <Icon name="check-circle" size={24} color="#4a90e2" />
                </TouchableOpacity>
                <Text style={styles.termsText}>
                  Saya setuju dengan 
                  <Text style={styles.termsLink}> Syarat & Ketentuan </Text>
                  dan 
                  <Text style={styles.termsLink}> Kebijakan Privasi</Text>
                </Text>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#4CAF50", "#8BC34A", "#4CAF50"]}
                  style={styles.gradientButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <Text style={styles.registerButtonText}>Mendaftarkan...</Text>
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity onPress={navigateToLogin}></TouchableOpacity>
                      <Text style={styles.registerButtonText}>Daftar Sekarang</Text>
                      <Icon name="check-circle" size={20} color="white" style={styles.buttonIcon} />
                      
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Sudah punya akun? </Text>
                <TouchableOpacity onPress={navigateToLogin}>
                  <Text style={styles.loginLink}>Masuk di sini</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Dengan mendaftar, Anda dapat mengakses seluruh fitur BookZone
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  logoText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
  },
  logoHighlight: {
    color: "#4a90e2",
  },
  logoIcon: {
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    maxWidth: 250,
  },
  formContainer: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  inputIcon: {
    padding: 15,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 15,
    paddingRight: 15,
  },
  passwordToggle: {
    padding: 15,
    paddingLeft: 10,
  },
  passwordStrength: {
    marginBottom: 20,
    marginTop: 5,
  },
  passwordStrengthText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginBottom: 6,
  },
  strengthBar: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 6,
  },
  strengthFill: {
    height: "100%",
    borderRadius: 2,
  },
  passwordHint: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 10,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingHorizontal: 5,
  },
  checkbox: {
    marginRight: 10,
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    lineHeight: 18,
  },
  termsLink: {
    color: "#4a90e2",
    fontWeight: "500",
  },
  registerButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonIcon: {
    marginLeft: 10,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
  },
  loginLink: {
    color: "#4a90e2",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  footerText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
});