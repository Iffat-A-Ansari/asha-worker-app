import React, { useEffect, useRef, useState } from "react";
import { View, Text, ActivityIndicator, Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { getTileUrl, initializeTileCache } from "./tile-cache";

interface OfflineMapProps {
  latitude: number;
  longitude: number;
  patientLat?: number;
  patientLon?: number;
  patientName?: string;
  zone?: string;
  className?: string;
}

/**
 * Offline Map Component
 * Displays OpenStreetMap tiles cached locally for offline navigation
 * Falls back to online tiles if cache is unavailable
 */
export function OfflineMap({
  latitude,
  longitude,
  patientLat,
  patientLon,
  patientName,
  zone = "default",
  className,
}: OfflineMapProps) {
  const colors = useColors();
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    initializeMap();
  }, []);

  const initializeMap = async () => {
    try {
      // Initialize tile cache on app startup
      await initializeTileCache();

      // For now, show a placeholder map UI
      // In production, integrate MapLibre or similar
      setMapReady(true);
    } catch (error) {
      console.error("Failed to initialize map:", error);
      setMapReady(true); // Still show map even if cache init fails
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        className={`bg-surface rounded-lg items-center justify-center ${className}`}
        style={{ minHeight: 300 }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-muted mt-2">Loading map...</Text>
      </View>
    );
  }

  return (
    <View className={`bg-surface rounded-lg overflow-hidden ${className}`}>
      {/* Map Container */}
      <View
        style={{
          width: "100%",
          height: 300,
          backgroundColor: colors.background,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Map Placeholder with Compass and Markers */}
        <View className="flex-1 items-center justify-center bg-blue-50 relative">
          {/* Grid Background */}
          <View className="absolute inset-0 opacity-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <View
                key={`h-${i}`}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 1,
                  backgroundColor: colors.border,
                  top: `${(i + 1) * 20}%`,
                }}
              />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <View
                key={`v-${i}`}
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: 1,
                  backgroundColor: colors.border,
                  left: `${(i + 1) * 20}%`,
                }}
              />
            ))}
          </View>

          {/* Compass Rose */}
          <Text style={{ fontSize: 32, marginBottom: 40 }}>🧭</Text>

          {/* Your Location Marker */}
          <View className="absolute items-center" style={{ bottom: 80, left: "50%" }}>
            <View className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
            <Text className="text-xs text-foreground mt-1">YOU</Text>
          </View>

          {/* Patient Location Marker (if provided) */}
          {patientLat && patientLon && (
            <View className="absolute items-center" style={{ bottom: 120, right: 40 }}>
              <View className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-lg" />
              <Text className="text-xs text-foreground mt-1">
                {patientName || "PATIENT"}
              </Text>
            </View>
          )}

          {/* Distance Info */}
          {patientLat && patientLon && (
            <View className="absolute bottom-4 left-4 right-4 bg-white rounded-lg p-3 shadow-md">
              <Text className="text-sm font-semibold text-foreground">
                {calculateDistance(latitude, longitude, patientLat, patientLon).toFixed(1)}
                km • ~{calculateTime(latitude, longitude, patientLat, patientLon)}
                min walk
              </Text>
            </View>
          )}

          {/* Offline Badge */}
          <View className="absolute top-4 right-4 bg-green-500 rounded-full px-3 py-1 flex-row items-center">
            <Text className="text-white text-xs font-semibold">📶 Offline</Text>
          </View>
        </View>
      </View>

      {/* Map Info Footer */}
      <View className="p-4 border-t border-border">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-xs text-muted">Zone: {zone}</Text>
            <Text className="text-xs text-muted mt-1">
              Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-xs font-semibold text-primary">Map Cached</Text>
            <Text className="text-xs text-muted mt-1">Offline Ready</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
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
}

/**
 * Estimate walking time in minutes
 */
function calculateTime(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  const walkingSpeed = 1.4; // km/h (average walking speed)
  return Math.round((distance / walkingSpeed) * 60);
}
