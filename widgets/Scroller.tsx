import { Gtk } from "astal/gtk3";
import { timeout } from "astal";
import { Scrollable, ScrollableProps } from "astal/gtk3/widget";

function auto_scroll(adjustment: Gtk.Adjustment | null) {
  if (!adjustment) {
    return;
  }
  adjustment.value += 1;
  if (adjustment.value >= adjustment.upper - adjustment.page_size) {
    timeout(1000, () => {
      adjustment.value = 0;
      timeout(500, () => auto_scroll(adjustment));
    });
  } else {
    timeout(40, () => auto_scroll(adjustment));
  }
}

export function Scroller({ ...props }: ScrollableProps): JSX.Element {
  const scroll = new Scrollable({
    vscroll: Gtk.PolicyType.NEVER,
    hscroll: Gtk.PolicyType.AUTOMATIC,
    className: "hidden-scroller",
    ...props,
  });

  timeout(500, () => auto_scroll(scroll.hadjustment));

  return scroll;
}