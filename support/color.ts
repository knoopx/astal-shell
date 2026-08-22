/**
 * Pure color utilities — no AGS/GLib/GObject imports, importable in plain
 * node/vitest environments. The drawing side (support/drawing.ts) adapts
 * these to the live theme.
 */

/** Status color strings of a theme (structural subset of the Theme type). */
export interface StatusColors {
  success: string;
  warning: string;
  error: string;
}

/** Minimal theme shape needed for level color decisions. */
export interface LevelTheme {
  status: StatusColors;
}

/**
 * Parse an RGBA color string into normalized [r, g, b, a] values (0-1 range)
 */
export function parseRgba(rgba: string): [number, number, number, number] {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return [1, 1, 1, 1];
  return [
    Number(match[1]) / 255,
    Number(match[2]) / 255,
    Number(match[3]) / 255,
    match[4] !== undefined ? Number(match[4]) : 1,
  ];
}

/**
 * Get color based on value level with optional inversion.
 * Pure: the theme (or its status colors) must be supplied by the caller.
 * @param value - Normalized value between 0 and 1
 * @param invert - If true, high values are success; if false, high values are error
 * @param theme - Theme whose status colors are used for the decision
 */
export function levelColor(
  value: number,
  invert = false,
  theme: LevelTheme,
): [number, number, number, number] {
  if (invert) {
    if (value > 0.75) return parseRgba(theme.status.success);
    if (value > 0.25) return parseRgba(theme.status.warning);
    return parseRgba(theme.status.error);
  }
  if (value > 0.75) return parseRgba(theme.status.error);
  if (value > 0.25) return parseRgba(theme.status.warning);
  return parseRgba(theme.status.success);
}