import { subprocess } from "astal";
import { Astal, Gtk } from "astal/gtk3";
import CPUMeter from "./CPUMeter";
import RAMMeter from "./RAMMeter";
import GPUMeter from "./GPUMeter";
import VRAMMeter from "./VRAMMeter";
import DiskMeter from "./DiskMeter";
import BatteryMeter from "./BatteryMeter";

// Check if NVIDIA GPU is present
const hasNvidiaGpu = (() => {
  try {
    subprocess(["test", "-d", "/proc/driver/nvidia"]);
    return true;
  } catch {
    return false;
  }
})();

const actions = {
  [Astal.MouseButton.PRIMARY]: () => subprocess("missioncenter"),
};

export default () => (
  <eventbox
    onClickRelease={(_, { button }) => actions[button]?.()}
    child={
      <box
        css={`
          margin-left: 8px;
        `}
        spacing={8}
        valign={Gtk.Align.CENTER}
      >
        <CPUMeter />
        <RAMMeter />
        {hasNvidiaGpu && (
          <>
            <GPUMeter />
            <VRAMMeter />
          </>
        )}
        <DiskMeter />
        <BatteryMeter />
      </box>
    }
  />
);
