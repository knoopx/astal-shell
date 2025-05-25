import { GLib, Variable, subprocess } from "astal";

export default ({ format = "<b>%a %d %b %H:%M</b>" }) => {
  const time = Variable<string>("").poll(
    1000,
    () => GLib.DateTime.new_now_local().format(format)!
  );

  return (
    <box>
      <button
        css="background: transparent;"
        onClicked={() => {
          subprocess("gnome-calendar");
        }}
      >
        <label useMarkup onDestroy={() => time.drop()} label={time()} />
      </button>
    </box>
  );
};
