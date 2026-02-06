import AppHeader from "@/components/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, View } from "react-native";
const INACTIVE = "#1F2937";

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      {/* 🔥 GLOBAL HEADER */}
      <AppHeader />
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#FC2779",
        tabBarInactiveTintColor: INACTIVE,

        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0.5,
          borderTopColor: "#E5E7EB",
          height: Platform.OS === "ios" ? 70 : 64,
          paddingBottom: Platform.OS === "ios" ? 10 : 8,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 2,
          fontWeight: "500",
        },
      }}
    >
      {/* OFFERS / SKIN */}
      <Tabs.Screen
        name="offers"
        options={{
          title: "Offers",
          tabBarIcon: ({ color }) => (
            <Ionicons name="pricetag-outline" size={22} color={color} />
          ),
        }}
      />

      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* CATEGORIES */}
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={22} color={color} />
          ),
        }}
      />

      {/* PLAY */}
      <Tabs.Screen
        name="play"
        options={{
          title: "Play",
          tabBarIcon: ({ color }) => (
            <Ionicons name="play-circle-outline" size={22} color={color} />
          ),
        }}
      />

      {/* ACCOUNT */}
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan-result"
        options={{
          title: "Result",
          href: null, 
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          href: null, 
        }}
      />
    </Tabs>
    </View>
  );
}
