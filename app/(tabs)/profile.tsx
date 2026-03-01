import { ScrollView, Text, View, TouchableOpacity, Switch } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ProfileScreen() {
  const colors = useColors();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const workerInfo = {
    name: "Sunita Sharma",
    ashaId: "ASHA-2024-001",
    phone: "+91 98765 43210",
    zone: "Chitrakoot",
    villages: ["Bhadwari", "Ranipur", "Khajuraho", "Panna"],
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-6 gap-6">
          {/* Profile Header */}
          <View className="items-center gap-4">
            <View className="w-24 h-24 rounded-full bg-primary items-center justify-center">
              <IconSymbol name="person.fill" size={48} color="#ffffff" />
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-foreground">{workerInfo.name}</Text>
              <Text className="text-sm text-muted">{workerInfo.ashaId}</Text>
            </View>
          </View>

          {/* Worker Information */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Worker Information</Text>

            <View className="bg-surface border border-border rounded-lg p-4 gap-3">
              <View className="gap-1">
                <Text className="text-xs font-semibold text-muted">PHONE</Text>
                <Text className="text-base text-foreground">{workerInfo.phone}</Text>
              </View>
              <View className="h-px bg-border" />
              <View className="gap-1">
                <Text className="text-xs font-semibold text-muted">ASSIGNED ZONE</Text>
                <Text className="text-base text-foreground">{workerInfo.zone}</Text>
              </View>
            </View>
          </View>

          {/* Assigned Villages */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Assigned Villages</Text>
            <View className="bg-surface border border-border rounded-lg p-4 gap-2">
              {workerInfo.villages.map((village, index) => (
                <View key={index}>
                  <Text className="text-base text-foreground">• {village}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Settings */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Settings</Text>

            <View className="bg-surface border border-border rounded-lg p-4 gap-4">
              {/* Language */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <IconSymbol name="paperplane.fill" size={20} color={colors.primary} />
                  <Text className="text-base text-foreground">Language</Text>
                </View>
                <Text className="text-sm text-muted">Hindi</Text>
              </View>

              <View className="h-px bg-border" />

              {/* Dark Mode */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <IconSymbol name="paperplane.fill" size={20} color={colors.primary} />
                  <Text className="text-base text-foreground">Dark Mode</Text>
                </View>
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={darkMode ? colors.primary : colors.muted}
                />
              </View>

              <View className="h-px bg-border" />

              {/* Notifications */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <IconSymbol name="paperplane.fill" size={20} color={colors.primary} />
                  <Text className="text-base text-foreground">Notifications</Text>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={notifications ? colors.primary : colors.muted}
                />
              </View>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            className="bg-error rounded-lg py-4 items-center justify-center active:opacity-80 mt-4"
          >
            <Text className="text-base font-semibold text-white">LOGOUT</Text>
          </TouchableOpacity>

          <Text className="text-xs text-muted text-center">App Version 1.0.0</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
