import { subprocess } from "astal";
import { GLib, Variable } from "astal";
import { Gtk } from "astal/gtk3";
import niri from "../../../support/niri";

export default ({
  dateFormat = "<b>%a %d %b</b>"
}) => {
  const date = Variable<string>("").poll(
    60000, // Update every minute since date changes less frequently
    () => GLib.DateTime.new_now_local().format(dateFormat)!
  );

  return (
    <button
      css="background: transparent; margin: 0; padding: 0;"
      halign={Gtk.Align.CENTER}
      onClicked={() => {
        niri.toggleOverview();
        subprocess("gnome-calendar");
      }}
      child={
        <label
          useMarkup
          halign={Gtk.Align.CENTER}
          onDestroy={() => date.drop()}
          label={date()}
        />
      }
    />
  );
};
