import { subprocess, Variable } from "astal";
import { Astal } from "astal/gtk3";
import Meter from "./Meter";
import Label from "./Label";

const gpu = Variable([0, 0, 0, 0]).poll(
  2000,
  [
    "bash",
    "-c",
    "nvidia-smi --query-gpu=temperature.gpu,utilization.gpu,memory.used,memory.total --format=csv,noheader,nounits",
  ],
  (out, prev) => out.split(", ").map(Number)
);

export default () => {
  return (
    <box halign={Astal.WindowAnchor.CENTER}>
      {gpu((v) => (
        <Meter value={v[1] / 100} />
      ))}
      <Label label="GPU" />
    </box>
  );
};
