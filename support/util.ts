import { readFile, writeFile } from "ags/file";
import app from "ags/gtk3/app";
import Battery from "gi://AstalBattery";
import GLib from "gi://GLib";
import Gdk from "gi://Gdk";

const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB", "PB"];

export function formatBytes(bytes: number): { value: string; unit: string } {
  if (!Number.isFinite(bytes) || bytes < 0 || bytes === 0)
    return { value: "0", unit: "B" };

  const i = Math.max(
    0,
    Math.min(
      BYTE_UNITS.length - 1,
      Math.floor(Math.log(bytes) / Math.log(1024)),
    ),
  );
  const scaled = bytes / Math.pow(1024, i);
  return { value: Math.round(scaled).toString(), unit: BYTE_UNITS[i] };
}

export function readJSONFile(filePath: string): any {
  const data = readFile(filePath);
  if (!data || !data.trim()) return {};
  return JSON.parse(data);
}

export function writeJSONFile(filePath: string, data: any) {
  const dir = filePath.substring(0, filePath.lastIndexOf("/"));
  GLib.mkdir_with_parents(dir, 0o755);
  writeFile(filePath, JSON.stringify(data, null, 4));
}

export const hasNvidiaGpu = GLib.file_test(
  "/proc/driver/nvidia",
  GLib.FileTest.IS_DIR,
);

export const hasBattery = (() => {
  try {
    const device = Battery.get_default();
    return device !== null && device.isPresent === true;
  } catch {
    return false;
  }
})();

export function getDisplayId(monitor: number): string {
  try {
    // Try to get monitor information from GTK
    const display = Gdk.Display.get_default();
    if (display) {
      const monitorObj = display.get_monitor(monitor);
      if (monitorObj) {
        // In GJS, GObject properties are accessed directly, not through getter methods
        // Try different properties that might contain the display identifier
        if (monitorObj.connector) return monitorObj.connector;
        if (monitorObj.model) return monitorObj.model;
        if (monitorObj.manufacturer) return monitorObj.manufacturer;

        // Try alternative property names that might be used in GJS
        if (monitorObj.output) return monitorObj.output;
        if (monitorObj.name) return monitorObj.name;
      }
    }
  } catch (error) {
    console.warn("Failed to get display ID:", error);
  }

  // Fallback to monitor number as string
  return `monitor_${monitor}`;
}

const DISPLAYS_CONFIG_PATH = `${GLib.get_home_dir()}/.config/astal-shell/displays.json`;

let displaysConfig: Record<string, [number, number]> | null = null;

function loadDisplaysConfig(): Record<string, [number, number]> {
  if (displaysConfig !== null) {
    return displaysConfig;
  }

  try {
    displaysConfig = readJSONFile(DISPLAYS_CONFIG_PATH);
  } catch (error) {
    console.warn("Failed to load displays config:", error);
    displaysConfig = {};
  }

  return displaysConfig;
}

export function getAllDisplays(): Record<string, [number, number]> {
  const displays: Record<string, [number, number]> = {};

  const monitors = app.get_monitors();
  const monitorKeys = Object.keys(monitors);

  for (const key of monitorKeys) {
    const monitorNum = Number(key);
    const displayId = getDisplayId(monitorNum);
    displays[displayId] = [300, 100]; // Default margins
  }

  return displays;
}

export function initializeDisplaysConfig(): void {
  try {
    if (readFile(DISPLAYS_CONFIG_PATH) !== "") return;
  } catch {
    // File doesn't exist, continue with initialization
  }

  const displays = getAllDisplays();
  writeJSONFile(DISPLAYS_CONFIG_PATH, displays);

  console.log(
    `Initialized displays.json with default margins for ${
      Object.keys(displays).length
    } display(s)`,
  );
}

export function getBarMargins(displayId: string): {
  horizontal: number;
  vertical: number;
} {
  const config = loadDisplaysConfig();

  const margins = config[displayId];

  if (margins && Array.isArray(margins) && margins.length >= 2) {
    return {
      horizontal: margins[0],
      vertical: margins[1],
    };
  }

  return { horizontal: 300, vertical: 100 };
}
