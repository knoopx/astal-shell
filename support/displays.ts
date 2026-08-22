import { readFile } from "ags/file";
import app from "ags/gtk4/app";
import GLib from "gi://GLib";
import { readJSONFile, writeJSONFile } from "./json";

/**
 * Maps a monitor index to its display id (the key used by the displays
 * config). The display-id string is internal to this module; callers only
 * ever pass a monitor number.
 */
function getDisplayId(monitor: number): string {
  try {
    const monitors = app.get_monitors();
    if (monitors && monitor < monitors.length) {
      const monitorObj = monitors[monitor];
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

/**
 * Margin defaults applied to a display whose config does not specify them.
 * Canonical, single source of truth for every display-margin default here.
 */
interface DisplayConfig {
  readonly horizontal: number;
  readonly vertical: number;
}

/** The default bar margins (fresh copy per call keeps the value immutable). */
function defaultBarMargins(): DisplayConfig {
  return { ...DISPLAY_DEFAULTS };
}

const DISPLAY_DEFAULTS: DisplayConfig = { horizontal: 300, vertical: 100 };

function getAllDisplays(): Record<string, [number, number]> {
  const displays: Record<string, [number, number]> = {};

  const monitors = app.get_monitors();
  for (let i = 0; i < monitors.length; i++) {
    const displayId = getDisplayId(i);
    const { horizontal, vertical } = defaultBarMargins();
    displays[displayId] = [horizontal, vertical]; // Default margins
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

export function getBarMargins(monitor: number): {
  horizontal: number;
  vertical: number;
} {
  const displayId = getDisplayId(monitor);
  const config = loadDisplaysConfig();

  const margins = config[displayId];

  if (margins && Array.isArray(margins) && margins.length >= 2) {
    return {
      horizontal: margins[0],
      vertical: margins[1],
    };
  }

  return defaultBarMargins();
}