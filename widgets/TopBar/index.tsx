import { onCleanup } from "ags";
import app from "ags/gtk4/app";
import { Gtk, Astal } from "ags/gtk4";
import CenterWidgets from "../CenterWidgets";
import Playback from "./Playback";
import SysTray from "./SysTray";
import Network from "./Network";
import DynamicQuickSettings from "./QuickSettings/DynamicQuickSettings";
import CPUMeter from "./Hardware/CPUMeter";
import RAMMeter from "./Hardware/RAMMeter";
import GPUMeter from "./Hardware/GPUMeter";
import VRAMMeter from "./Hardware/VRAMMeter";
import DiskMeter from "./Hardware/DiskMeter";
import BatteryMeter from "./Hardware/BatteryMeter";
import Avatar from "./Avatar";
import { setupOverviewOpacityTransition } from "../../support/window";
import { getBarMargins } from "../../support/displays";
import { hasNvidiaGpu, hasBattery } from "../../support/util";

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
      <Network />
      <box
        spacing={8}
        valign={Gtk.Align.CENTER}
        css={`
          margin-left: 8px;
        `}
      >
        <CPUMeter />
        <RAMMeter />
        {hasNvidiaGpu && <GPUMeter />}
        {hasNvidiaGpu && <VRAMMeter />}
        <DiskMeter />
        {hasBattery && <BatteryMeter />}
      </box>
      <DynamicQuickSettings />
      <SysTray />
      <Avatar />
    </box>
  );

  const margins = getBarMargins(monitor);
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

  setupOverviewOpacityTransition(win as unknown as Gtk.Widget);

  return win;
};
