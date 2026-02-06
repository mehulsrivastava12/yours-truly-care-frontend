import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ScanResultScreen() {
  const router = useRouter();
  const { result } = useLocalSearchParams();

  const data = result ? JSON.parse(result as string) : null;

  if (!data) {
    return (
      <View style={styles.center}>
        <Text>No data found</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#EAF6EF", "#FFFFFF"]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Skin Analysis Result</Text>
          <Text style={styles.subtitle}>AI-powered insights just for you</Text>
        </View>

        {/* SKIN TYPE */}
        <View style={styles.cardPrimary}>
          <Text style={styles.cardLabel}>Your Skin Type</Text>
          <Text style={styles.skinType}>{data.skinType.toUpperCase()}</Text>
        </View>

        {/* INSIGHT */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🧠 Insight</Text>
          <Text style={styles.bodyText}>{data.insight}</Text>
        </View>

        {/* TIPS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>✅ Care Tips</Text>
          {data.tips?.map((tip: string, index: number) => (
            <View key={index} style={styles.tipRow}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* DISCLAIMER */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            ⚠️ {data.disclaimer}
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.ctaText}>Go to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    marginTop: 40,
    marginBottom: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2E7D32",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B8F71",
  },

  cardPrimary: {
    backgroundColor: "#2E7D32",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },

  cardLabel: {
    color: "#C8E6C9",
    fontSize: 12,
  },

  skinType: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 4,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#2C2C2C",
  },

  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },

  tipRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  tipBullet: {
    fontSize: 18,
    marginRight: 6,
    color: "#2E7D32",
  },

  tipText: {
    flex: 1,
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },

  disclaimerBox: {
    marginTop: 12,
    padding: 14,
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
  },

  disclaimerText: {
    fontSize: 12,
    color: "#E65100",
  },

  ctaButton: {
    marginTop: 24,
    backgroundColor: "#2E7D32",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
