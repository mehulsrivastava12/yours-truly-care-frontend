import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const SCAN_SIZE = width * 0.75;

export default function FullscreenScanOverlay() {
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: SCAN_SIZE - 4,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Scan Box */}
      <View style={styles.scanBox}>
        <Animated.View
          style={[
            styles.scanLine,
            {
              transform: [{ translateY: scanAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={["transparent", "#3df574", "#3df574", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 3 }}
          />
        </Animated.View>
      </View>

      {/* Text */}
      <Text style={styles.title}>Analyzing your skin</Text>
      <Text style={styles.subtitle}>
        Our System is detecting skin patterns ✨
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },

  scanBox: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#e931f0",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.03)",
  },

  scanLine: {
    position: "absolute",
    width: "100%",
  },

  title: {
    marginTop: 28,
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#D1D5DB",
  },
});
