import GLib from "gi://GLib";
import { readJSONFile } from "./json";

export interface QuickSettingsEntry {
  id: string;
  icon: string;
  label: string;
  command: string | string[];
  confirm?: boolean;
}

const CONFIG_PATH = `${GLib.get_home_dir()}/.config/astal-shell/quickSettings.json`;

const DEFAULT_SETTINGS: QuickSettingsEntry[] = [
  {
    id: "shutdown",
    icon: "system-shutdown-symbolic",
    label: "Shutdown",
    command: ["systemctl", "poweroff"],
    confirm: true,
  },
  {
    id: "reboot",
    icon: "system-reboot-symbolic",
    label: "Reboot",
    command: ["systemctl", "reboot"],
    confirm: true,
  },
  {
    id: "logout",
    icon: "system-log-out-symbolic",
    label: "Logout",
    command: ["niri", "msg", "action", "quit", "-s"],
    confirm: true,
  },
];

const settings: QuickSettingsEntry[] = [];

// Shared load path for both the initial lazy load and the forced reload
// below, so a reload always mirrors initial-load logic.
function reloadInternal(): void {
  if (!GLib.file_test(CONFIG_PATH, GLib.FileTest.EXISTS)) {
    settings.push(...DEFAULT_SETTINGS);
    return;
  }

  try {
    const data = readJSONFile(CONFIG_PATH) as QuickSettingsEntry[];
    if (Array.isArray(data) && data.length > 0) {
      settings.push(...data);
      console.log("Loaded quickSettings from:", CONFIG_PATH);
      return;
    }
  } catch (error) {
    console.warn("Failed to load quickSettings, using defaults:", error);
  }

  settings.push(...DEFAULT_SETTINGS);
}

export function getQuickSettings(force = false): QuickSettingsEntry[] {
  // force reloads from disk (the former refresh seam); otherwise the cached
  // value is served, loading lazily on first access.
  if (force) settings.length = 0;
  if (settings.length === 0) reloadInternal();
  return settings;
}
