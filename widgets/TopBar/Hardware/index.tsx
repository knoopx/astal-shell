import { subprocess } from "astal";
import { Astal, Gtk } from "astal/gtk3";
import CPUMeter from "./CPUMeter";
import RAMMeter from "./RAMMeter";
import GPUMeter from "./GPUMeter";
import VRAMMeter from "./VRAMMeter";
import DiskMeter from "./DiskMeter";

// Check if nvidia-smi is available
const hasNvidiaSmi = (() => {
  try {
    subprocess(["which", "nvidia-smi"]);
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
        {hasNvidiaSmi && (
          <>
            <GPUMeter />
            <VRAMMeter />
          </>
        )}
        <DiskMeter />
      </box>
    }
  />
);
