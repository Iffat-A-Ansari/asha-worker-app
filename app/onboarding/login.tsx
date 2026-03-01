import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Pressable } from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

/**
 * Login Screen
 * Phone number + OTP verification for ASHA workers
 */
export default function LoginScreen() {
  const colors = useColors();
  const router = useRouter();
  const { language } = useLocalSearchParams<{ language: string }>();
  const [step, setStep] = useState<"phone" | "otp" | "profile">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [workerName, setWorkerName] = useState("");
  const [zone, setZone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert("Invalid Phone", "Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert("OTP Sent", `OTP sent to +91 ${phoneNumber}`, [
        {
          text: "OK",
          onPress: () => setStep("otp"),
        },
      ]);
    }, 1000);
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert("Invalid OTP", "Please enter a valid OTP");
      return;
    }

    setLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      setStep("profile");
    }, 1000);
  };

  const handleCompleteProfile = async () => {
    if (!workerName || !zone) {
      Alert.alert("Missing Info", "Please fill in all fields");
      return;
    }

    setLoading(true);
    // Simulate profile creation
    setTimeout(() => {
      setLoading(false);
      // Navigate to home
      router.replace("/(tabs)");
    }, 1000);
  };

  if (step === "phone") {
    return (
      <ScreenContainer className="bg-background" edges={["top", "left", "right", "bottom"]}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="flex-1 p-6 gap-8 justify-between">
            {/* Header */}
            <View className="gap-4 items-center">
              <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center">
                <Text className="text-4xl">📱</Text>
              </View>
              <View className="gap-2 items-center">
                <Text className="text-3xl font-bold text-foreground">Enter Phone Number</Text>
                <Text className="text-base text-muted text-center">
                  We'll send you an OTP to verify your account
                </Text>
              </View>
            </View>

            {/* Phone Input */}
            <View className="gap-4">
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Phone Number</Text>
                <View className="flex-row items-center border border-border rounded-lg px-4 py-3 gap-2">
                  <Text className="text-lg text-foreground">+91</Text>
                  <TextInput
                    placeholder="98765 43210"
                    placeholderTextColor={colors.muted}
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    className="flex-1 text-base text-foreground"
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleRequestOTP}
                disabled={loading}
                className={`rounded-lg py-4 items-center justify-center ${
                  loading ? "opacity-50" : "active:opacity-80"
                } ${phoneNumber.length === 10 ? "bg-primary" : "bg-muted"}`}
              >
                <Text className={`text-base font-semibold ${phoneNumber.length === 10 ? "text-white" : "text-foreground"}`}>
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Offline Mode Note */}
            <View className="bg-warning/10 border border-warning rounded-lg p-4">
              <Text className="text-sm text-warning font-semibold">💡 Offline Mode Available</Text>
              <Text className="text-xs text-warning mt-1">
                If you don't have internet, you can log in with your saved credentials
              </Text>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (step === "otp") {
    return (
      <ScreenContainer className="bg-background" edges={["top", "left", "right", "bottom"]}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="flex-1 p-6 gap-8 justify-between">
            {/* Header */}
            <View className="gap-4 items-center">
              <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center">
                <Text className="text-4xl">🔐</Text>
              </View>
              <View className="gap-2 items-center">
                <Text className="text-3xl font-bold text-foreground">Enter OTP</Text>
                <Text className="text-base text-muted text-center">
                  We sent a code to +91 {phoneNumber}
                </Text>
              </View>
            </View>

            {/* OTP Input */}
            <View className="gap-4">
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">OTP Code</Text>
                <TextInput
                  placeholder="0000"
                  placeholderTextColor={colors.muted}
                  keyboardType="number-pad"
                  maxLength={4}
                  value={otp}
                  onChangeText={setOtp}
                  className="border border-border rounded-lg px-4 py-3 text-2xl text-center text-foreground font-bold"
                />
              </View>

              <TouchableOpacity
                onPress={handleVerifyOTP}
                disabled={loading}
                className={`rounded-lg py-4 items-center justify-center ${
                  loading ? "opacity-50" : "active:opacity-80"
                } ${otp.length === 4 ? "bg-primary" : "bg-muted"}`}
              >
                <Text className={`text-base font-semibold ${otp.length === 4 ? "text-white" : "text-foreground"}`}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setStep("phone")} className="items-center py-2">
                <Text className="text-sm text-primary font-semibold">Change Phone Number</Text>
              </TouchableOpacity>
            </View>

            <View />
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background" edges={["top", "left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-6 gap-8 justify-between">
          {/* Header */}
          <View className="gap-4 items-center">
            <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center">
              <Text className="text-4xl">👤</Text>
            </View>
            <View className="gap-2 items-center">
              <Text className="text-3xl font-bold text-foreground">Complete Profile</Text>
              <Text className="text-base text-muted text-center">
                Tell us about yourself
              </Text>
            </View>
          </View>

          {/* Profile Form */}
          <View className="gap-4">
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Full Name</Text>
              <TextInput
                placeholder="Enter your name"
                placeholderTextColor={colors.muted}
                value={workerName}
                onChangeText={setWorkerName}
                className="border border-border rounded-lg px-4 py-3 text-base text-foreground"
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Zone / Area</Text>
              <TextInput
                placeholder="e.g., Chitrakoot, Satna"
                placeholderTextColor={colors.muted}
                value={zone}
                onChangeText={setZone}
                className="border border-border rounded-lg px-4 py-3 text-base text-foreground"
              />
            </View>

            <TouchableOpacity
              onPress={handleCompleteProfile}
              disabled={loading}
              className={`rounded-lg py-4 items-center justify-center ${
                loading ? "opacity-50" : "active:opacity-80"
              } ${workerName && zone ? "bg-primary" : "bg-muted"}`}
            >
              <Text className={`text-base font-semibold ${workerName && zone ? "text-white" : "text-foreground"}`}>
                {loading ? "Creating Account..." : "Complete Setup"}
              </Text>
            </TouchableOpacity>
          </View>

          <View />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
