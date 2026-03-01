import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

/**
 * Offline Map Tile Cache Service
 * Manages downloading, caching, and serving OpenStreetMap tiles for offline navigation
 */

const TILE_CACHE_DIR = `${FileSystem.documentDirectory}map-tiles`;
const TILE_INDEX_FILE = `${FileSystem.documentDirectory}map-tiles/index.json`;
const OSM_TILE_URL = "https://tile.openstreetmap.org";

export interface TileCacheInfo {
  zone: string;
  minZoom: number;
  maxZoom: number;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  downloadedAt: string;
  tileCount: number;
}

export interface CacheIndex {
  zones: Record<string, TileCacheInfo>;
  lastUpdated: string;
}

/**
 * Initialize tile cache directory
 */
export async function initializeTileCache(): Promise<void> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(TILE_CACHE_DIR || "");
    if (!dirInfo?.exists) {
      await FileSystem.makeDirectoryAsync(TILE_CACHE_DIR, {
        intermediates: true,
      });
      console.log("✅ Tile cache directory created");
    }

    // Initialize index file if it doesn't exist
    const indexInfo = await FileSystem.getInfoAsync(TILE_INDEX_FILE || "");
    if (!indexInfo?.exists) {
      const initialIndex: CacheIndex = {
        zones: {},
        lastUpdated: new Date().toISOString(),
      };
      await FileSystem.writeAsStringAsync(
        TILE_INDEX_FILE,
        JSON.stringify(initialIndex, null, 2)
      );
      console.log("✅ Tile cache index created");
    }
  } catch (error) {
    console.error("❌ Failed to initialize tile cache:", error);
  }
}

/**
 * Get cached tile URL or download if not available
 */
export async function getTileUrl(
  z: number,
  x: number,
  y: number,
  zone: string = "default"
): Promise<string> {
  try {
    const tilePath = `${TILE_CACHE_DIR}/${zone}/${z}/${x}/${y}.png`;
    const tileInfo = await FileSystem.getInfoAsync(tilePath || "");

    if (tileInfo?.exists) {
      // Return cached tile
      return `file://${tilePath}`;
    }

    // Try to download tile if online
    if (Platform.OS !== "web") {
      try {
        await downloadTile(z, x, y, zone);
        return `file://${tilePath}`;
      } catch (downloadError) {
        console.warn(`Failed to download tile ${z}/${x}/${y}:`, downloadError);
        // Return placeholder or fallback
        return `${OSM_TILE_URL}/${z}/${x}/${y}.png`;
      }
    }

    return `${OSM_TILE_URL}/${z}/${x}/${y}.png`;
  } catch (error) {
    console.error("Error getting tile URL:", error);
    return `${OSM_TILE_URL}/${z}/${x}/${y}.png`;
  }
}

/**
 * Download a single tile
 */
async function downloadTile(
  z: number,
  x: number,
  y: number,
  zone: string = "default"
): Promise<void> {
  const tileUrl = `${OSM_TILE_URL}/${z}/${x}/${y}.png`;
  const tilePath = `${TILE_CACHE_DIR}/${zone}/${z}/${x}/${y}.png`;

  try {
    // Create directory structure
    const tileDir = `${TILE_CACHE_DIR}/${zone}/${z}/${x}`;
    const dirInfo = await FileSystem.getInfoAsync(tileDir || "");
    if (!dirInfo?.exists) {
      await FileSystem.makeDirectoryAsync(tileDir, { intermediates: true });
    }

    // Download tile
    await FileSystem.downloadAsync(tileUrl, tilePath);
    console.log(`✅ Downloaded tile ${z}/${x}/${y}`);
  } catch (error) {
    console.error(`Failed to download tile ${z}/${x}/${y}:`, error);
    throw error;
  }
}

/**
 * Pre-download tiles for a zone (bounding box)
 * This should be called when worker is online to cache tiles for their assigned zone
 */
export async function preDownloadTilesForZone(
  zone: string,
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  },
  minZoom: number = 12,
  maxZoom: number = 16,
  onProgress?: (current: number, total: number) => void
): Promise<TileCacheInfo> {
  try {
    console.log(`🗺️ Starting tile download for zone: ${zone}`);

    let downloadedCount = 0;
    let totalTiles = 0;

    // Calculate tiles to download
    for (let z = minZoom; z <= maxZoom; z++) {
      const { minX, maxX, minY, maxY } = getBoundingTiles(bounds, z);
      totalTiles += (maxX - minX + 1) * (maxY - minY + 1);
    }

    // Download tiles
    for (let z = minZoom; z <= maxZoom; z++) {
      const { minX, maxX, minY, maxY } = getBoundingTiles(bounds, z);

      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          try {
            await downloadTile(z, x, y, zone);
            downloadedCount++;
            onProgress?.(downloadedCount, totalTiles);
          } catch (error) {
            // Continue downloading other tiles even if one fails
            console.warn(`Skipped tile ${z}/${x}/${y}`);
          }
        }
      }
    }

    // Update cache index
    const cacheInfo: TileCacheInfo = {
      zone,
      minZoom,
      maxZoom,
      bounds,
      downloadedAt: new Date().toISOString(),
      tileCount: downloadedCount,
    };

    await updateCacheIndex(zone, cacheInfo);

    console.log(
      `✅ Tile download complete for zone ${zone}: ${downloadedCount} tiles`
    );
    return cacheInfo;
  } catch (error) {
    console.error(`Failed to pre-download tiles for zone ${zone}:`, error);
    throw error;
  }
}

