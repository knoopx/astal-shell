import { App, Astal } from "astal/gtk3";
import { Gtk } from "astal/gtk3";
import { Variable, bind } from "astal";
import CenterWidgets from "../CenterWidgets";
import Playback from "./Playback";
import Network from "./Network";
import SysTray from "./SysTray";
import QuickSettings from "./QuickSettings";
import Hardware from "./Hardware";
import Avatar from "./Avatar";
import niri from "../../support/niri";
import { applyOpacityTransition } from "../../support/transitions";

export default ({ monitor }: { monitor: number }) => {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;
  const showQuickSettings = Variable(false);

  const LeftModules = (
    <box spacing={8} hexpand halign={Gtk.Align.START}>
      {[<Playback />]}
    </box>
  );

  const CenterModules = <CenterWidgets />;

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

      <box>
        <revealer
          revealChild={showQuickSettings((show) => !show)}
          transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
          transitionDuration={300}
          child={
            <box spacing={8}>
              <Network />
              <Hardware />
            </box>
          }
        />
        <revealer
          revealChild={showQuickSettings((show) => show)}
          transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
          transitionDuration={300}
          child={<QuickSettings />}
        />
      </box>

      <Avatar
        onToggle={() => showQuickSettings.set(!showQuickSettings.get())}
      />
    </box>
  );

  const win = (
    <window
      name="top-bar"
      monitor={monitor}
      visible={false}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={TOP | LEFT | RIGHT}
      marginTop={104}
      marginLeft={300}
      marginRight={300}
      application={App}
      css={`
        background: transparent;
      `}
      child={
        <centerbox
          start_widget={LeftModules}
          center_widget={CenterModules}
          end_widget={RightModules}
        />
      }
    />
  );

  niri.overviewIsOpen.subscribe((v) => {
    applyOpacityTransition(win, v);
  });

  return win;
};
