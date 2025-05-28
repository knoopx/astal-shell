import { subprocess, Variable } from "astal";
import { Astal } from "astal/gtk3";
import Meter from "./Meter";
import Label from "./Label";

// Check if nvidia-smi is available
const hasNvidiaSmi = (() => {
  try {
    subprocess(["which", "nvidia-smi"]);
    return true;
  } catch {
    return false;
  }
})();

const gpu = hasNvidiaSmi
  ? Variable([0, 0, 0, 0]).poll(
      2000,
      [
        "bash",
        "-c",
        "nvidia-smi --query-gpu=temperature.gpu,utilization.gpu,memory.used,memory.total --format=csv,noheader,nounits",
      ],
      (out, prev) => out.split(", ").map(Number)
    )
  : Variable([0, 0, 0, 0]); // Provide a dummy variable when nvidia-smi is not available

export default () => {
  if (!hasNvidiaSmi) {
    return null;
  }

  return (
    <box halign={Astal.WindowAnchor.CENTER}>
      {gpu((v) => (
        <Meter value={v[1] / 100} />
      ))}
      <Label label="GPU" />
    </box>
  );
};
