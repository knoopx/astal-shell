import { App, Astal, type Gdk } from "astal/gtk3";
import { Gtk } from "astal/gtk3";
import { bind, derive, Variable } from "astal";

import Clock from "./Clock";
import WorkspaceIndicator from "./WorkspaceIndicator";
import Playback from "./Playback";
import Network from "./Network";
import SysTray from "./SysTray";
import QuickSettings from "./QuickSettings";
import Hardware from "./Hardware";
import Niri from "../../support/niri";
import niri from "../../support/niri";
import Weather from "./Weather";

export default ({ monitor }: { monitor: Gdk.Monitor }) => {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;
  const visible = Variable(false);
  niri.activeWindowId.subscribe((x) => {
    visible.set(x != null);
  });

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
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={App}
      css={`
        background: rgba(0, 0, 0, 0.5);
      `}
    >
      {/* {bind(visible).as((v) => ( */}
      <centerbox
        // visible={visible()}
        start_widget={LeftModules}
        center_widget={CenterModules}
        end_widget={RightModules}
      />
      {/* ))} */}
      {/* <revealer
        // revealChild={visible()}
        // transitionDuration={globalTransition}
        // transitionType={Gtk.RevealerTransitionType.NONE}
        // transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
        child={
          <centerbox
            // visible={visible()}
            start_widget={LeftModules}
            center_widget={CenterModules}
            end_widget={RightModules}
          />
        }
      /> */}
    </window>
  );

  visible.subscribe((v) => {
    win.opacity = v ? 1 : 0;
    win.reactive = v ? 0 : 1;
  });

  return win;
};
