import { subprocess } from "ags/process";
import { createPoll } from "ags/time";
import { Gtk } from "ags/gtk3";
import GLib from "gi://GLib";
import niri from "../../../support/niri";
import { getCurrentTheme } from "../../../support/theme";

export default function DateWidget({
  dateFormat = "<b>%a %d %b</b>"
}) {
  const theme = getCurrentTheme();
  const date = createPoll("", 60000, () =>
    GLib.DateTime.new_now_local().format(dateFormat)!
  );

  return (
    <button
      css="background: transparent; margin: 0; padding: 0;"
      halign={Gtk.Align.CENTER}
      onClicked={() => {
        niri.toggleOverview();
        subprocess("gnome-calendar");
      }}
    >
      <label
        useMarkup
        halign={Gtk.Align.CENTER}
        label={date}
      />
    </button>
  );
}
