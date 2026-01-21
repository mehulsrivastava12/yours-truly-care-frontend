import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

export default function AnalyzingScreen() {
  const scanAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(scanAnim, {
        toValue: 1,
        duration: 2200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 260],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  return (
    <View style={styles.container}>
      {/* Gradient Frame */}
      <LinearGradient
        colors={["#8EC5FC", "#E0C3FC", "#F093FB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientFrame}
      >
        <Animated.View
          style={[
            styles.scanBox,
            { opacity: glowOpacity },
          ]}
        >
          {/* Scan Line */}
          <Animated.View
            style={[
              styles.scanLine,
              { transform: [{ translateY }] },
            ]}
          />
        </Animated.View>
      </LinearGradient>

      <Text style={styles.title}>Analyzing your skin</Text>
      <Text style={styles.subtitle}>
        Our AI is detecting skin patterns ✨
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },

  gradientFrame: {
    padding: 4,
    borderRadius: 32,
    marginBottom: 40,
  },

  scanBox: {
    width: 280,
    height: 280,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  scanLine: {
    position: "absolute",
    width: "100%",
    height: 4,
    backgroundColor: "#7F7FD5",
    shadowColor: "#7F7FD5",
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#777",
  },
});
