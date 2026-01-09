import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ImageBackground, StyleSheet } from "react-native";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 4000); // 4 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={require("@/assets/images/yours-truly-care-logo.png")}
      style={styles.background}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
