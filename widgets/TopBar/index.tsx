import { onCleanup } from "ags";
import app from "ags/gtk4/app";
import { Gtk, Astal } from "ags/gtk4";
import CenterWidgets from "../CenterWidgets";
import Playback from "./Playback";
import SysTray from "./SysTray";
import Network from "./Network";
import Volume from "./QuickSettings/Volume";
import ShutdownButton from "./QuickSettings/ShutdownButton";
import RebootButton from "./QuickSettings/RebootButton";
import LogoutButton from "./QuickSettings/LogoutButton";
import CPUMeter from "./Hardware/CPUMeter";
import RAMMeter from "./Hardware/RAMMeter";
import GPUMeter from "./Hardware/GPUMeter";
import VRAMMeter from "./Hardware/VRAMMeter";
import DiskMeter from "./Hardware/DiskMeter";
import BatteryMeter from "./Hardware/BatteryMeter";
import Avatar from "./Avatar";
import niri from "../../support/niri.tsx";
import { applyOpacityTransition } from "../../support/transitions";
import {
  getDisplayId,
  getBarMargins,
  hasNvidiaGpu,
  hasBattery,
} from "../../support/util";
import { exec } from "ags/process";
import Gdk from "gi://Gdk?version=4.0";

export default ({ monitor }: { monitor: number }) => {
  const LeftModules = (
    <box spacing={8} halign={Gtk.Align.START} $type="start">
      <Playback />
    </box>
  );

  const CenterModules = (
    <box halign={Gtk.Align.CENTER} $type="center">
      <CenterWidgets />
    </box>
  );

  const RightModules = (
    <box
      spacing={8}
      halign={Gtk.Align.END}
      $type="end"
      css={`
        margin-right: 4px;
      `}
    >
      <Volume />
      <Network />
      <box
        spacing={8}
        valign={Gtk.Align.CENTER}
        css={`
          margin-left: 8px;
        `}
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
      <box
        spacing={4}
        valign={Gtk.Align.CENTER}
        css={`
          margin-left: 8px;
        `}
      >
        <ShutdownButton />
        <RebootButton />
        <LogoutButton />
      </box>
      <SysTray />
      <Avatar />
    </box>
  );

  const displayId = getDisplayId(monitor);
  const margins = getBarMargins(displayId);
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

  const win = (
    <window
      name="top-bar"
      monitor={monitor}
      application={app}
      visible={false}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={TOP | LEFT | RIGHT}
      marginTop={margins.vertical}
      marginLeft={margins.horizontal}
      marginRight={margins.horizontal}
      css={`
        background: transparent;
      `}
    >
      <centerbox>
        {LeftModules}
        {CenterModules}
        {RightModules}
      </centerbox>
    </window>
  );

  // Connect signals and store IDs for cleanup
  const overviewSignalId = niri.connect("notify::overview-is-open", () => {
    applyOpacityTransition(win as unknown as Gtk.Widget, niri.overviewIsOpen);
  });

  // Register cleanup to disconnect signals when component is destroyed
  onCleanup(() => {
    try {
      if (overviewSignalId) {
        niri.disconnect(overviewSignalId);
      }
    } catch (error) {
      console.warn("Error disconnecting signal:", error);
    }
  });

  return win;
};
