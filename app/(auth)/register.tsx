import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = () => {
    if (username && email && password) {
      router.replace("../(tabs)/index"); // langsung ke Home
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 20 }}>
        Register
      </Text>
      <TextInput
        placeholder="Username"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 10,
          marginBottom: 10,
        }}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Email"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 10,
          marginBottom: 10,
        }}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 10,
          marginBottom: 20,
        }}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={{
          padding: 15,
          backgroundColor: "#6C63FF",
          borderRadius: 10,
          alignItems: "center",
        }}
        onPress={handleRegister}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text style={{ marginTop: 20, color: "#6C63FF" }}>
          Sudah punya akun? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
