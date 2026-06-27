import GLib from "gi://GLib";
import { readJSONFile } from "./util";

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

let settings: QuickSettingsEntry[] = [];

export function loadQuickSettings(): QuickSettingsEntry[] {
  if (settings.length > 0) return settings;

  if (!GLib.file_test(CONFIG_PATH, GLib.FileTest.EXISTS)) {
    settings = DEFAULT_SETTINGS;
    return settings;
  }

  try {
    const data = readJSONFile(CONFIG_PATH) as QuickSettingsEntry[];
    if (Array.isArray(data) && data.length > 0) {
      settings = data;
      console.log("Loaded quickSettings from:", CONFIG_PATH);
      return settings;
    }
  } catch (error) {
    console.warn("Failed to load quickSettings, using defaults:", error);
  }

  settings = DEFAULT_SETTINGS;
  return settings;
}

export function getQuickSettings(): QuickSettingsEntry[] {
  return loadQuickSettings();
}
