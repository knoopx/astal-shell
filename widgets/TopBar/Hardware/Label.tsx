import { Gtk } from "ags/gtk4";

type LabelProps = {
  label: string;
};

export default ({ label }: LabelProps) => (
  <box
    valign={Gtk.Align.CENTER}
    halign={Gtk.Align.CENTER}
    widthRequest={8}
    heightRequest={24}
    overflow={Gtk.Overflow.VISIBLE}
  >
    <label
      label={label}
      css={`
        font-size: 0.5em;
        font-weight: bold;
        transform: rotate(90deg);
        transform-origin: center;
      `}
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
    />
  </box>
);
