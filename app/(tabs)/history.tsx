import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

export default async function ScanHistoryScreen() {
    
  const router = useRouter();
  const { result } = useLocalSearchParams();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (result) {
      setHistory(JSON.parse(result as string));
    }
  }, [result]);

  return (
    <LinearGradient colors={["#EAF6EF", "#FFFFFF"]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.push("/account")}>
  <Text>←</Text>
</TouchableOpacity>

        <Text style={styles.pageTitle}>Your Scan History</Text>

        {history.map((data: any, index: number) => (
          <View key={index} style={{ marginBottom: 30 }}>

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
              {data.tips?.map((tip: string, i: number) => (
                <View key={i} style={styles.tipRow}>
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

          </View>
        ))}

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2E7D32",
    marginTop: 40,
    marginBottom: 24,
  },

  cardPrimary: {
    backgroundColor: "#2E7D32",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },

  cardLabel: { color: "#C8E6C9", fontSize: 12 },

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
  },

  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },

  tipRow: { flexDirection: "row", marginBottom: 8 },

  tipBullet: { fontSize: 18, marginRight: 6, color: "#2E7D32" },

  tipText: { flex: 1, fontSize: 14, color: "#444" },

  disclaimerBox: {
    marginTop: 12,
    padding: 14,
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
  },

  disclaimerText: { fontSize: 12, color: "#E65100" },
});
