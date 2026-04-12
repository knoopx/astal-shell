import { getCurrentTheme } from "./theme";

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
 * Get color based on value level with optional inversion
 * @param value - Normalized value between 0 and 1
 * @param invert - If true, high values are success; if false, high values are error
 */
export function levelColor(
  value: number,
  invert = false,
): [number, number, number, number] {
  const theme = getCurrentTheme();
  if (invert) {
    if (value > 0.75) return parseRgba(theme.status.success);
    if (value > 0.25) return parseRgba(theme.status.warning);
    return parseRgba(theme.status.error);
  }
  if (value > 0.75) return parseRgba(theme.status.error);
  if (value > 0.25) return parseRgba(theme.status.warning);
  return parseRgba(theme.status.success);
}
