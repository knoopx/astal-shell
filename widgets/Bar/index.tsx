import { App, Astal } from "astal/gtk3";
import { Gtk } from "astal/gtk3";
import Clock from "./Clock";
import WorkspaceIndicator from "./WorkspaceIndicator";
import Playback from "./Playback";
import Network from "./Network";
import SysTray from "./SysTray";
import QuickSettings from "./QuickSettings";
import Hardware from "./Hardware";
import niri from "../../support/niri";
import Weather from "./Weather";

export default ({ monitor }: { monitor: number }) => {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

  const LeftModules = (
    <box spacing={8} hexpand halign={Gtk.Align.START}>
      <WorkspaceIndicator />
      <Playback />
    </box>
  );

  const CenterModules = (
    <box>
      <Clock />
      <Weather />
    </box>
  );

  const RightModules = (
    <box
      spacing={8}
      css={`
        margin-right: 4px;
      `}
      hexpand
      halign={Gtk.Align.END}
    >
      <SysTray />
      <Network />
      <Hardware />
      <QuickSettings monitor={monitor} />
    </box>
  );

  const win = (
    <window
      name="bar"
      monitor={monitor}
      visible={false}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={TOP | LEFT | RIGHT}
      marginTop={110}
      marginLeft={300}
      marginRight={300}
      application={App}
      css={`
        background: transparent;
      `}
    >
      <centerbox
        start_widget={LeftModules}
        center_widget={CenterModules}
        end_widget={RightModules}
      />
    </window>
  );

  niri.overviewIsOpen.subscribe((v) => {
    if (v) {
      setTimeout(() => {
        win.set_visible(true);
      }, 100);
    } else {
      win.set_visible(false);
    }
  });

  return win;
};
