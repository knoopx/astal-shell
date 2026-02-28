import { Gtk } from "ags/gtk3";
import Meter from "./Meter";
import Label from "./Label";

type LabeledMeterProps = {
  value: any;
  label: string;
  invert?: boolean;
};

export default ({ value, label, invert }: LabeledMeterProps) => (
  <box halign={Gtk.Align.CENTER}>
    <Meter value={value} invert={invert} />
    <Label label={label} />
  </box>
);
