import { GLib, Variable, subprocess } from "astal";
import niri from "../../../support/niri";

export default ({ format = "<b>%a %d %b %H:%M</b>" }) => {
  const time = Variable<string>("").poll(
    1000,
    () => GLib.DateTime.new_now_local().format(format)!
  );

  return (
    <box>
      <button
        css="background: transparent; margin: 0; padding: 0;"
        onClicked={() => {
          niri.toggleOverview();
          subprocess("gnome-calendar");
        }}
        child={<label useMarkup onDestroy={() => time.drop()} label={time()} />}
      />
    </box>
  );
};
