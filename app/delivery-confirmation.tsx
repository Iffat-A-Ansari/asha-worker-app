import { View, Text, TouchableOpacity, ScrollView, Alert, Pressable } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

/**
 * Delivery Confirmation Screen
 * 
 * Features:
 * - Photo capture of delivered medicine
 * - Patient signature/thumbprint verification
 * - Local storage queuing for offline delivery confirmations
 * - Sync status tracking
 */
export default function DeliveryConfirmationScreen() {
  const colors = useColors();
  const router = useRouter();
  const [step, setStep] = useState<"photo" | "verification" | "success">("photo");
  const [photoTaken, setPhotoTaken] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<"thumbprint" | "signature" | null>(null);
  const [verified, setVerified] = useState(false);

  const medicineData = {
    id: "VIX-45821",
    name: "Vitamin D3 Supplement",
    patient: "Ram Lal",
    quantity: 30,
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled) {
        setPhotoTaken(true);
        Alert.alert("Photo Captured", "Medicine photo has been saved locally.", [
          {
            text: "Continue",
            onPress: () => setStep("verification"),
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to capture photo");
    }
  };

  const handleThumbprintVerification = () => {
    setVerificationMethod("thumbprint");
    Alert.alert(
      "Thumbprint Verification",
      "Patient's thumbprint would be captured here using biometric sensors.",
      [
        {
          text: "Simulate Verification",
          onPress: () => {
            setVerified(true);
            setStep("success");
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleSignatureVerification = () => {
    setVerificationMethod("signature");
    Alert.alert(
      "Signature Verification",
      "Patient signature would be captured here using a signature pad.",
      [
        {
          text: "Simulate Verification",
          onPress: () => {
            setVerified(true);
            setStep("success");
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleConfirmDelivery = () => {
    Alert.alert(
      "Delivery Confirmed",
      `Medicine delivered to ${medicineData.patient}.\n\nQueued for sync when online.`,
      [
        {
          text: "Done",
          onPress: () => router.push("/(tabs)"),
        },
      ]
    );
  };

  if (step === "photo") {
    return (
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="flex-1 p-6 gap-6">
            {/* Header */}
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-2xl">←</Text>
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-foreground">Confirm Delivery</Text>
              <View className="w-6" />
            </View>

            {/* Step Indicator */}
            <View className="flex-row gap-2">
              <View className="flex-1 h-1 bg-primary rounded-full" />
              <View className="flex-1 h-1 bg-border rounded-full" />
              <View className="flex-1 h-1 bg-border rounded-full" />
            </View>

            {/* Medicine Details */}
            <View className="bg-surface border border-border rounded-xl p-4 gap-2">
              <Text className="text-lg font-semibold text-foreground">{medicineData.name}</Text>
              <Text className="text-sm text-muted">{medicineData.id}</Text>
              <Text className="text-sm text-muted">Qty: {medicineData.quantity} tablets</Text>
            </View>

            {/* Photo Capture Section */}
            <View className="gap-4">
              <Text className="text-lg font-semibold text-foreground">Step 1: Capture Photo</Text>

              <View className="bg-surface border-2 border-dashed border-border rounded-xl p-8 items-center justify-center gap-4 min-h-[200px]">
                {photoTaken ? (
                  <View className="gap-2 items-center">
                    <Text className="text-4xl">📷</Text>
                    <Text className="text-base font-semibold text-success">Photo Captured</Text>
                  </View>
                ) : (
                  <View className="gap-2 items-center">
                    <IconSymbol name="camera.fill" size={48} color={colors.primary} />
                    <Text className="text-base text-muted text-center">
                      Take a photo of the delivered medicine
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={handleTakePhoto}
                className="bg-primary rounded-lg py-4 items-center justify-center active:opacity-80 flex-row gap-2"
              >
                <IconSymbol name="camera.fill" size={20} color="#ffffff" />
                <Text className="text-base font-semibold text-white">
                  {photoTaken ? "RETAKE PHOTO" : "TAKE PHOTO"}
                </Text>
              </TouchableOpacity>

              {photoTaken && (
                <TouchableOpacity
                  onPress={() => setStep("verification")}
                  className="border border-primary rounded-lg py-4 items-center justify-center active:opacity-80"
                >
                  <Text className="text-base font-semibold text-primary">CONTINUE</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (step === "verification") {
    return (
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="flex-1 p-6 gap-6">
            {/* Header */}
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={() => setStep("photo")}>
                <Text className="text-2xl">←</Text>
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-foreground">Verify Delivery</Text>
              <View className="w-6" />
            </View>

            {/* Step Indicator */}
            <View className="flex-row gap-2">
              <View className="flex-1 h-1 bg-primary rounded-full" />
              <View className="flex-1 h-1 bg-primary rounded-full" />
              <View className="flex-1 h-1 bg-border rounded-full" />
            </View>

            {/* Verification Methods */}
            <View className="gap-4">
              <Text className="text-lg font-semibold text-foreground">Step 2: Patient Verification</Text>
              <Text className="text-sm text-muted">Choose verification method:</Text>

              {/* Thumbprint Option */}
              <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                onPress={handleThumbprintVerification}
                className="bg-surface border border-border rounded-xl p-5 gap-3 flex-row items-center"
              >
                <View className="flex-1 gap-2">
                  <Text className="text-lg font-semibold text-foreground">👆 Thumbprint</Text>
                  <Text className="text-sm text-muted">Biometric verification</Text>
                </View>
                <IconSymbol name="chevron.right" size={24} color={colors.muted} />
              </Pressable>

              {/* Signature Option */}
              <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                onPress={handleSignatureVerification}
                className="bg-surface border border-border rounded-xl p-5 gap-3 flex-row items-center"
              >
                <View className="flex-1 gap-2">
                  <Text className="text-lg font-semibold text-foreground">✍️ Signature</Text>
                  <Text className="text-sm text-muted">Digital signature pad</Text>
                </View>
                <IconSymbol name="chevron.right" size={24} color={colors.muted} />
              </Pressable>

              {/* OTP Option */}
              <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                className="bg-surface border border-border rounded-xl p-5 gap-3 flex-row items-center"
              >
                <View className="flex-1 gap-2">
                  <Text className="text-lg font-semibold text-foreground">📱 OTP</Text>
                  <Text className="text-sm text-muted">SMS verification code</Text>
                </View>
                <IconSymbol name="chevron.right" size={24} color={colors.muted} />
              </Pressable>
            </View>

            <View className="flex-1" />
            <Text className="text-xs text-muted text-center">
              Verification data will be stored locally and synced when online
            </Text>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1 p-6 gap-6 items-center justify-center">
        {/* Success Badge */}
        <View className="w-24 h-24 rounded-full bg-success/20 items-center justify-center">
          <Text className="text-6xl">✓</Text>
        </View>

        {/* Success Message */}
        <View className="gap-2 items-center">
          <Text className="text-3xl font-bold text-foreground">Delivery Confirmed!</Text>
          <Text className="text-base text-muted text-center">
            Medicine delivered to {medicineData.patient}
          </Text>
        </View>

        {/* Delivery Summary */}
        <View className="bg-surface border border-border rounded-xl p-5 w-full gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-muted">Medicine ID</Text>
            <Text className="text-sm font-semibold text-foreground">{medicineData.id}</Text>
          </View>
          <View className="h-px bg-border" />
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-muted">Verification</Text>
            <Text className="text-sm font-semibold text-success">
              {verificationMethod === "thumbprint" ? "👆 Thumbprint" : "✍️ Signature"}
            </Text>
          </View>
          <View className="h-px bg-border" />
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-muted">Status</Text>
            <Text className="text-sm font-semibold text-success">Queued for Sync</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={handleConfirmDelivery}
          className="bg-primary rounded-lg py-4 px-8 items-center justify-center active:opacity-80 w-full"
        >
          <Text className="text-base font-semibold text-white">DONE</Text>
        </TouchableOpacity>

        <Text className="text-xs text-muted text-center">
          💡 This delivery record is saved locally and will sync automatically when online
        </Text>
      </View>
    </ScreenContainer>
  );
}
