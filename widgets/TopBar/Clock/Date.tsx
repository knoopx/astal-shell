import { GLib, Variable } from "astal";

export default ({ format = "<b>%a %d %b</b>" }) => {
  const date = Variable<string>("").poll(
    60000, // Update every minute since date changes less frequently
    () => GLib.DateTime.new_now_local().format(format)!
  );

  return (
    <label useMarkup onDestroy={() => date.drop()} label={date()} />
  );
};
