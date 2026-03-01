import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function SyncScreen() {
  const colors = useColors();

  const pendingItems = [
    { id: 1, type: "Pickup", name: "VIX-45821", status: "pending", timestamp: "Today 10:45 AM" },
    { id: 2, type: "Delivery", name: "VIX-45821", status: "pending", timestamp: "Today 11:20 AM" },
    { id: 3, type: "New Patient", name: "Geeta Singh", status: "pending", timestamp: "Today 12:00 PM" },
    { id: 4, type: "Pickup", name: "VIX-45822", status: "failed", timestamp: "Today 2:15 PM" },
  ];

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1 p-6 gap-4">
        <Text className="text-2xl font-bold text-foreground">Sync Status</Text>

        {/* Status Card */}
        <View className="bg-surface border border-border rounded-lg p-4 gap-2">
          <View className="flex-row items-center gap-2">
            <View className={`w-3 h-3 rounded-full ${true ? "bg-success" : "bg-error"}`} />
            <Text className="text-base font-semibold text-foreground">🟢 ONLINE</Text>
          </View>
          <Text className="text-sm text-muted">Last sync: Today 10:23 AM</Text>
        </View>

        {/* Pending Items Count */}
        <View>
          <Text className="text-lg font-semibold text-foreground mb-3">
            PENDING ITEMS ({pendingItems.length})
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <View className="gap-2">
              {pendingItems.map((item) => (
                <View
                  key={item.id}
                  className="bg-surface border border-border rounded-lg p-4 flex-row items-center justify-between"
                >
                  <View className="flex-1 gap-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm font-medium text-foreground">✓ {item.type}:</Text>
                      <Text className="text-sm font-semibold text-foreground">{item.name}</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Text
                        className="text-xs font-medium"
                        style={{
                          color: item.status === "failed" ? colors.error : colors.warning,
                        }}
                      >
                        ({item.status})
                      </Text>
                      <Text className="text-xs text-muted">{item.timestamp}</Text>
                    </View>
                  </View>
                  {item.status === "failed" && (
                    <TouchableOpacity className="px-3 py-1 bg-error rounded active:opacity-80">
                      <Text className="text-xs font-semibold text-white">Retry</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Sync Button */}
        <TouchableOpacity
          className="bg-primary rounded-lg py-4 items-center justify-center active:opacity-80 flex-row gap-2"
        >
          <IconSymbol name="arrow.clockwise" size={20} color="#ffffff" />
          <Text className="text-base font-semibold text-white">SYNC NOW</Text>
        </TouchableOpacity>

        <Text className="text-xs text-muted text-center">(Will auto-sync when online)</Text>
      </View>
    </ScreenContainer>
  );
}
