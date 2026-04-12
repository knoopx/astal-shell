import { onCleanup } from "ags";
import { Gtk } from "ags/gtk4";
import { applyOpacityTransition } from "./transitions";
import niri from "./niri";

/**
 * Set up opacity transition for a window based on niri overview state
 * Returns the signal ID for cleanup
 */
export function setupOverviewOpacityTransition(win: Gtk.Widget): number {
  const signalId = niri.connect("notify::overview-is-open", () => {
    applyOpacityTransition(win, niri.overviewIsOpen);
  });

  onCleanup(() => {
    niri.disconnect(signalId);
  });

  return signalId;
}
