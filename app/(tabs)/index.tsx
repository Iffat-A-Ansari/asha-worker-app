import { ScrollView, Text, View, TouchableOpacity, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

/**
 * Home Dashboard - Main screen for ASHA workers
 * 
 * Displays:
 * - Greeting and current zone
 * - Network status and pending sync count
 * - Task summary cards (Urgent, Pending, Ready)
 * - Quick action buttons
 */
export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(5);
  const [workerName, setWorkerName] = useState("Sunita");
  const [zone, setZone] = useState("Chitrakoot");

  // Mock data for task summary
  const taskSummary = {
    urgent: { count: 2, label: "URGENT" },
    pending: { count: 5, label: "PENDING", completed: 3 },
    ready: { count: 3, label: "READY AT CLINIC" },
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-6 gap-6">
          {/* Header Section */}
          <View className="gap-1">
            <Text className="text-lg text-muted">9:41 AM</Text>
            <Text className="text-3xl font-bold text-foreground">Hi, {workerName} Ji</Text>
            <Text className="text-base text-muted">Zone: {zone}</Text>
          </View>

          {/* Status Bar */}
          <View className="flex-row gap-3 items-center">
            <View className="flex-row items-center gap-2 flex-1 bg-surface rounded-lg px-4 py-3 border border-border">
              <View className={`w-3 h-3 rounded-full ${isOnline ? "bg-success" : "bg-error"}`} />
              <Text className="text-sm font-medium text-foreground">
                {isOnline ? "🟢 ONLINE" : "🔴 OFFLINE"}
              </Text>
            </View>
            <View className="flex-row items-center gap-2 bg-surface rounded-lg px-4 py-3 border border-border">
              <IconSymbol name="arrow.clockwise" size={16} color={colors.warning} />
              <Text className="text-sm font-medium text-foreground">{pendingSyncCount}</Text>
            </View>
          </View>

          {/* TODAY'S TASKS Title */}
          <Text className="text-lg font-semibold text-foreground mt-2">TODAY'S TASKS</Text>

          {/* Urgent Tasks Card */}
          <Pressable
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            className="bg-surface border border-border rounded-xl p-5 gap-3"
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl">🔴</Text>
              <Text className="text-lg font-semibold text-foreground">
                URGENT ({taskSummary.urgent.count})
              </Text>
            </View>
            <View className="gap-2 ml-8">
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-foreground">Ram Lal (8km)</Text>
                <Text className="text-sm text-muted">⏳</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-foreground">Geeta Devi (5km)</Text>
                <Text className="text-sm text-muted">⏳</Text>
              </View>
            </View>
          </Pressable>

          {/* Pending Tasks Card */}
          <Pressable
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            className="bg-surface border border-border rounded-xl p-5 gap-3"
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl">🟡</Text>
              <Text className="text-lg font-semibold text-foreground">
                PENDING ({taskSummary.pending.count})
              </Text>
            </View>
            <View className="gap-2 ml-8">
              <Text className="text-base text-foreground">
                ✅ {taskSummary.pending.completed} Completed Today
              </Text>
              <Text className="text-base text-foreground">
                ⏳ {taskSummary.pending.count - taskSummary.pending.completed} Remaining
              </Text>
            </View>
          </Pressable>

          {/* Ready at Clinic Card */}
          <Pressable
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            className="bg-surface border border-border rounded-xl p-5 gap-3"
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl">🟢</Text>
              <Text className="text-lg font-semibold text-foreground">
                READY AT CLINIC ({taskSummary.ready.count})
              </Text>
            </View>
            <View className="gap-2 ml-8">
              <Text className="text-base text-foreground">Pick up before 5pm</Text>
            </View>
          </Pressable>

          {/* Quick Action Buttons */}
          <View className="gap-3 mt-4">
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => router.push("../qr-scanner")}
                className="flex-1 bg-primary rounded-lg py-4 items-center justify-center active:opacity-80"
              >
                <View className="gap-2 items-center">
                  <IconSymbol name="qrcode" size={24} color="#ffffff" />
                  <Text className="text-sm font-semibold text-white">SCAN QR</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("../map-view")}
                className="flex-1 bg-primary rounded-lg py-4 items-center justify-center active:opacity-80"
              >
                <View className="gap-2 items-center">
                  <IconSymbol name="map.fill" size={24} color="#ffffff" />
                  <Text className="text-sm font-semibold text-white">MAP VIEW</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-primary rounded-lg py-4 items-center justify-center active:opacity-80"
              >
                <View className="gap-2 items-center">
                  <IconSymbol name="checklist" size={24} color="#ffffff" />
                  <Text className="text-sm font-semibold text-white">ALL TASKS</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-primary rounded-lg py-4 items-center justify-center active:opacity-80"
              >
                <View className="gap-2 items-center">
                  <IconSymbol name="person.fill" size={24} color="#ffffff" />
                  <Text className="text-sm font-semibold text-white">PROFILE</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
