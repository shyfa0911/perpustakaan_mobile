import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

export default function SearchBar({ value, onChange }: any) {
  const [focused, setFocused] = useState(false);

  return (
    <View
      className={`
        flex-row items-center px-4 py-3 
        bg-gray-100 rounded-3xl 
        border ${focused ? "border-blue-400" : "border-gray-200"} 
        shadow-sm
      `}
    >
      <Ionicons name="search" size={20} color="#777" />

      <TextInput
        placeholder="Cari buku..."
        value={value}
        onChangeText={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="ml-3 flex-1 text-base text-black"
        placeholderTextColor="#999"
      />

      {value.length > 0 && (
        <Pressable onPress={() => onChange("")}>
          <Ionicons name="close-circle" size={18} color="#777" />
        </Pressable>
      )}
    </View>
  );
}
