import { Gtk } from "ags/gtk4";
import Date from "./Date";
import Time from "./Time";
import Weather from "./Weather";

export default () => {
  return (
    <box
      orientation={Gtk.Orientation.VERTICAL}
      halign={Gtk.Align.CENTER}
      valign={Gtk.Align.CENTER}
      spacing={0}
      css={`
        margin: 0;
        padding: 0;
      `}
    >
      <Date />
      <box spacing={2} halign={Gtk.Align.CENTER}>
        <Time />
        <Weather />
      </box>
    </box>
  );
};
