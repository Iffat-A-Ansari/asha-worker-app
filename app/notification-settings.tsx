import { ScrollView, Text, View, Switch, Pressable, Alert } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import * as Notifications from "expo-notifications";
import { cn } from "@/lib/utils";

interface NotificationSettings {
  taskAlerts: boolean;
  deliveryReminders: boolean;
  syncUpdates: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  pushToken: string | null;
}

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const [settings, setSettings] = useState<NotificationSettings>({
    taskAlerts: true,
    deliveryReminders: true,
    syncUpdates: true,
    soundEnabled: true,
    vibrationEnabled: true,
    pushToken: null,
  });
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>("unknown");

  useEffect(() => {
    const initializeSettings = async () => {
      await loadSettings();
      await checkPermissionStatus();
    };
    initializeSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // In production, load from AsyncStorage or database
      const token = await getPushToken();
      setSettings((prev) => ({
        ...prev,
        pushToken: token,
      }));
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const checkPermissionStatus = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status as string);
    } catch (error) {
      console.error("Failed to check permission status:", error);
    }
  };

  const getPushToken = async (): Promise<string | null> => {
    try {
      const token = await Notifications.getExpoPushTokenAsync();
      return token.data;
    } catch (error) {
      console.error("Failed to get push token:", error);
      return null;
    }
  };

  const requestPermissions = async () => {
    setLoading(true);
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionStatus(status);

      if (status === "granted") {
        const token = await getPushToken();
        setSettings((prev) => ({ ...prev, pushToken: token }));
        Alert.alert("Success", "Notification permissions granted!");
      } else {
        Alert.alert(
          "Permission Denied",
          "Notification permissions were not granted."
        );
      }
    } catch (error) {
      console.error("Failed to request permissions:", error);
      Alert.alert("Error", "Failed to request notification permissions");
    } finally {
      setLoading(false);
    }
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const sendTestNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test Notification",
          body: "This is a test notification from ASHA Worker App",
          data: { type: "test" },
          sound: settings.soundEnabled ? "default" : undefined,
          badge: 1,
        },
        trigger: null,
      });
      Alert.alert("Success", "Test notification sent!");
    } catch (error) {
      console.error("Failed to send test notification:", error);
      Alert.alert("Error", "Failed to send test notification");
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">
              Notifications
            </Text>
            <Pressable
              onPress={() => router.back()}
              className="p-2"
              style={({ pressed }) => [pressed && { opacity: 0.6 }]}
            >
              <Text className="text-lg text-primary">✕</Text>
            </Pressable>
          </View>

          {/* Permission Status Card */}
          <View
            className={cn(
              "rounded-lg p-4 border",
              permissionStatus === "granted"
                ? "bg-green-50 border-green-200"
                : "bg-yellow-50 border-yellow-200"
            )}
          >
            <View className="flex-row items-center gap-3">
              <Text
                className={cn(
                  "text-2xl",
                  permissionStatus === "granted" ? "text-green-600" : "text-yellow-600"
                )}
              >
                {permissionStatus === "granted" ? "✓" : "⚠"}
              </Text>
              <View className="flex-1">
                <Text
                  className={cn(
                    "font-semibold",
                    permissionStatus === "granted"
                      ? "text-green-900"
                      : "text-yellow-900"
                  )}
                >
                  {permissionStatus === "granted"
                    ? "Notifications Enabled"
                    : "Notifications Disabled"}
                </Text>
                <Text
                  className={cn(
                    "text-sm mt-1",
                    permissionStatus === "granted"
                      ? "text-green-700"
                      : "text-yellow-700"
                  )}
                >
                  {permissionStatus === "granted"
                    ? "You will receive task alerts and reminders"
                    : "Enable notifications to receive task alerts"}
                </Text>
              </View>
            </View>

            {permissionStatus !== "granted" && (
              <Pressable
                onPress={requestPermissions}
                disabled={loading}
                className="mt-4 bg-primary rounded-lg py-2 px-4"
                style={({ pressed }) => [pressed && { opacity: 0.8 }]}
              >
                <Text className="text-white font-semibold text-center">
                  {loading ? "Requesting..." : "Enable Notifications"}
                </Text>
              </Pressable>
            )}
          </View>

          {/* Push Token Display */}
          {settings.pushToken && (
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-sm font-semibold text-muted mb-2">
                Device Token
              </Text>
              <Text className="text-xs text-muted font-mono break-words">
                {settings.pushToken.substring(0, 20)}...
              </Text>
              <Text className="text-xs text-muted mt-2">
                This token is used to send notifications to your device
              </Text>
            </View>
          )}

          {/* Notification Types */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">
              Notification Types
            </Text>

            {/* Task Alerts */}
            <View className="flex-row items-center justify-between bg-surface rounded-lg p-4 border border-border">
              <View className="flex-1">
                <Text className="font-semibold text-foreground">Task Alerts</Text>
                <Text className="text-sm text-muted mt-1">
                  New task assignments and urgent updates
                </Text>
              </View>
              <Switch
                value={settings.taskAlerts}
                onValueChange={() => toggleSetting("taskAlerts")}
                trackColor={{ false: "#ccc", true: colors.primary }}
              />
            </View>

            {/* Delivery Reminders */}
            <View className="flex-row items-center justify-between bg-surface rounded-lg p-4 border border-border">
              <View className="flex-1">
                <Text className="font-semibold text-foreground">
                  Delivery Reminders
                </Text>
                <Text className="text-sm text-muted mt-1">
                  Reminders for pending deliveries
                </Text>
              </View>
              <Switch
                value={settings.deliveryReminders}
                onValueChange={() => toggleSetting("deliveryReminders")}
                trackColor={{ false: "#ccc", true: colors.primary }}
              />
            </View>

            {/* Sync Updates */}
            <View className="flex-row items-center justify-between bg-surface rounded-lg p-4 border border-border">
              <View className="flex-1">
                <Text className="font-semibold text-foreground">
                  Sync Updates
                </Text>
                <Text className="text-sm text-muted mt-1">
                  Data sync completion and errors
                </Text>
              </View>
              <Switch
                value={settings.syncUpdates}
                onValueChange={() => toggleSetting("syncUpdates")}
                trackColor={{ false: "#ccc", true: colors.primary }}
              />
            </View>
          </View>

          {/* Sound & Vibration */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">
              Sound & Vibration
            </Text>

            {/* Sound */}
            <View className="flex-row items-center justify-between bg-surface rounded-lg p-4 border border-border">
              <View className="flex-1">
                <Text className="font-semibold text-foreground">Sound</Text>
                <Text className="text-sm text-muted mt-1">
                  Play sound for notifications
                </Text>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={() => toggleSetting("soundEnabled")}
                trackColor={{ false: "#ccc", true: colors.primary }}
              />
            </View>

            {/* Vibration */}
            <View className="flex-row items-center justify-between bg-surface rounded-lg p-4 border border-border">
              <View className="flex-1">
                <Text className="font-semibold text-foreground">Vibration</Text>
                <Text className="text-sm text-muted mt-1">
                  Vibrate for notifications
                </Text>
              </View>
              <Switch
                value={settings.vibrationEnabled}
                onValueChange={() => toggleSetting("vibrationEnabled")}
                trackColor={{ false: "#ccc", true: colors.primary }}
              />
            </View>
          </View>

          {/* Test Notification */}
          <Pressable
            onPress={sendTestNotification}
            className="bg-primary rounded-lg py-4 px-6 items-center"
            style={({ pressed }) => [pressed && { opacity: 0.8 }]}
          >
            <Text className="text-white font-semibold text-center">
              Send Test Notification
            </Text>
          </Pressable>

          {/* Info Section */}
          <View className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <Text className="text-sm font-semibold text-blue-900 mb-2">
              ℹ️ About Notifications
            </Text>
            <Text className="text-xs text-blue-800 leading-relaxed">
              Push notifications help you stay updated with new task assignments,
              delivery reminders, and sync status. Notifications work even when the
              app is closed or in the background.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
