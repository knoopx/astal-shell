import { getCurrentTheme } from "./theme";
import {
  levelColor as resolveLevelColor,
  type LevelTheme,
} from "./color";
import type cairo from "cairo";

export { parseRgba } from "./color";

/**
 * Get color based on value level with optional inversion, reading status
 * colors from the given theme (or the current theme by default).
 * @param value - Normalized value between 0 and 1
 * @param invert - If true, high values are success; if false, high values are error
 * @param theme - Theme whose status colors are used (defaults to the current theme)
 */
export function levelColor(
  value: number,
  invert = false,
  theme: LevelTheme = getCurrentTheme(),
): [number, number, number, number] {
  return resolveLevelColor(value, invert, theme);
}

/**
 * Draws a rounded-rectangle path (no fill/stroke) on the cairo context.
 * @param cr - Cairo drawing context
 * @param x - Left edge
 * @param y - Top edge
 * @param width - Width of the rectangle
 * @param height - Height of the rectangle
 * @param radius - Corner radius (uniform for all four corners)
 */
export function roundedRectPath(
  cr: cairo.Context,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const r = radius;
  cr.arc(x + width - r, y + r, r, -Math.PI / 2, 0);
  cr.arc(x + width - r, y + height - r, r, 0, Math.PI / 2);
  cr.arc(x + r, y + height - r, r, Math.PI / 2, Math.PI);
  cr.arc(x + r, y + r, r, Math.PI, (3 * Math.PI) / 2);
  cr.closePath();
}

/**
 * Draws a capsule (stadium) path (no fill/stroke) on the cairo context.
 * A capsule has two semicircular end caps connected by straight sides.
 * @param cr - Cairo drawing context
 * @param cx - Center X coordinate
 * @param topY - Y coordinate of the top of the top cap
 * @param bottomY - Y coordinate of the bottom of the bottom cap
 * @param topRadius - Radius of the top semicircular cap
 * @param bottomRadius - Radius of the bottom semicircular cap
 */
export function capsulePath(
  cr: cairo.Context,
  cx: number,
  topY: number,
  bottomY: number,
  topRadius: number,
  bottomRadius: number,
): void {
  cr.arc(cx, topY + topRadius, topRadius, Math.PI, 0);
  cr.arc(cx, bottomY - bottomRadius, bottomRadius, 0, Math.PI);
  cr.closePath();
}