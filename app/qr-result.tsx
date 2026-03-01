import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

/**
 * QR Result Screen
 * Displays scanned QR code data and allows confirmation
 */
export default function QRResultScreen() {
  const colors = useColors();
  const router = useRouter();
  const { qrData } = useLocalSearchParams<{ qrData: string }>();

  // Mock medicine data based on QR code
  const medicineData = {
    id: qrData || "VIX-45821",
    name: "Vitamin D3 Supplement",
    batch: "BATCH-2024-001",
    expiry: "2025-12-31",
    quantity: 30,
    unit: "tablets",
    patient: "Ram Lal",
    patientId: "PAT-001",
    pickupDate: "2024-02-26",
    status: "Ready for Pickup",
  };

  const handleConfirm = () => {
    // Navigate to delivery confirmation
    router.push("../delivery-confirmation");
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-6 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-2xl">←</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-foreground">QR Verified</Text>
            <View className="w-6" />
          </View>

          {/* Success Badge */}
          <View className="items-center gap-2">
            <View className="w-16 h-16 rounded-full bg-success/20 items-center justify-center">
              <Text className="text-4xl">✓</Text>
            </View>
            <Text className="text-lg font-semibold text-success">QR Code Valid</Text>
          </View>

          {/* Medicine Details Card */}
          <View className="bg-surface border border-border rounded-xl p-5 gap-4">
            <View className="gap-2">
              <Text className="text-xs font-semibold text-muted">MEDICINE ID</Text>
              <Text className="text-2xl font-bold text-foreground">{medicineData.id}</Text>
            </View>

            <View className="h-px bg-border" />

            <View className="gap-2">
              <Text className="text-xs font-semibold text-muted">MEDICINE NAME</Text>
              <Text className="text-base font-semibold text-foreground">{medicineData.name}</Text>
            </View>

            <View className="gap-2">
              <Text className="text-xs font-semibold text-muted">BATCH & EXPIRY</Text>
              <Text className="text-sm text-foreground">
                {medicineData.batch} • Exp: {medicineData.expiry}
              </Text>
            </View>

            <View className="gap-2">
              <Text className="text-xs font-semibold text-muted">QUANTITY</Text>
              <Text className="text-base text-foreground">
                {medicineData.quantity} {medicineData.unit}
              </Text>
            </View>
          </View>

          {/* Patient Information */}
          <View className="bg-surface border border-border rounded-xl p-5 gap-3">
            <Text className="text-lg font-semibold text-foreground">Patient Information</Text>
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-muted">Name:</Text>
                <Text className="text-base font-semibold text-foreground">{medicineData.patient}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-muted">ID:</Text>
                <Text className="text-base font-semibold text-foreground">{medicineData.patientId}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-muted">Pickup Date:</Text>
                <Text className="text-base font-semibold text-foreground">{medicineData.pickupDate}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 mt-4">
            <TouchableOpacity
              onPress={handleConfirm}
              className="bg-primary rounded-lg py-4 items-center justify-center active:opacity-80"
            >
              <View className="flex-row items-center gap-2">
                <IconSymbol name="checkmark" size={20} color="#ffffff" />
                <Text className="text-base font-semibold text-white">Confirm & Proceed</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              className="border border-border rounded-lg py-4 items-center justify-center active:opacity-80"
            >
              <Text className="text-base font-semibold text-foreground">Scan Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
