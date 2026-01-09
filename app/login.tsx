import { sendOtpApi } from "@/app/utils/api";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
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
    View
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMobileChange = (v: string) => {
    const digits = v.replace(/\D/g, "");
    if (digits.length <= 10) setMobile(digits);
  };

  const valid = mobile.length === 10;

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
                style={styles.mobileInput}
                keyboardType="number-pad"
                placeholderTextColor="#7A7A7A"
                value={mobile}
                onChangeText={handleMobileChange}
                maxLength={10}
              />
            </View>

            {/* OTP BUTTON */}
            {/* <TouchableOpacity
              disabled={!valid}
              style={[styles.button, !valid && styles.disabled]}
              onPress={() =>
                router.push({ pathname: "/otp", params: { mobile } })
              }
            >
              <Text style={styles.buttonText}>GET OTP</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
            disabled={!valid || loading}
            style={[styles.button, (!valid || loading) && styles.disabled]}
            onPress={async () => {
                try {
                setLoading(true);
                await sendOtpApi(mobile);
                router.push({ pathname: "/otp", params: { mobile } });
                } catch (e) {
                Alert.alert("Error", "Failed to send OTP. Please try again.");
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

                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialText}>Login Via</Text>
                  <Image
                    source={require("@/assets/images/google.png")}
                    style={styles.googleIcon}
                  />
                  {/* <Text style={styles.socialText}>Login via Google</Text> */}
                </TouchableOpacity>
              </View>
            ) : (
                <TouchableOpacity style={styles.socialButton}>
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
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
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
  googleOnly: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  socialIcon: { width: 18, height: 18, marginRight: 8 },
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
