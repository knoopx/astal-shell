import { createPoll } from "ags/time";
import { Gtk } from "ags/gtk3";
import { exec } from "ags/process";
import Meter from "./Meter";
import Label from "./Label";

const gpu = createPoll(
  [0, 0, 0, 0],
  2000,
  () => {
    try {
      const out = exec([
        "bash",
        "-c",
        "nvidia-smi --query-gpu=temperature.gpu,utilization.gpu,memory.used,memory.total --format=csv,noheader,nounits",
      ]);
      return out.split(", ").map(Number);
    } catch {
      return [0, 0, 0, 0];
    }
  }
);

export default () => {
  return (
    <box halign={Gtk.Align.CENTER}>
      <Meter value={gpu((v) => v[3] > 0 ? v[2] / v[3] : 0)} />
      <Label label="VRAM" />
    </box>
  );
};
