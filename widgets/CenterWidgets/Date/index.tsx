import { createPoll } from "ags/time";
import { Gtk } from "ags/gtk4";
import GLib from "gi://GLib";
import CenterWidgetButton from "../CenterWidgetButton";
export default function DateWidget({ dateFormat = "<b>%a %d %b</b>" }) {
  const date = createPoll(
    "",
    60000,
    () => GLib.DateTime.new_now_local().format(dateFormat)!,
  );

  return (
    <CenterWidgetButton app="gnome-calendar">
      <label useMarkup halign={Gtk.Align.CENTER} label={date} />
    </CenterWidgetButton>
  );
}
