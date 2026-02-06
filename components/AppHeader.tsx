import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

    return (
      <View style={styles.container}>
        {/* HEADER — SafeArea applied ONLY here */}
        <View style={[styles.header, { paddingTop: insets.top + 2 }]}>
          <Image
            source={require("@/assets/images/cropped.png")}
            style={styles.logo}
          />
  
          <View style={styles.headerRight}>
            <Ionicons name="notifications-outline" size={22} />
            <Ionicons name="heart-outline" size={22} />
            <Ionicons name="bag-handle-outline" size={22} />
          </View>
        </View>
  
        {/* SEARCH — tightly under header */}
        <TouchableOpacity style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#999" />
          <Text style={styles.searchText}>
            Search skin concerns, products
          </Text>
        </TouchableOpacity>
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  logo: {
    width: 105,
    height: 50,
    resizeMode: "contain",
  },
  headerRight: {
    flexDirection: "row",
    gap: 18,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 2,          // 🔥 tight
    marginBottom: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F4F4F4",
    borderRadius: 30,
    gap: 10,
  },

  searchText: {
    color: "#999",
    fontSize: 14,
  },
  });
