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
    View,
} from "react-native";

export default function EmailAuthScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMobileChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length <= 10) {
      setMobile(digitsOnly);
    }
  };

  const isValid =
    name.trim().length > 1 &&
    email.includes("@") &&
    mobile.length === 10;

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
              resizeMode="contain"
            />
          </View>

          {/* TITLE */}
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Enter your details to get OTP
          </Text>

          {/* CARD */}
          <View style={styles.card}>
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#7A7A7A"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />

            <TextInput
              placeholder="Email ID"
              placeholderTextColor="#7A7A7A"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

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

            {/* <TouchableOpacity
              style={[
                styles.button,
                !isValid && styles.buttonDisabled,
              ]}
              disabled={!isValid}
              onPress={() =>
                router.push({
                  pathname: "/otp",
                  params: { mobile },
                })
              }
            >
              <Text style={styles.buttonText}>GET OTP</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
            style={[styles.button, (!isValid || loading) && styles.buttonDisabled]}
            disabled={!isValid || loading}
            onPress={async () => {
                try {
                setLoading(true);
                await sendOtpApi(mobile);
                router.push({
                    pathname: "/otp",
                    params: { mobile, name, email },
                });
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

          </View>
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
    padding: 24,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: "center",
  },

  logoWrapper: {
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 6,
  },

  logo: {
    width: 60,
    height: 60,
  },

  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "600",
    color: "#2E7D32",
  },

  subtitle: {
    textAlign: "center",
    marginTop: 6,
    fontSize: 14,
    color: "#6B8F71",
    marginBottom: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    elevation: 4,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    fontSize: 14,
    color: "#2C2C2C",
  },

  mobileRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    marginBottom: 14,
    paddingHorizontal: 12,
  },

  countryCode: {
    fontSize: 14,
    color: "#555",
    marginRight: 6,
  },

  mobileInput: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: "#2C2C2C",
  },

  button: {
    backgroundColor: "#2E7D32",
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonDisabled: {
    backgroundColor: "#A5D6A7",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
