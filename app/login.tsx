import { sendOtpApi } from "@/app/utils/api";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMobileChange = (v: string) => {
    const digits = v.replace(/\D/g, "");
    if (digits.length <= 10) setMobile(digits);
  };

//   const redirectUri = "https://auth.expo.io/@mehulsri/yours-truly-care";
const redirectUri = AuthSession.makeRedirectUri({
  scheme: "yourstrulycare",
});

  const valid = mobile.length === 10;

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
    redirectUri,
    // scopes: ["openid", "profile", "email"],
  });

    useEffect(() => {
    console.log("Response Type:", response?.type);
    if (response?.type === "success") {
        // Check both locations for the token
        const idToken = response.authentication?.idToken || response.params?.id_token;

        if (!idToken) {
        console.error("❌ No ID Token found in response:", response);
        Alert.alert("Login failed", "No ID token received");
        return;
        }

        console.log("✅ Token found, hitting backend...");
        loginWithGoogle(idToken);
    }
    }, [response]);

  async function loginWithGoogle(idToken: string) {
    try {
      const res = await fetch("http://192.168.29.17:8080/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        throw new Error("Google login failed");
      }

      const { token } = await res.json();

      await SecureStore.setItemAsync("auth_token", token);

      router.replace("(tabs)");
    } catch (e) {
      Alert.alert("Error", "Google login failed. Try again.");
    }
  }
  return (
    <LinearGradient colors={["#EAF6EF", "#FFFFFF"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* LOGO */}
          <View style={styles.logoWrapper}>
            <Image
              source={require("@/assets/images/cropped.png")}
              style={styles.logo}
            />
          </View>

          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login with your mobile number</Text>

          <View style={styles.card}>
            {/* MOBILE INPUT */}
            <View style={styles.mobileRow}>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                placeholder="Mobile Number"
                placeholderTextColor="#7A7A7A"
                style={styles.mobileInput}
                keyboardType="number-pad"
                value={mobile}
                onChangeText={handleMobileChange}
                maxLength={10}
              />
            </View>

            {/* OTP BUTTON */}
            <TouchableOpacity
              disabled={!valid || loading}
              style={[styles.button, (!valid || loading) && styles.disabled]}
              onPress={async () => {
                try {
                  setLoading(true);
                  await sendOtpApi(mobile);
                  router.push({ pathname: "/otp", params: { mobile } });
                } catch {
                  Alert.alert("Error", "Failed to send OTP");
                } finally {
                  setLoading(false);
                }
              }}
            >
              <Text style={styles.buttonText}>
                {loading ? "Sending..." : "GET OTP"}
              </Text>
            </TouchableOpacity>


            {/* OR */}
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.or}>OR</Text>
              <View style={styles.divider} />
            </View>

            {/* SOCIAL LOGIN */}
            {Platform.OS === "ios" ? (
              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialText}>Login Via</Text>
                  <Image
                    source={require("@/assets/images/apple.png")}
                    style={styles.appleIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => promptAsync()}
                >
                  <Text style={styles.socialText}>Login Via</Text>
                  <Image
                    source={require("@/assets/images/google.png")}
                    style={styles.googleIcon}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => promptAsync()}
              >
                <Text style={styles.socialText}>Login Via</Text>
                <Image
                  source={require("@/assets/images/google.png")}
                  style={styles.googleIcon}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* EMAIL FLOW */}
          <TouchableOpacity onPress={() => router.push("/email-auth")}>
            <Text style={styles.link}>Use Email ID</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  logoWrapper: {
    alignSelf: "center",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 6,
  },
  logo: { width: 60, height: 60 },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#2E7D32",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#6B8F71",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 4,
  },
  mobileRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  countryCode: { marginRight: 6 },
  mobileInput: { flex: 1, height: 48 },
  button: {
    backgroundColor: "#2E7D32",
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: { backgroundColor: "#A5D6A7" },
  buttonText: { color: "#fff", fontWeight: "600" },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },
  divider: { flex: 1, height: 1, backgroundColor: "#E0E0E0" },
  or: { marginHorizontal: 10, color: "#888" },
  socialRow: { flexDirection: "row", gap: 12 },
  socialButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  appleIcon: { width: 18, height: 18, marginLeft: 6 },
  googleIcon: { width: 18, height: 18, marginLeft: 6 },
  socialText: { fontSize: 13, fontWeight: "500" },
  link: {
    marginTop: 24,
    textAlign: "center",
    color: "#2E7D32",
    fontWeight: "600",
  },
});
