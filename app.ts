// This is the main entry point for the AGS shell application
import app from "ags/gtk4/app";
import { Gtk } from "ags/gtk4";
import TopBar from "./widgets/TopBar";
import LeftBar from "./widgets/LeftBar";
import VolumeOSD from "./widgets/OSD/VolumeOSD";
import BrightnessOSD from "./widgets/OSD/BrightnessOSD";
import BottomBar from "./widgets/BottomBar";
import { initializeDisplaysConfig } from "./support/displays";
import { loadTheme } from "./support/theme";

type BarWindows = Record<string, Gtk.Window>;

/**
 * Owns the monitor↔bar window lifecycle.
 *
 * This is the only place that maps monitors to their bar windows and knows how
 * to create/destroy them and diff monitor churn. The entry point (`app.ts`
 * `main`) talks solely to this seam instead of touching the bar-state spread
 * across several module-level functions, keeping behaviour in one object and
 * making future lifecycle changes land in exactly one place.
 */
class DisplayController {
  // References to bar windows keyed by monitor id, for monitor-change updates.
  readonly #barWindows = new Map<number, BarWindows>();

  /**
   * Fresh-boot lifecycle: initialise the display configuration once and build
   * bars for every currently-connected monitor.
   */
  start(): void {
    // Initialize displays configuration on startup. initializeDisplaysConfig()
    // is file-guarded (returns early once displays.json has content), so the
    // single call here fully covers the previous dual trigger and needs no
    // second call from the monitor-change path.
    initializeDisplaysConfig();

    // Create bars for all current monitors.
    const monitors = app.get_monitors();
    for (let i = 0; i < monitors.length; i++) {
      this.#createBarsForMonitor(i);
    }
  }

  /** Monitor-change handling: connect the notify::monitors signal exactly once. */
  attach(): void {
    app.connect("notify::monitors", () => {
      this.#handleMonitorChange();
    });

    console.log("Monitor change handling setup complete");
  }

  #createBarsForMonitor(monitor: number): void {
    const topBar = TopBar({ monitor });
    const leftBar = LeftBar({ monitor });
    const bottomBar = BottomBar({ monitor });
    const volumeOSD = VolumeOSD({ monitor });
    const brightnessOSD = BrightnessOSD({ monitor });

    this.#barWindows.set(monitor, {
      topBar: topBar as unknown as Gtk.Window,
      bottomBar: bottomBar as unknown as Gtk.Window,
      leftBar: leftBar as unknown as Gtk.Window,
      volumeOSD: volumeOSD as unknown as Gtk.Window,
      brightnessOSD: brightnessOSD as unknown as Gtk.Window,
    });
  }

  #destroyBarsForMonitor(monitor: number): void {
    const bars = this.#barWindows.get(monitor);
    if (!bars) return;

    Object.values(bars).forEach((bar) => {
      bar?.destroy();
    });

    this.#barWindows.delete(monitor);
  }

  #handleMonitorChange(): void {
    const currentMonitors = app.get_monitors();
    const currentMonitorIds = new Set(
      currentMonitors.map((_: unknown, i: number) => i),
    );

    // Find monitors that were removed
    for (const [monitorId] of this.#barWindows.entries()) {
      if (!currentMonitorIds.has(monitorId)) {
        console.log(`Monitor ${monitorId} disconnected, destroying bars`);
        this.#destroyBarsForMonitor(monitorId);
      }
    }

    // Find monitors that were added
    for (const monitorId of currentMonitorIds) {
      if (!this.#barWindows.has(monitorId)) {
        console.log(`Monitor ${monitorId} connected, creating bars`);
        this.#createBarsForMonitor(monitorId);
      }
    }
  }
}

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
    controller.start();       // init displays config + create bars for current monitors
    controller.attach();      // connect notify::monitors -> diff/create/destroy
  },
});
