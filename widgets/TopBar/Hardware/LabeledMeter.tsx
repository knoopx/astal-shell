import { Gtk } from "ags/gtk3";
import Meter from "./Meter";
import Label from "./Label";

interface Binding<T> {
  as<U>(fn: (v: T) => U): Binding<U>;
}

type LabeledMeterProps = {
  value: Binding<number>;
  label: string;
  invert?: boolean;
};

export default ({ value, label, invert }: LabeledMeterProps) => (
  <box halign={Gtk.Align.CENTER}>
    <Meter value={value} invert={invert} />
    <Label label={label} />
  </box>
);
