// components/CameraCapture.tsx
import AnalyzingOverlay from "@/components/AnalyzingOverlay";
import { BlurView } from "expo-blur";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useRef, useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

export default function CameraCapture() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing] = useState<CameraType>("front");

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required to scan your face
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 📸 TAKE PICTURE
    const takePicture = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
    });

    // 🔁 UN-MIRROR IMAGE (horizontal flip)
    const fixedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ flip: ImageManipulator.FlipType.Horizontal }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );

    setPhotoUri(fixedImage.uri);
    };


  // 🔁 RETAKE
  const retakePicture = () => {
    setPhotoUri(null);
  };

const uploadImage = async () => {
  if (!photoUri) {
    return;
}

  setUploading(true); // 🔥 trigger blur + overlay

  const formData = new FormData();
  formData.append("image", {
    uri: photoUri,
    name: "face.jpg",
    type: "image/jpeg",
  } as any);

  const token = await SecureStore.getItemAsync("auth_token");

  try {
    const res = await fetch(`${API_BASE_URL}/scan`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Scan failed");

    const data = await res.json();
    console.log("DATA",data)

    // ✅ Navigate AFTER analysis
    router.replace({
      pathname: "/scan-result",
      params: {
        result: JSON.stringify(data),
      },
    });

  } catch (error) {
    console.error(error);
    alert("Image upload or analysis failed");
    setUploading(false);
  }
};



  return (
    <View style={styles.container}>
      {!photoUri ? (
        <>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
          />

          {/* FACE GUIDE */}
          <View style={styles.overlay}>
            <View style={styles.faceGuide} />
          </View>

          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.captureText}>Capture</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* IMAGE PREVIEW */}
          {/* <Image source={{ uri: photoUri }} style={styles.preview} /> */}
            <View style={{ flex: 1 }}>
            <Image source={{ uri: photoUri }} style={styles.preview} />

            {uploading && (
                <>
                {/* 🌫 Blur image */}
                <BlurView
                    intensity={70}
                    tint="dark"
                    style={StyleSheet.absoluteFill}
                />

                {/* 🌑 Dark overlay for contrast */}
                <View style={styles.dimOverlay} />

                {/* 🔍 Fullscreen scanning animation */}
                <AnalyzingOverlay />
                </>
            )}
            </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.retake]}
              onPress={retakePicture}
            //   disabled={uploading}
            >
              <Text style={styles.actionText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.upload]}
              onPress={uploadImage}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                  <Text style={styles.actionText}>{uploading ? "Analyzing..." : "Upload"}</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

/* =====================
   STYLES
===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

dimOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(0,0,0,0.25)",
},

  camera: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },

  faceGuide: {
    width: 240,
    height: 300,
    borderWidth: 2,
    borderColor: "#00E676",
    borderRadius: 150,
  },

  captureButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#2E7D32",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
  },

  captureText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  preview: {
    flex: 1,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "#000",
  },

  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
  },

  retake: {
    backgroundColor: "#757575",
  },

  upload: {
    backgroundColor: "#2E7D32",
  },

  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  permissionText: {
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },

  button: {
    backgroundColor: "#2E7D32",
    padding: 12,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
  },
});
