import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,

        tabBarShowLabel: true,
        tabBarLabelPosition: "below-icon",
        tabBarActiveTintColor: "#2F80ED", // Label juga biru saat aktif
        tabBarInactiveTintColor: "#7a8ba0",

        tabBarStyle: {
          height: 70,
          paddingBottom: 8,
          backgroundColor: "#fff",
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      {/* URUTAN MENU: HOME -> SEARCH -> PROFILE -> HISTORY */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => {
            const scaleAnim = useRef(new Animated.Value(1)).current;

            useEffect(() => {
              Animated.spring(scaleAnim, {
                toValue: focused ? 1.15 : 1,
                tension: 150,
                friction: 12,
                useNativeDriver: true,
              }).start();
            }, [focused]);

            return (
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Ionicons
                  name="home"
                  size={28}
                  color={focused ? "#2F80ED" : color}
                />
              </Animated.View>
            );
          },
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused, color }) => {
            const scaleAnim = useRef(new Animated.Value(1)).current;

            useEffect(() => {
              Animated.spring(scaleAnim, {
                toValue: focused ? 1.15 : 1,
                tension: 150,
                friction: 12,
                useNativeDriver: true,
              }).start();
            }, [focused]);

            return (
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Ionicons
                  name="search"
                  size={28}
                  color={focused ? "#2F80ED" : color}
                />
              </Animated.View>
            );
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => {
            const scaleAnim = useRef(new Animated.Value(1)).current;

            useEffect(() => {
              Animated.spring(scaleAnim, {
                toValue: focused ? 1.15 : 1,
                tension: 150,
                friction: 12,
                useNativeDriver: true,
              }).start();
            }, [focused]);

            return (
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Ionicons
                  name="person"
                  size={28}
                  color={focused ? "#2F80ED" : color}
                />
              </Animated.View>
            );
          },
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ focused, color }) => {
            const scaleAnim = useRef(new Animated.Value(1)).current;

            useEffect(() => {
              Animated.spring(scaleAnim, {
                toValue: focused ? 1.15 : 1,
                tension: 150,
                friction: 12,
                useNativeDriver: true,
              }).start();
            }, [focused]);

            return (
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Ionicons
                  name="time"
                  size={28}
                  color={focused ? "#2F80ED" : color}
                />
              </Animated.View>
            );
          },
        }}
      />
    </Tabs>
  );
}