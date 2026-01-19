// app/scan.tsx
import CameraCapture from "@/components/CameraCapture";
import { View } from "react-native";

export default function ScanScreen() {
  const handleCapture = (imageUri: string) => {
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraCapture onCapture={handleCapture} />
    </View>
  );
}
