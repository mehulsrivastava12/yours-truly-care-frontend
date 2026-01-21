import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

      {/* CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <LinearGradient colors={["#EAF7EC", "#FFFFFF"]} style={styles.hero}>
          <Text style={styles.heroTitle}>AI Skin Analysis</Text>
          <Text style={styles.heroSubtitle}>
            Scan your face & get personalized care
          </Text>

          <TouchableOpacity
            style={styles.heroButton}
            onPress={() => router.push("/scan")}
          >
            <Text style={styles.heroButtonText}>Scan Now →</Text>
          </TouchableOpacity>
        </LinearGradient>

          {/* CATEGORY */}
          <View style={styles.categoryRow}>
           {[
             { label: "Scan", emoji: "📸", route: "/scan" },
             { label: "Skin", emoji: "✨" },
             { label: "Routine", emoji: "🧴" },
             { label: "Products", emoji: "🛍️" },
             { label: "Tips", emoji: "💡" },
           ].map((item, index) => (
             <TouchableOpacity
               key={index}
               style={styles.categoryItem}
               onPress={() => item.route && router.push(item.route)}
             >
               <Text style={styles.categoryEmoji}>{item.emoji}</Text>
               <Text style={styles.categoryText}>{item.label}</Text>
             </TouchableOpacity>
           ))}
         </View>
         {/* RECOMMENDED */}
         <View style={styles.section}>
           <Text style={styles.sectionTitle}>Recommended for you</Text>

           <View style={styles.recoCard}>
             <Text style={styles.recoTitle}>Daily Skin Routine</Text>
             <Text style={styles.recoText}>
               Personalized routine based on your scan
             </Text>
           </View>

           <View style={styles.recoCard}>
             <Text style={styles.recoTitle}>Product Matches</Text>
             <Text style={styles.recoText}>
               Best products for your skin type
             </Text>
           </View>
         </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 4,
  },

  categoryItem: {
    alignItems: "center",
    width: 60,
  },

  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 24,
    marginVertical: 16,
  },

  categoryEmoji: {
    fontSize: 26,
  },

  categoryText: {
    marginTop: 6,
    fontSize: 12,
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

  section: {
    paddingHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },

  recoCard: {
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },

  recoTitle: {
    fontSize: 15,
    fontWeight: "600",
  },

  recoText: {
    marginTop: 4,
    fontSize: 13,
    color: "#666",
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

  scroll: {
    paddingBottom: 16,
  },

  hero: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 20,
    borderRadius: 20,
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E7D32",
  },

  heroSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#555",
  },

  heroButton: {
    marginTop: 16,
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },

  heroButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

