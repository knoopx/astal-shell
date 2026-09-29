import app from "ags/gtk4/app";
import { Gtk } from "ags/gtk4";
import TopBar from "../widgets/TopBar";
import LeftBar from "../widgets/LeftBar";
import BottomBar from "../widgets/BottomBar";
import VolumeOSD from "../widgets/OSD/VolumeOSD";
import BrightnessOSD from "../widgets/OSD/BrightnessOSD";
import { getBarMargins } from "./layout";

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
export class DisplayController {
  // References to bar windows keyed by monitor id, for monitor-change updates.
  readonly #barWindows = new Map<number, BarWindows>();

  // Last-seen monitor geometry (logical px) per monitor id, used to detect
  // resolution/scaling changes that require bar repositioning.
  readonly #monitorGeometries = new Map<
    number,
    { width: number; height: number }
  >();

  /**
   * Fresh-boot lifecycle: build bars for every currently-connected monitor.
   */
  start(): void {
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

    this.#recordMonitorGeometry(monitor);
    this.#connectMonitorGeometrySignals(monitor);
  }

  #connectMonitorGeometrySignals(monitor: number): void {
    const mon = app.get_monitors()[monitor];
    if (!mon) return;
    const onChange = () => {
      this.#handleMonitorChange();
    };
    mon.connect("notify::geometry", onChange);
    mon.connect("notify::scale-factor", onChange);
  }

  #destroyBarsForMonitor(monitor: number): void {
    const bars = this.#barWindows.get(monitor);
    if (!bars) return;

    Object.values(bars).forEach((bar) => {
      bar?.destroy();
    });

    this.#barWindows.delete(monitor);
    this.#monitorGeometries.delete(monitor);
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

    // Find monitors that were added, and reposition bars on monitors whose
    // resolution or scaling changed (logical geometry differs from last seen).
    for (const monitorId of currentMonitorIds) {
      if (!this.#barWindows.has(monitorId)) {
        console.log(`Monitor ${monitorId} connected, creating bars`);
        this.#createBarsForMonitor(monitorId);
      } else if (this.#monitorGeometryChanged(monitorId)) {
        console.log(
          `Monitor ${monitorId} geometry changed, repositioning bars`,
        );
        this.#repositionBarsForMonitor(monitorId);
        this.#recordMonitorGeometry(monitorId);
      }
    }
  }

  #getMonitorGeometry(
    monitor: number,
  ): { width: number; height: number } | null {
    const mon = app.get_monitors()[monitor];
    if (!mon) return null;

    const geo = mon.get_geometry();
    return { width: geo.width, height: geo.height };
  }

  #recordMonitorGeometry(monitor: number): void {
    const geo = this.#getMonitorGeometry(monitor);
    if (geo) this.#monitorGeometries.set(monitor, geo);
  }

  #monitorGeometryChanged(monitor: number): boolean {
    const prev = this.#monitorGeometries.get(monitor);
    const current = this.#getMonitorGeometry(monitor);
    if (!prev || !current) return false;

    return prev.width !== current.width || prev.height !== current.height;
  }

  /**
   * Re-apply the geometry-derived margins to a monitor's bars after a
   * resolution/scaling change. The compositor re-resolves the anchors
   * against the new output geometry; only the margins (derived from the
   * monitor's logical size at creation) need refreshing.
   */
  #repositionBarsForMonitor(monitor: number): void {
    const bars = this.#barWindows.get(monitor);
    if (!bars) return;

    const margins = getBarMargins(monitor);
    bars.topBar?.set_property("margin-top", margins.vertical);
    bars.topBar?.set_property("margin-left", margins.horizontal);
    bars.topBar?.set_property("margin-right", margins.horizontal);
    bars.bottomBar?.set_property("margin-bottom", margins.vertical);
    bars.bottomBar?.set_property("margin-left", margins.horizontal);
    bars.bottomBar?.set_property("margin-right", margins.horizontal);
  }
}
