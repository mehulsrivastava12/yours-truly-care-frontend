import { sendOtpApi, verifyOtpApi } from "@/app/utils/api";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
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

const RESEND_TIMER = 60;

export default function OtpScreen() {
  const router = useRouter();
  const { mobile, name, email } = useLocalSearchParams<{
    mobile: string;
    name?: string;
    email?: string;
  }>();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_TIMER);
  const [resending, setResending] = useState(false);

  /* =========================
     TIMER
  ========================= */
  useEffect(() => {
    if (resendTimer === 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  /* =========================
     VERIFY OTP
  ========================= */
  const handleVerify = async () => {
    try {
      setLoading(true);
      const res = await verifyOtpApi({ mobile, otp, name, email });
      await SecureStore.setItemAsync("auth_token", res.token);
      router.replace("(tabs)");
    } catch (e: any) {
      Alert.alert("Verification Failed", e.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RESEND OTP
  ========================= */
  const handleResend = async () => {
    try {
      setResending(true);
      await sendOtpApi(mobile);
      setResendTimer(RESEND_TIMER);
    //   Alert.alert("OTP Sent", "A new OTP has been sent");
    } catch {
      Alert.alert("Error", "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const formatTime = (sec: number) =>
    `0:${sec < 10 ? "0" : ""}${sec}`;

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

          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to
          </Text>
          <Text style={styles.mobile}>+91 {mobile}</Text>

          {/* CARD */}
          <View style={styles.card}>
            <TextInput
              value={otp}
              onChangeText={(v) =>
                v.replace(/\D/g, "").length <= 6 && setOtp(v)
              }
              keyboardType="number-pad"
              maxLength={6}
              placeholder="● ● ● ● ● ●"
              placeholderTextColor="#9E9E9E"
              style={styles.otpInput}
            />

            <TouchableOpacity
              style={[
                styles.button,
                (otp.length !== 6 || loading) &&
                  styles.buttonDisabled,
              ]}
              disabled={otp.length !== 6 || loading}
              onPress={handleVerify}
            >
              <Text style={styles.buttonText}>
                {loading ? "Verifying..." : "Verify"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* RESEND */}
          <TouchableOpacity
            disabled={resendTimer > 0 || resending}
            onPress={handleResend}
          >
            <Text style={styles.resendText}>
              {resendTimer > 0
                ? `Resend OTP in ${formatTime(resendTimer)}`
                : "Resend OTP"}
            </Text>
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
    padding: 24,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: "center",
  },
  logoWrapper: {
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 6,
  },
  logo: { width: 48, height: 48 },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#2E7D32",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B8F71",
    textAlign: "center",
  },
  mobile: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    elevation: 4,
  },
  otpInput: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 14,
    textAlign: "center",
    fontSize: 22,
    letterSpacing: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2E7D32",
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#A5D6A7",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resendText: {
    marginTop: 24,
    textAlign: "center",
    color: "#2E7D32",
    fontWeight: "600",
  },
});
