import { ScrollView, Text, View, Pressable, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import {
  preDownloadTilesForZone,
  getCacheSize,
  getCacheIndex,
  clearZoneCache,
} from "@/lib/maps/tile-cache";
import { cn } from "@/lib/utils";

interface ZoneConfig {
  name: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  description: string;
}

// Common zones in India (example configurations)
const ZONE_CONFIGS: Record<string, ZoneConfig> = {
  chitrakoot: {
    name: "Chitrakoot",
    bounds: {
      north: 25.2,
      south: 24.8,
      east: 80.9,
      west: 80.5,
    },
    description: "Chitrakoot District, Uttar Pradesh",
  },
  varanasi: {
    name: "Varanasi",
    bounds: {
      north: 25.4,
      south: 25.0,
      east: 83.1,
      west: 82.7,
    },
    description: "Varanasi District, Uttar Pradesh",
  },
  agra: {
    name: "Agra",
    bounds: {
      north: 27.3,
      south: 26.9,
      east: 78.3,
      west: 77.9,
    },
    description: "Agra District, Uttar Pradesh",
  },
};

export default function MapDownloadScreen() {
  const router = useRouter();
  const colors = useColors();
  const [downloading, setDownloading] = useState(false);
  const [downloadingZone, setDownloadingZone] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [cacheSize, setCacheSize] = useState(0);
  const [cacheIndex, setCacheIndex] = useState<any>(null);

  const loadCacheInfo = async () => {
    try {
      const size = await getCacheSize();
      const index = await getCacheIndex();
      setCacheSize(size);
      setCacheIndex(index);
    } catch (error) {
      console.error("Failed to load cache info:", error);
    }
  };

  const handleDownloadZone = async (zoneKey: string) => {
    const zone = ZONE_CONFIGS[zoneKey];
    if (!zone) return;

    setDownloading(true);
    setDownloadingZone(zoneKey);
    setProgress(0);
    setTotalProgress(0);

    try {
      const result = await preDownloadTilesForZone(
        zone.name,
        zone.bounds,
        12, // minZoom
        16, // maxZoom
        (current, total) => {
          setProgress(current);
          setTotalProgress(total);
        }
      );

      Alert.alert(
        "Download Complete",
        `Downloaded ${result.tileCount} map tiles for ${zone.name}. Cache size: ${(cacheSize + 25).toFixed(1)} MB`
      );

      await loadCacheInfo();
    } catch (error) {
      Alert.alert(
        "Download Failed",
        `Failed to download tiles for ${zone.name}. Please check your internet connection.`
      );
      console.error("Download error:", error);
    } finally {
      setDownloading(false);
      setDownloadingZone(null);
    }
  };

  const handleClearZone = async (zoneKey: string) => {
    const zone = ZONE_CONFIGS[zoneKey];
    if (!zone) return;

    Alert.alert(
      "Clear Cache",
      `Are you sure you want to delete cached tiles for ${zone.name}?`,
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await clearZoneCache(zone.name);
              await loadCacheInfo();
              Alert.alert("Success", `Cache cleared for ${zone.name}`);
            } catch (error) {
              Alert.alert("Error", "Failed to clear cache");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">
              Map Downloads
            </Text>
            <Pressable
              onPress={() => router.back()}
              className="p-2"
              style={({ pressed }) => [pressed && { opacity: 0.6 }]}
            >
              <Text className="text-lg text-primary">✕</Text>
            </Pressable>
          </View>

          {/* Cache Info Card */}
          <View className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="font-semibold text-blue-900">Cache Status</Text>
              <Text className="text-sm text-blue-700">
                {cacheSize.toFixed(1)} MB
              </Text>
            </View>
            <Text className="text-xs text-blue-800 leading-relaxed">
              Download map tiles for your assigned zones to enable offline navigation. Tiles are cached on your device and used automatically when internet is unavailable.
            </Text>
            <Pressable
              onPress={loadCacheInfo}
              className="mt-3 bg-blue-500 rounded px-3 py-2"
              style={({ pressed }) => [pressed && { opacity: 0.8 }]}
            >
              <Text className="text-white text-xs font-semibold text-center">
                Refresh Cache Info
              </Text>
            </Pressable>
          </View>

          {/* Downloaded Zones */}
          {cacheIndex && Object.keys(cacheIndex.zones).length > 0 && (
            <View className="gap-3">
              <Text className="text-lg font-semibold text-foreground">
                Downloaded Zones
              </Text>
              {Object.entries(cacheIndex.zones).map(([zoneName, zoneInfo]: any) => (
                <View
                  key={zoneName}
                  className="bg-green-50 rounded-lg p-4 border border-green-200"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="font-semibold text-green-900">
                      ✓ {zoneName}
                    </Text>
                    <Text className="text-xs text-green-700">
                      {zoneInfo.tileCount} tiles
                    </Text>
                  </View>
                  <Text className="text-xs text-green-800 mb-3">
                    Downloaded: {new Date(zoneInfo.downloadedAt).toLocaleDateString()}
                  </Text>
                  <Pressable
                    onPress={() => handleClearZone(zoneName.toLowerCase())}
                    className="bg-red-500 rounded px-3 py-2"
                    style={({ pressed }) => [pressed && { opacity: 0.8 }]}
                  >
                    <Text className="text-white text-xs font-semibold text-center">
                      Clear Cache
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {/* Available Zones for Download */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Available Zones
            </Text>

            {Object.entries(ZONE_CONFIGS).map(([key, zone]) => {
              const isDownloaded = cacheIndex?.zones[zone.name];
              const isDownloading = downloadingZone === key;

              return (
                <View
                  key={key}
                  className={cn(
                    "rounded-lg p-4 border",
                    isDownloaded
                      ? "bg-green-50 border-green-200"
                      : "bg-surface border-border"
                  )}
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground">
                        {zone.name}
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        {zone.description}
                      </Text>
                    </View>
                    {isDownloaded && (
                      <Text className="text-lg">✓</Text>
                    )}
                  </View>

                  {isDownloading && totalProgress > 0 && (
                    <View className="mb-3">
                      <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-xs text-muted">
                          Downloading...
                        </Text>
                        <Text className="text-xs text-muted">
                          {progress}/{totalProgress}
                        </Text>
                      </View>
                      <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <View
                          className="h-full bg-primary"
                          style={{
                            width: `${(progress / totalProgress) * 100}%`,
                          }}
                        />
                      </View>
                    </View>
                  )}

                  <Pressable
                    onPress={() => handleDownloadZone(key)}
                    disabled={downloading || isDownloaded}
                    className={cn(
                      "rounded py-2 px-4",
                      isDownloaded
                        ? "bg-gray-300"
                        : isDownloading
                          ? "bg-yellow-500"
                          : "bg-primary"
                    )}
                    style={({ pressed }) => [pressed && { opacity: 0.8 }]}
                  >
                    <View className="flex-row items-center justify-center gap-2">
                      {isDownloading && (
                        <ActivityIndicator size="small" color="white" />
                      )}
                      <Text className="text-white font-semibold text-center">
                        {isDownloaded
                          ? "Downloaded"
                          : isDownloading
                            ? "Downloading..."
                            : "Download Maps"}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              );
            })}
          </View>

          {/* Info Section */}
          <View className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <Text className="text-sm font-semibold text-amber-900 mb-2">
              ⚠️ Storage Requirements
            </Text>
            <Text className="text-xs text-amber-800 leading-relaxed">
              Each zone requires approximately 50-100 MB of storage. Ensure you have sufficient device storage before downloading. Tiles are cached locally and can be deleted anytime.
            </Text>
          </View>

          {/* Tips Section */}
          <View className="bg-green-50 rounded-lg p-4 border border-green-200">
            <Text className="text-sm font-semibold text-green-900 mb-2">
              💡 Tips
            </Text>
            <Text className="text-xs text-green-800 leading-relaxed">
              • Download maps while connected to WiFi for faster speeds{"\n"}
              • Pre-download your assigned zone before starting work{"\n"}
              • Offline maps work without internet connectivity{"\n"}
              • Cache is automatically used when offline
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
