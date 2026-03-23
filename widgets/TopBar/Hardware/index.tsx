import { exec } from "ags/process";
import { Gtk } from "ags/gtk4";
import Gdk from "gi://Gdk?version=4.0";
import { hasNvidiaGpu, hasBattery } from "../../../support/util";
import CPUMeter from "./CPUMeter";
import RAMMeter from "./RAMMeter";
import GPUMeter from "./GPUMeter";
import VRAMMeter from "./VRAMMeter";
import DiskMeter from "./DiskMeter";
import BatteryMeter from "./BatteryMeter";

export default () => (
  <box
    css={`
      margin-left: 8px;
    `}
    spacing={8}
    valign={Gtk.Align.CENTER}
  >
    <Gtk.GestureClick
      button={Gdk.BUTTON_PRIMARY}
      onReleased={() => {
        try {
          exec("missioncenter");
        } catch (error) {
          console.error("Failed to execute missioncenter:", error);
        }
      }}
    />
    <CPUMeter />
    <RAMMeter />
    {hasNvidiaGpu && <GPUMeter />}
    {hasNvidiaGpu && <VRAMMeter />}
    <DiskMeter />
    {hasBattery && <BatteryMeter />}
  </box>
);
