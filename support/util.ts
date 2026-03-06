import { readFile, writeFile } from "ags/file";
import app from "ags/gtk3/app";
import Battery from "gi://AstalBattery";
import GLib from "gi://GLib";
import Gdk from "gi://Gdk";

export function readJSONFile(filePath: string): unknown {
  const data = readFile(filePath);
  if (!data || !data.trim()) return {};
  return JSON.parse(data);
}

export function writeJSONFile(filePath: string, data: unknown) {
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
    const display = Gdk.Display.get_default();
    if (display) {
      const monitorObj = (
        display as unknown as { get_monitor(n: number): Gdk.Monitor | null }
      ).get_monitor(monitor);
      if (monitorObj) {
        const model = monitorObj.get_model();
        if (model) return model;
        const manufacturer = monitorObj.get_manufacturer();
        if (manufacturer) return manufacturer;
      }
    }
  } catch (error) {
    console.warn("Failed to get display ID:", error);
  }

  return `monitor_${monitor}`;
}

const DISPLAYS_CONFIG_PATH = `${GLib.get_home_dir()}/.config/astal-shell/displays.json`;

let displaysConfig: Record<string, [number, number]> | null = null;

function loadDisplaysConfig(): Record<string, [number, number]> {
  if (displaysConfig !== null) {
    return displaysConfig;
  }

  try {
    displaysConfig = readJSONFile(DISPLAYS_CONFIG_PATH) as Record<
      string,
      [number, number]
    >;
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
