import app from "ags/gtk4/app";
import { Gtk } from "ags/gtk4";
import TopBar from "./widgets/TopBar";
import LeftBar from "./widgets/LeftBar";
import VolumeOSD from "./widgets/OSD/VolumeOSD";
import BrightnessOSD from "./widgets/OSD/BrightnessOSD";
import BottomBar from "./widgets/BottomBar";
import { getAllDisplays, initializeDisplaysConfig } from "./support/util";
import { loadTheme } from "./support/theme";

type BarWindows = Record<string, Gtk.Window>;

// Store references to bar windows for monitor change updates
const barWindows = new Map<number, BarWindows>();

function createBarsForMonitor(monitor: number) {
  const topBar = TopBar({ monitor });
  const leftBar = LeftBar({ monitor });
  const bottomBar = BottomBar({ monitor });
  const volumeOSD = VolumeOSD({ monitor });
  const brightnessOSD = BrightnessOSD({ monitor });

  barWindows.set(monitor, {
    topBar: topBar as unknown as Gtk.Window,
    bottomBar: bottomBar as unknown as Gtk.Window,
    leftBar: leftBar as unknown as Gtk.Window,
    volumeOSD: volumeOSD as unknown as Gtk.Window,
    brightnessOSD: brightnessOSD as unknown as Gtk.Window,
  });

  return { topBar, leftBar, bottomBar, volumeOSD, brightnessOSD };
}

function destroyBarsForMonitor(monitor: number) {
  const bars = barWindows.get(monitor);
  if (!bars) return;

  Object.values(bars).forEach((bar) => {
    bar?.destroy();
  });

  barWindows.delete(monitor);
}

function setupMonitorChangeHandling() {
  app.connect("notify::monitors", () => {
    handleMonitorChange();
  });

  function handleMonitorChange() {
    const currentMonitors = app.get_monitors();
    const currentMonitorIds = new Set(currentMonitors.map((_: unknown, i: number) => i));

    // Find monitors that were removed
    for (const [monitorId] of barWindows.entries()) {
      if (!currentMonitorIds.has(monitorId)) {
        console.log(`Monitor ${monitorId} disconnected, destroying bars`);
        destroyBarsForMonitor(monitorId);
      }
    }

    // Find monitors that were added
    for (const monitorId of currentMonitorIds) {
      if (!barWindows.has(monitorId)) {
        console.log(`Monitor ${monitorId} connected, creating bars`);
        createBarsForMonitor(monitorId);
      }
    }

    // Reinitialize displays config to include new monitors
    initializeDisplaysConfig();
  }

  console.log("Monitor change handling setup complete");
}

app.start({
  iconTheme: "Adwaita",
  css: `
    levelbar trough {
      border-radius: 2px;
      min-width: 8px;
    }

    levelbar block.filled {
      border-radius: 2px;
    }

    levelbar.low block.filled {
      background-color: @success_color;
    }

    levelbar.medium block.filled {
      background-color: @accent_bg_color;
    }

    levelbar.high block.filled {
      background-color: @error_color;
    }
    `,
  main() {
    console.log("Displays", getAllDisplays());
    // Initialize displays configuration on startup
    initializeDisplaysConfig();

    // Load theme on startup
    loadTheme();

    // Create bars for all current monitors
    const monitors = app.get_monitors();
    for (let i = 0; i < monitors.length; i++) {
      createBarsForMonitor(i);
    }

    // Setup monitor change handling
    setupMonitorChangeHandling();
  },
});
