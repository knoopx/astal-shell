import app from "ags/gtk3/app";
import TopBar from "./widgets/TopBar";
import LeftBar from "./widgets/LeftBar";
import VolumeOSD from "./widgets/OSD/VolumeOSD";
import BrightnessOSD from "./widgets/OSD/BrightnessOSD";
import BottomBar from "./widgets/BottomBar";
import { getAllDisplays, initializeDisplaysConfig } from "./support/util";
import { loadTheme } from "./support/theme";
import Gdk from "gi://Gdk";

// Store references to bar windows for monitor change updates
const barWindows = new Map<
  number,
  {
    topBar?: any;
    bottomBar?: any;
    leftBar?: any;
    volumeOSD?: any;
    brightnessOSD?: any;
  }
>();

function createBarsForMonitor(monitor: number) {
  const monitorNum = Number(monitor);
  const topBar = TopBar({ monitor: monitorNum });
  const leftBar = LeftBar({ monitor: monitorNum });
  const bottomBar = BottomBar({ monitor: monitorNum });
  const volumeOSD = VolumeOSD({ monitor: monitorNum });
  const brightnessOSD = BrightnessOSD({ monitor: monitorNum });

  barWindows.set(monitorNum, {
    topBar,
    bottomBar,
    leftBar,
    volumeOSD,
    brightnessOSD,
  });

  return { topBar, leftBar, bottomBar, volumeOSD, brightnessOSD };
}

function destroyBarsForMonitor(monitor: number) {
  const monitorNum = Number(monitor);
  const bars = barWindows.get(monitorNum);

  if (bars) {
    // Destroy each widget if it has a destroy method
    Object.values(bars).forEach((bar) => {
      if (bar && typeof bar.destroy === "function") {
        bar.destroy();
      }
    });

    // Remove from the map
    barWindows.delete(monitorNum);
  }
}

function setupMonitorChangeHandling() {
  const display = Gdk.Display.get_default();
  if (!display) {
    console.warn("Could not get default display for monitor change handling");
    return;
  }

  // Connect to the 'monitor-added' and 'monitor-removed' signals
  // These are the proper signals for monitor change detection in GTK
  display.connect("monitor-added", (disp, monitor) => {
    console.log("Monitor added");
    handleMonitorChange();
  });

  display.connect("monitor-removed", (disp, monitor) => {
    console.log("Monitor removed");
    handleMonitorChange();
  });

  function handleMonitorChange() {
    const currentMonitors = app.get_monitors();
    const currentMonitorIds = new Set(Object.keys(currentMonitors).map(Number));

    // Find monitors that were removed
    for (const [monitorId, bars] of barWindows.entries()) {
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
  css: `
    levelbar {
      border-radius: 2px;
      min-width: 8px;
    }

    levelbar .filled {
      border-radius: 2px;
      background-clip: padding-box;
    }

    levelbar.low .filled {
      background-color: @success_color;
    }

    levelbar.medium .filled {
      background-color: @theme_selected_bg_color;
    }

    levelbar.high .filled {
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
    for (const monitor in app.get_monitors()) {
      createBarsForMonitor(monitor);
    }

    // Setup monitor change handling
    setupMonitorChangeHandling();
  },
});
