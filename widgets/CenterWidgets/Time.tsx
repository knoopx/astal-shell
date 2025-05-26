import { GLib, Variable } from "astal";
import { Gtk } from "astal/gtk3";

export default ({ format = "%H:%M" }) => {
  const time = Variable<string>("").poll(
    1000,
    () => GLib.DateTime.new_now_local().format(format)!
  );

  return (
    <button
      css="background: transparent; margin: 0; padding: 0; margin-top: -8px;"
      halign={Gtk.Align.CENTER}
      child={
        <label
          css="font-size: 0.8em; font-weight: normal; opacity: 0.8;"
          halign={Gtk.Align.CENTER}
          useMarkup
          onDestroy={() => time.drop()}
          label={time()}
        />
      }
    />
  );
};
