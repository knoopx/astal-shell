import { createPoll } from "ags/time";
import { Gtk } from "ags/gtk4";
import GLib from "gi://GLib";
import { getCurrentTheme } from "../../support/theme";

export default ({ format = "%H:%M" }) => {
  const theme = getCurrentTheme();
  const time = createPoll("", 1000, () =>
    GLib.DateTime.new_now_local().format(format)!
  );

  return (
    <button
      css="background: transparent; margin: 0; padding: 0; margin-top: -8px;"
      halign={Gtk.Align.CENTER}
    >
      <label
        css={`font-size: ${theme.font.size.small}; font-weight: ${theme.font.weight.normal}; opacity: ${theme.opacity.medium};`}
        halign={Gtk.Align.CENTER}
        useMarkup
        label={time}
      />
    </button>
  );
};
