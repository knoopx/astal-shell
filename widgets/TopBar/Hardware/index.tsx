import { exec } from "ags/process";
import { Gtk } from "ags/gtk3";
import { hasNvidiaGpu, hasBattery } from "../../../support/util";
import CPUMeter from "./CPUMeter";
import RAMMeter from "./RAMMeter";
import GPUMeter from "./GPUMeter";
import VRAMMeter from "./VRAMMeter";
import DiskMeter from "./DiskMeter";
import BatteryMeter from "./BatteryMeter";

const actions = {
  1: () => {
    try {
      exec("missioncenter");
    } catch (error) {
      console.error("Failed to execute missioncenter:", error);
    }
  },
};

export default () => (
  <eventbox
    onButtonReleaseEvent={(_, event) => actions[event.button]?.()}
  >
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
        <box spacing={8}>
          <GPUMeter />
          <VRAMMeter />
        </box>
      )}
      <DiskMeter />
      {hasBattery && <BatteryMeter />}
    </box>
  </eventbox>
);
