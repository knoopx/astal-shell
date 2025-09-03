import { exec } from "ags/process";
import { readFile, writeFile, monitorFile } from "ags/file";
import app from "ags/gtk3/app";
import Battery from "gi://AstalBattery";
import GLib from "gi://GLib";
import Gdk from "gi://Gdk";

export const format = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes < 0)
    throw new Error("Invalid byte value");
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.max(
    0,
    Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  );
  const value = bytes / Math.pow(1024, i);
  return `${parseFloat(value.toFixed(2))} ${sizes[i]}`;
};

export function readJSONFile(filePath: string): any {
  try {
    const data = readFile(filePath);
    if (data == "") return {};
    return data.trim() ? JSON.parse(data) : {};
  } catch (e) {
    // File doesn't exist or can't be read
    return {};
  }
}

export function writeJSONFile(filePath: string, data: any) {
  try {
    if (readFile(filePath) == "")
      exec(`mkdir -p ${filePath.split("/").slice(0, -1).join("/")}`);
  } catch (e) {
    // File doesn't exist, create directory
    exec(`mkdir -p ${filePath.split("/").slice(0, -1).join("/")}`);
  }
  try {
    writeFile(filePath, JSON.stringify(data, null, 4));
  } catch (e) {
    console.log(e);
  }
}

export const hasNvidiaGpu = (() => {
  try {
    const [out, err] = exec(["test", "-d", "/proc/driver/nvidia"]);
    return !err;
  } catch {
    return false;
  }
})();

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

export function initializeConfigFile(): void {
  const configPath = `${GLib.get_home_dir()}/.config/astal-shell/displays.json`;

  // Check if file already exists
  try {
    if (readFile(configPath) !== "") {
      return; // File already exists, don't overwrite
    }
  } catch (e) {
    // File doesn't exist, continue with initialization
  }

  // Create config directory if it doesn't exist
  const configDir = configPath.split("/").slice(0, -1).join("/");
  try {
    exec(`mkdir -p "${configDir}"`);
  } catch (error) {
    console.warn("Failed to create config directory:", error);
  }

  // Get all displays and create config
  const displays = getAllDisplays();
  writeJSONFile(configPath, displays);

  console.log(
    `Initialized displays.json with default margins for ${
      Object.keys(displays).length
    } display(s)`
  );
}

export function getBarMargins(displayId: string): { horizontal: number; vertical: number } {
  const configPath = `${GLib.get_home_dir()}/.config/astal-shell/displays.json`;

  try {
    const config = readJSONFile(configPath);
    const margins = config[displayId];

    if (margins && Array.isArray(margins) && margins.length >= 2) {
      return {
        horizontal: margins[0],
        vertical: margins[1]
      };
    }
  } catch (error) {
    console.warn("Failed to read margins from config:", error);
  }

  // Return default margins if config is missing or invalid
  return { horizontal: 300, vertical: 100 };
}
