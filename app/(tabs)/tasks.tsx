import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function TasksScreen() {
  const colors = useColors();

  const tasks = [
    { id: 1, name: "Ram Lal", distance: 8, priority: "urgent", status: "pending" },
    { id: 2, name: "Geeta Devi", distance: 5, priority: "urgent", status: "pending" },
    { id: 3, name: "Priya Singh", distance: 12, priority: "pending", status: "pending" },
    { id: 4, name: "Rajesh Kumar", distance: 3, priority: "pending", status: "completed" },
    { id: 5, name: "Meera Patel", distance: 15, priority: "ready", status: "pending" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return colors.urgent;
      case "pending":
        return colors.warning;
      case "ready":
        return colors.ready;
      default:
        return colors.muted;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "🔴 URGENT";
      case "pending":
        return "🟡 PENDING";
      case "ready":
        return "🟢 READY";
      default:
        return "UNKNOWN";
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1 p-6 gap-4">
        <Text className="text-2xl font-bold text-foreground">All Tasks</Text>

        <View className="flex-row gap-2">
          {["All", "Urgent", "Pending", "Completed"].map((filter) => (
            <Pressable
              key={filter}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              className="px-4 py-2 bg-surface border border-border rounded-full"
            >
              <Text className="text-sm font-medium text-foreground">{filter}</Text>
            </Pressable>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="gap-3">
            {tasks.map((task) => (
              <Pressable
                key={task.id}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                className="bg-surface border border-border rounded-lg p-4 flex-row items-center justify-between"
              >
                <View className="flex-1 gap-1">
                  <Text className="text-base font-semibold text-foreground">{task.name}</Text>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-sm text-muted">{task.distance} km</Text>
                    <Text className="text-xs font-medium" style={{ color: getPriorityColor(task.priority) }}>
                      {getPriorityLabel(task.priority)}
                    </Text>
                  </View>
                </View>
                <Text className="text-xl">{task.status === "completed" ? "✅" : "⏳"}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
