import * as SecureStore from "expo-secure-store";

export const API_BASE_URL = "http://192.168.29.17:8080/api";

/* =========================
   PUBLIC APIs (NO JWT)
========================= */

export async function sendOtpApi(mobile: string) {
  const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mobile }),
  });

  if (!response.ok) {
    throw new Error("Failed to send OTP");
  }
}

export async function verifyOtpApi(payload: {
  mobile: string;
  otp: string;
  name?: string;
  email?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Invalid OTP");
  }

  return response.json(); // { token, newUser }
}

/* =========================
   SECURED APIs (JWT)
========================= */

async function getAuthHeaders() {
  const token = await SecureStore.getItemAsync("auth_token");

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function securedGet<T>(path: string): Promise<T> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers,
  });

  if (response.status === 401) {
    await SecureStore.deleteItemAsync("auth_token");
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
}
