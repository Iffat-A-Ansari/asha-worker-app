import { View, Text, TouchableOpacity, Alert, Pressable } from "react-native";
import { useState, useRef, useEffect } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

/**
 * QR Scanner Screen
 * 
 * Features:
 * - Real-time QR code detection via camera
 * - Flashlight toggle for low-light scanning
 * - Gallery fallback for offline scanning
 * - QR result validation
 */
export default function QRScannerScreen() {
  const colors = useColors();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (!isScanning) return;
    
    setIsScanning(false);
    setScannedData(data);
    
    // Validate QR code format (expecting VIX-XXXXX format)
    if (data.startsWith("VIX-")) {
      Alert.alert("QR Code Scanned", `Medicine ID: ${data}`, [
        {
          text: "Confirm",
          onPress: () => {
            router.push({
              pathname: "../qr-result",
              params: { qrData: data },
            });
          },
        },
        {
          text: "Scan Again",
          onPress: () => {
            setIsScanning(true);
            setScannedData(null);
          },
        },
      ]);
    } else {
      Alert.alert("Invalid QR Code", "This QR code is not recognized. Please try again.", [
        {
          text: "OK",
          onPress: () => {
            setIsScanning(true);
            setScannedData(null);
          },
        },
      ]);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        // In a real app, you would use a QR code reading library here
        // For now, we'll show a placeholder
        Alert.alert(
          "Gallery Image Selected",
          "QR code reading from gallery images requires additional setup. This feature will scan the image when implemented.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image from gallery");
    }
  };

  if (!permission?.granted) {
    return (
      <ScreenContainer className="bg-background items-center justify-center">
        <View className="gap-4 items-center p-6">
          <IconSymbol name="camera.fill" size={48} color={colors.primary} />
          <Text className="text-2xl font-bold text-foreground text-center">
            Camera Permission Required
          </Text>
          <Text className="text-base text-muted text-center">
            We need access to your camera to scan QR codes.
          </Text>
          <TouchableOpacity
            className="bg-primary rounded-lg px-6 py-3 mt-4 active:opacity-80"
            onPress={requestPermission}
          >
            <Text className="text-base font-semibold text-white">Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background" edges={["top", "left", "right", "bottom"]}>
      <View className="flex-1 relative">
        {/* Camera View */}
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
          enableTorch={flashEnabled}
          onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
        >
          {/* QR Frame Overlay */}
          <View className="flex-1 items-center justify-center">
            <View className="w-64 h-64 border-4 border-primary rounded-2xl opacity-80" />
          </View>

          {/* Top Controls */}
          <View className="absolute top-6 left-0 right-0 flex-row items-center justify-between px-6">
            <Pressable
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              onPress={() => router.back()}
              className="bg-black/50 rounded-full p-3"
            >
              <Text className="text-white text-2xl">✕</Text>
            </Pressable>
            <Text className="text-white text-lg font-semibold">Scan QR Code</Text>
            <View className="w-12" />
          </View>

          {/* Bottom Controls */}
          <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 gap-4">
            <View className="flex-row gap-3 justify-center">
              {/* Flashlight Toggle */}
              <TouchableOpacity
                onPress={() => setFlashEnabled(!flashEnabled)}
                className={`rounded-full p-4 ${
                  flashEnabled ? "bg-primary" : "bg-black/50"
                } active:opacity-80`}
              >
                <IconSymbol
                  name={flashEnabled ? "flashlight.on.fill" : "flashlight.on.fill"}
                  size={24}
                  color="#ffffff"
                />
              </TouchableOpacity>

              {/* Gallery Fallback */}
              <TouchableOpacity
                onPress={pickImageFromGallery}
                className="rounded-full p-4 bg-black/50 active:opacity-80"
              >
                <IconSymbol name="photo.fill" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <Text className="text-white text-center text-sm">
              {flashEnabled ? "💡 Flashlight ON" : "Position QR code in frame"}
            </Text>
          </View>
        </CameraView>
      </View>
    </ScreenContainer>
  );
}