/**
 * Get bounding tiles for a geographic area at a specific zoom level
 */
function getBoundingTiles(
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  },
  zoom: number
): { minX: number; maxX: number; minY: number; maxY: number } {
  const minX = lonToTileX(bounds.west, zoom);
  const maxX = lonToTileX(bounds.east, zoom);
  const minY = latToTileY(bounds.north, zoom);
  const maxY = latToTileY(bounds.south, zoom);

  return {
    minX: Math.max(0, Math.floor(minX)),
    maxX: Math.min((1 << zoom) - 1, Math.ceil(maxX)),
    minY: Math.max(0, Math.floor(minY)),
    maxY: Math.min((1 << zoom) - 1, Math.ceil(maxY)),
  };
}

/**
 * Convert longitude to tile X coordinate
 */
function lonToTileX(lon: number, zoom: number): number {
  return ((lon + 180) / 360) * Math.pow(2, zoom);
}

/**
 * Convert latitude to tile Y coordinate
 */
function latToTileY(lat: number, zoom: number): number {
  const sin = Math.sin((lat * Math.PI) / 180);
  const y2 = Math.log((1 + sin) / (1 - sin)) / (2 * Math.PI);
  return Math.pow(2, zoom) * (0.5 - y2 / 2);
}

/**
 * Update cache index with zone information
 */
async function updateCacheIndex(zone: string, info: TileCacheInfo): Promise<void> {
  try {
    const indexContent = await FileSystem.readAsStringAsync(TILE_INDEX_FILE);
    const index: CacheIndex = JSON.parse(indexContent);

    index.zones[zone] = info;
    index.lastUpdated = new Date().toISOString();

    await FileSystem.writeAsStringAsync(
      TILE_INDEX_FILE,
      JSON.stringify(index, null, 2)
    );
  } catch (error) {
    console.error("Failed to update cache index:", error);
  }
}

/**
 * Get cache index
 */
export async function getCacheIndex(): Promise<CacheIndex> {
  try {
    const content = await FileSystem.readAsStringAsync(TILE_INDEX_FILE);
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to read cache index:", error);
    return { zones: {}, lastUpdated: new Date().toISOString() };
  }
}

/**
 * Get cache size in MB
 */
export async function getCacheSize(): Promise<number> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(TILE_CACHE_DIR || "");
    if (!dirInfo?.exists) return 0;

    // Approximate size based on file count
    // Each tile is roughly 10-50 KB depending on complexity
    const index = await getCacheIndex();
    let totalTiles = 0;

    Object.values(index.zones).forEach((zone) => {
      totalTiles += zone.tileCount;
    });

    // Average tile size: 25 KB
    return (totalTiles * 25) / 1024;
  } catch (error) {
    console.error("Failed to get cache size:", error);
    return 0;
  }
}

/**
 * Clear cache for a specific zone
 */
export async function clearZoneCache(zone: string): Promise<void> {
  try {
    const zoneDir = `${TILE_CACHE_DIR}/${zone}`;
    const dirInfo = await FileSystem.getInfoAsync(zoneDir || "");

    if (dirInfo?.exists) {
      await FileSystem.deleteAsync(zoneDir);
      console.log(`✅ Cleared cache for zone: ${zone}`);
    }

    // Update index
    const index = await getCacheIndex();
    delete index.zones[zone];
    index.lastUpdated = new Date().toISOString();
    await FileSystem.writeAsStringAsync(
      TILE_INDEX_FILE,
      JSON.stringify(index, null, 2)
    );
  } catch (error) {
    console.error(`Failed to clear cache for zone ${zone}:`, error);
  }
}

/**
 * Clear all cached tiles
 */
export async function clearAllCache(): Promise<void> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(TILE_CACHE_DIR);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(TILE_CACHE_DIR);
      await initializeTileCache();
      console.log("✅ Cleared all map tile cache");
    }
  } catch (error) {
    console.error("Failed to clear all cache:", error);
  }
}
