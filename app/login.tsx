import { useColorScheme } from "@/hooks/use-color-scheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [authReady, setAuthReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync("auth_token");
      setHasToken(!!token);
      setAuthReady(true);
    })();
  }, []);

  // ⏳ Block app until auth resolved
  if (!authReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {hasToken ? (
        // ✅ LOGGED IN → DIRECTLY LOAD APP
        <Redirect href="/(tabs)" />
      ) : (
        // ❌ NOT LOGGED IN → AUTH STACK ONLY
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
        </Stack>
      )}

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
