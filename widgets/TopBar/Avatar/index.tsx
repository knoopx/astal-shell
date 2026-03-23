import { Gtk } from "ags/gtk4";
import Gdk from "gi://Gdk?version=4.0";
import GdkPixbuf from "gi://GdkPixbuf";
import GLib from "gi://GLib";
import { getCurrentTheme } from "../../../support/theme";

function parseRgba(rgba: string): [number, number, number, number] {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return [1, 1, 1, 1];
  return [
    Number(match[1]) / 255,
    Number(match[2]) / 255,
    Number(match[3]) / 255,
    match[4] !== undefined ? Number(match[4]) : 1,
  ];
}

export default ({ onToggle }: { onToggle: () => void }) => {
  const facePath = `${GLib.getenv("HOME")}/.face`;
  const faceExists = GLib.file_test(facePath, GLib.FileTest.EXISTS);
  const theme = getCurrentTheme();
  const [red, green, blue, alpha] = parseRgba(theme.accent.border);
  const pixbuf = faceExists
    ? GdkPixbuf.Pixbuf.new_from_file_at_scale(facePath, 32, 32, true)
    : null;

  return (
    <button
      css={`
        padding: 0;
        background: transparent;
        margin-left: 8px;
      `}
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
      onClicked={onToggle}
    >
      <drawingarea
        widthRequest={36}
        heightRequest={36}
        $={(self: Gtk.DrawingArea) => {
          self.set_draw_func((_area, cr, width, height) => {
            const radius = Math.min(width, height) / 2;
            const centerX = width / 2;
            const centerY = height / 2;

            cr.arc(centerX, centerY, radius - 1, 0, Math.PI * 2);
            cr.clip();

            if (pixbuf) {
              const x = (width - pixbuf.get_width()) / 2;
              const y = (height - pixbuf.get_height()) / 2;
              Gdk.cairo_set_source_pixbuf(cr, pixbuf, x, y);
              cr.paint();
            }

            cr.resetClip();
            cr.setSourceRGBA(red, green, blue, alpha);
            cr.setLineWidth(2);
            cr.arc(centerX, centerY, radius - 1, 0, Math.PI * 2);
            cr.stroke();
          });
        }}
      />
    </button>
  );
};
