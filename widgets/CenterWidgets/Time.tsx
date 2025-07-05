import { createPoll } from "ags/time";
import { Gtk } from "ags/gtk3";
import GLib from "gi://GLib";

export default ({ format = "%H:%M" }) => {
  const time = createPoll("", 1000, () =>
    GLib.DateTime.new_now_local().format(format)!
  );

  return (
    <button
      css="background: transparent; margin: 0; padding: 0; margin-top: -8px;"
      halign={Gtk.Align.CENTER}
    >
      <label
        css="font-size: 0.8em; font-weight: normal; opacity: 0.8;"
        halign={Gtk.Align.CENTER}
        useMarkup
        label={time}
      />
    </button>
  );
};
