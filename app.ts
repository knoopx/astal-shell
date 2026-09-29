// This is the main entry point for the AGS shell application
import app from "ags/gtk4/app";
import { DisplayController } from "./support/displayController";
import { loadTheme } from "./support/theme";

const theme = loadTheme();

app.start({
  iconTheme: theme.iconTheme,
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
    // One seam owns the monitor↔bar lifecycle for this boot.
    const controller = new DisplayController();
    controller.start();       // create bars for current monitors
    controller.attach();      // connect notify::monitors -> diff/create/destroy
  },
});
