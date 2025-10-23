import app from "ags/gtk3/app";
import TopBar from "./widgets/TopBar";
import LeftBar from "./widgets/LeftBar";
import VolumeOSD from "./widgets/OSD/VolumeOSD";
import BrightnessOSD from "./widgets/OSD/BrightnessOSD";
import BottomBar from "./widgets/BottomBar";
import { getAllDisplays, initializeDisplaysConfig } from "./support/util";
import { loadTheme } from "./support/theme";

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
    // Initialize displays configuration on startup
    initializeDisplaysConfig();

    // Load theme on startup
    loadTheme();

    // Create bars for all current monitors
    for (const monitor in app.get_monitors()) {
      createBarsForMonitor(monitor);
    }

    // TODO: Implement monitor change handling
    // Monitor signals need to be handled differently in AGS v3
    // For now, widgets are created for existing monitors on startup
  },
});
