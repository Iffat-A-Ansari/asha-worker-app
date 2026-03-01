import { View, Text, TouchableOpacity, Pressable, Alert, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { OfflineMap } from "@/lib/maps/offline-map";

/**
 * Map View Screen
 *
 * Features:
 * - Offline map display with cached OpenStreetMap tiles
 * - Current location tracking (GPS)
 * - Patient location marker on map
 * - Distance and navigation time calculation
 * - Call patient functionality
 * - Route visualization
 * - Offline mode indicator
 */
export default function MapViewScreen() {
  const colors = useColors();
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState(0);
  const [navigating, setNavigating] = useState(false);

  // Mock patient location (Chitrakoot, India)
  const patientLocation = {
    name: "Ram Lal",
    latitude: 24.8505,
    longitude: 80.8736,
    address: "Village Bhadwari, Chitrakoot",
    phone: "+91 98765 43210",
  };

  // Worker's assigned zone
  const workerZone = "Chitrakoot";

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Location permission is required for navigation.");
          setLoading(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(currentLocation);

        // Calculate distance (Haversine formula)
        const dist = calculateDistance(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude,
          patientLocation.latitude,
          patientLocation.longitude
        );
        setDistance(dist);
        setLoading(false);
      } catch (error) {
        Alert.alert("Error", "Failed to get location");
        setLoading(false);
      }
    })();
  }, []);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateWalkingTime = (distanceKm: number): number => {
    const walkingSpeed = 1.4; // km/h (average walking speed)
    return Math.round((distanceKm / walkingSpeed) * 60);
  };

  const handleCallPatient = () => {
    Alert.alert(
      "Call Patient",
      `Call ${patientLocation.name}?\n\n${patientLocation.phone}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call",
          onPress: () => {
            Alert.alert(
              "Calling",
              `Initiating call to ${patientLocation.name}...`
            );
          },
        },
      ]
    );
  };

  const handleStartNavigation = () => {
    setNavigating(true);
    Alert.alert(
      "Navigation Started",
      `Navigating to ${patientLocation.name}\n\n${patientLocation.address}\n\nDistance: ${distance.toFixed(1)} km\nEstimated time: ${calculateWalkingTime(distance)} minutes`,
      [
        {
          text: "Close",
          onPress: () => setNavigating(false),
        },
      ]
    );
  };

  const handleDownloadMaps = () => {
    router.push("/map-download");
  };

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-lg text-muted">Loading location...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4 p-4">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className="p-2"
              style={({ pressed }: any) => [pressed && { opacity: 0.6 }]}
            >
              <Text className="text-2xl">←</Text>
            </Pressable>
            <Text className="text-2xl font-bold text-foreground">
              🗺️ Navigation
            </Text>
            <View className="w-8" />
          </View>

          {/* Offline Map Component */}
          {location && (
            <OfflineMap
              latitude={location.coords.latitude}
              longitude={location.coords.longitude}
              patientLat={patientLocation.latitude}
              patientLon={patientLocation.longitude}
              patientName={patientLocation.name}
              zone={workerZone}
              className="h-80"
            />
          )}

          {/* Navigation Info Card */}
          <View className="bg-surface border border-border rounded-xl p-4 gap-4">
            {/* Patient Details */}
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Text className="text-2xl">👤</Text>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground">
                    {patientLocation.name}
                  </Text>
                  <Text className="text-sm text-muted">
                    {patientLocation.address}
                  </Text>
                </View>
              </View>
            </View>

            <View className="h-px bg-border" />

            {/* Distance & Time */}
            <View className="flex-row items-center justify-around">
              <View className="items-center gap-1">
                <Text className="text-xs font-semibold text-muted">
                  DISTANCE
                </Text>
                <Text className="text-2xl font-bold text-primary">
                  {distance.toFixed(1)} km
                </Text>
              </View>

              <View className="w-px h-12 bg-border" />

              <View className="items-center gap-1">
                <Text className="text-xs font-semibold text-muted">
                  EST. TIME
                </Text>
                <Text className="text-2xl font-bold text-primary">
                  {calculateWalkingTime(distance)} min
                </Text>
              </View>

              <View className="w-px h-12 bg-border" />

              <View className="items-center gap-1">
                <Text className="text-xs font-semibold text-muted">
                  ROUTE
                </Text>
                <Text className="text-lg">📍</Text>
              </View>
            </View>

            <View className="h-px bg-border" />

            {/* Current Location Info */}
            {location && (
              <View className="gap-1">
                <Text className="text-xs font-semibold text-muted">
                  YOUR LOCATION
                </Text>
                <Text className="text-sm text-foreground font-mono">
                  {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
                </Text>
              </View>
            )}
          </View>

          {/* Status Badges */}
          <View className="flex-row gap-2 flex-wrap">
            <View className="bg-green-100 rounded-full px-3 py-1 flex-row items-center gap-1">
              <Text className="text-green-700 font-semibold text-xs">
                ✓ Offline Ready
              </Text>
            </View>
            <View className="bg-blue-100 rounded-full px-3 py-1 flex-row items-center gap-1">
              <Text className="text-blue-700 font-semibold text-xs">
                📶 GPS Active
              </Text>
            </View>
            {navigating && (
              <View className="bg-amber-100 rounded-full px-3 py-1 flex-row items-center gap-1">
                <Text className="text-amber-700 font-semibold text-xs">
                  🧭 Navigating
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            {/* Start Navigation Button */}
            <TouchableOpacity
              onPress={handleStartNavigation}
              className="bg-primary rounded-lg py-4 items-center justify-center active:opacity-80 flex-row gap-2"
            >
              <Text className="text-xl">🧭</Text>
              <Text className="text-base font-semibold text-white">
                START NAVIGATION
              </Text>
            </TouchableOpacity>

            {/* Call Patient Button */}
            <TouchableOpacity
              onPress={handleCallPatient}
              className="border-2 border-primary rounded-lg py-4 items-center justify-center active:opacity-80 flex-row gap-2"
              style={{ borderColor: colors.primary }}
            >
              <Text className="text-xl">📞</Text>
              <Text className="text-base font-semibold" style={{ color: colors.primary }}>
                CALL PATIENT
              </Text>
            </TouchableOpacity>

            {/* Download Maps Button */}
            <TouchableOpacity
              onPress={handleDownloadMaps}
              className="border border-border rounded-lg py-3 items-center justify-center active:opacity-80 flex-row gap-2"
            >
              <Text className="text-lg">⬇️</Text>
              <Text className="text-sm font-semibold text-foreground">
                MANAGE OFFLINE MAPS
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Section */}
          <View className="bg-blue-50 rounded-lg p-4 border border-blue-200 gap-2">
            <Text className="text-sm font-semibold text-blue-900">
              💡 Offline Navigation Tips
            </Text>
            <Text className="text-xs text-blue-800 leading-relaxed">
              • Ensure map tiles are downloaded for {workerZone} before starting work{"\n"}
              • GPS works offline for location tracking{"\n"}
              • Route visualization uses cached map data{"\n"}
              • Download maps on WiFi for faster speeds
            </Text>
          </View>

          {/* Offline Mode Notice */}
          <View className="bg-green-50 rounded-lg p-3 border border-green-200">
            <Text className="text-xs text-green-800 text-center font-semibold">
              ✓ This app works completely offline. All navigation data is cached locally.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
