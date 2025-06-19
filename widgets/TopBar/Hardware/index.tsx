import { subprocess } from "astal";
import { Astal, Gtk } from "astal/gtk3";
import { hasNvidiaGpu, hasBattery } from "../../../support/util";
import CPUMeter from "./CPUMeter";
import RAMMeter from "./RAMMeter";
import GPUMeter from "./GPUMeter";
import VRAMMeter from "./VRAMMeter";
import DiskMeter from "./DiskMeter";
import BatteryMeter from "./BatteryMeter";

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
        {hasNvidiaGpu && <GPUMeter />}
        {hasNvidiaGpu && <VRAMMeter />}
        <DiskMeter />
        {hasBattery && <BatteryMeter />}
      </box>
    }
  />
);
