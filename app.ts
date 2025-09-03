import app from "ags/gtk3/app";
import TopBar from "./widgets/TopBar";
import LeftBar from "./widgets/LeftBar";
import VolumeOSD from "./widgets/OSD/VolumeOSD";
import BrightnessOSD from "./widgets/OSD/BrightnessOSD";
import BottomBar from "./widgets/BottomBar";
import { initializeConfigFile } from "./support/util";

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
    // Initialize configuration file on startup
    initializeConfigFile();

    for (const monitor in app.get_monitors()) {
      const monitorNum = Number(monitor);
      TopBar({ monitor: monitorNum });
      LeftBar({ monitor: monitorNum });
      BottomBar({ monitor: monitorNum });
      VolumeOSD({ monitor: monitorNum });
      BrightnessOSD({ monitor: monitorNum });
    }
  },
});
