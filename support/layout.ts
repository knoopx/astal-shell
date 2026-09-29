import { readFile } from "ags/file";
import app from "ags/gtk4/app";
import GLib from "gi://GLib";

/**
 * Bar layout derived from a single source of truth: the niri overview zoom.
 *
 * The niri config (`~/.config/niri/config.kdl`) carries one user-facing
 * variable — `overview { zoom <0..1> }`. The bars are sized and positioned
 * from that zoom plus the monitor's own logical size (the overview
 * `view_size`, since niri's struts are 0), so nothing is configured per
 * display.
 *
 * In overview, niri renders the workspaces as scaled cards: each card is
 * `view_size * zoom`, the `workspace_gap` between adjacent cards is
 * `view_size.h * 0.1 * zoom`, and the centred card sits at a static offset
 * of `view_size * (1 - zoom) / 2` from the screen edges.
 *
 * The bars are niri layer surfaces, and the config sets
 * `place-within-backdrop true` only for the `^wallpaper$` namespace — the
 * bars are not zoomed with the overview and stay at their output-space
 * position. Two placement rules:
 *
 * 1. Width: each bar matches the width of a full-size window at the
 *    overview render scale — the card width `view_size.w * zoom`, centred.
 *    Horizontal inset = `view_size.w * (1 - zoom) / 2`.
 * 2. Vertical: each bar is centred in the inter-workspace gap (the
 *    `workspace_gap` between the centred card and its neighbour card). The
 *    top gap spans `[static_offset.y - gap, static_offset.y]`, so the bar
 *    top = `static_offset.y - gap / 2 - BAR_HEIGHT / 2`
 *    = `view_size.h * (0.5 - 0.55 * zoom) - BAR_HEIGHT / 2` (bottom bar
 *    symmetric).
 *
 * Monitor dimensions come from GDK in logical (device-independent) pixels,
 * which already fold in each monitor's render scale, so the derived margins
 * track the per-monitor scale automatically.
 */

const NIRI_CONFIG_PATH = `${GLib.get_home_dir()}/.config/niri/config.kdl`;

/** Fallback zoom when the niri config is absent: no inset (bars at the edge). */
const DEFAULT_OVERVIEW_ZOOM = 1.0;

const BAR_HEIGHT = 48; // est. bar content height, logical px

let cachedZoom: number | null = null;

/**
 * Read the niri overview zoom from the config, cached after first read.
 * Returns the zoom factor (0..1) or the default when it cannot be determined.
 */
export function getOverviewZoom(): number {
  if (cachedZoom !== null) return cachedZoom;

  try {
    const config = readFile(NIRI_CONFIG_PATH);
    const overviewIndex = config.indexOf("overview");
    if (overviewIndex !== -1) {
      const zoomMatch = config
        .slice(overviewIndex)
        .match(/zoom\s+([\d.]+)/);
      if (zoomMatch) {
        cachedZoom = Number.parseFloat(zoomMatch[1]);
        return cachedZoom;
      }
    }
  } catch (error) {
    console.warn("Failed to read niri overview zoom:", error);
  }

  cachedZoom = DEFAULT_OVERVIEW_ZOOM;
  return cachedZoom;
}

/**
 * Margins for the bars on `monitor`, derived from the overview zoom and the
 * monitor's logical size (render-scale aware). The bar width equals the
 * overview card width (`view_size.w * zoom`, centred), so the horizontal
 * inset is `width * (1 - zoom) / 2`; the vertical margin centres the bar in
 * the inter-workspace gap between the centred card and its neighbour card —
 * the top bar in the gap above, the bottom bar in the gap below (symmetric).
 * The bars are layer surfaces that stay at output-space position (only the
 * wallpaper is `place-within-backdrop`), so these margins are what land
 * them there.
 */
export function getBarMargins(monitor: number): {
  horizontal: number;
  vertical: number;
} {
  const zoom = getOverviewZoom();
  const mon = app.get_monitors()[monitor];
  if (!mon) return { horizontal: 0, vertical: 0 };

  // get_geometry() reports the monitor size in logical (application) pixels,
  // which already folds in this monitor's render scale (the overview view_size).
  const geo = mon.get_geometry();

  return {
    horizontal: Math.max(0, Math.round(geo.width * (1 - zoom) / 2)), // card-width inset
    vertical: Math.max(0, Math.round(geo.height * (0.5 - 0.55 * zoom) - BAR_HEIGHT / 2)), // centred in inter-workspace gap
  };
}
