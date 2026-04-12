import Gtk from "gi://Gtk?version=4.0";
import { levelColor } from "../../../support/drawing";

export default ({
  invert = false,
  value,
}: {
  value: { as<U>(fn: (v: number) => U): unknown };
  invert?: boolean;
}) => {
  let currentValue = 0;
  let drawingArea: Gtk.DrawingArea;

  return (
    <drawingarea
      widthRequest={8}
      heightRequest={24}
      $={(self: Gtk.DrawingArea) => {
        drawingArea = self;
        self.set_draw_func((_area, cr, width, height) => {
          const r = 2;

          // Background
          cr.setSourceRGBA(1, 1, 1, 0.1);
          cr.newSubPath();
          cr.arc(width - r, r, r, -Math.PI / 2, 0);
          cr.arc(width - r, height - r, r, 0, Math.PI / 2);
          cr.arc(r, height - r, r, Math.PI / 2, Math.PI);
          cr.arc(r, r, r, Math.PI, (3 * Math.PI) / 2);
          cr.closePath();
          cr.fill();

          // Filled portion
          const pct = Math.max(0, Math.min(1, currentValue));
          const fillHeight = Math.round(pct * height);
          if (fillHeight > 0) {
            const [red, green, blue, alpha] = levelColor(currentValue, invert);
            cr.setSourceRGBA(red, green, blue, alpha);
            const y = height - fillHeight;
            cr.newSubPath();
            cr.arc(width - r, y + r, r, -Math.PI / 2, 0);
            cr.arc(width - r, height - r, r, 0, Math.PI / 2);
            cr.arc(r, height - r, r, Math.PI / 2, Math.PI);
            cr.arc(r, y + r, r, Math.PI, (3 * Math.PI) / 2);
            cr.closePath();
            cr.fill();
          }
        });
      }}
      css={
        value.as((v: number) => {
          currentValue = v;
          if (drawingArea) drawingArea.queue_draw();
          return "";
        }) as unknown as string
      }
    />
  );
};
