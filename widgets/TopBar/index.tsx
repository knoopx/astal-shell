import { createState, With } from "ags";
import app from "ags/gtk3/app";
import { Gtk, Astal } from "ags/gtk3";
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
  const [showQuickSettings, setShowQuickSettings] = createState(false);

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
      <SysTray />
      <box>
        <With value={showQuickSettings}>
          {(isOpen) => (
            <box>
              <revealer
                revealChild={!isOpen}
                transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                transitionDuration={300}
              >
                <box spacing={8}>
                  <Network />
                  <Hardware />
                </box>
              </revealer>
              <revealer
                revealChild={isOpen}
                transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
                transitionDuration={300}
              >
                <QuickSettings />
              </revealer>
            </box>
          )}
        </With>
      </box>
      <Avatar onToggle={() => setShowQuickSettings((prev) => !prev)} />
    </box>
  );

  const horizontalMargin = 300;
  const verticalMargin = 100;
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

  const win = (
    <window
      name="top-bar"
      monitor={monitor}
      application={app}
      visible={false}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={TOP | LEFT | RIGHT}
      marginTop={verticalMargin}
      marginLeft={horizontalMargin}
      marginRight={horizontalMargin}
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

  niri.connect("notify::overview-is-open", (obj) => {
    applyOpacityTransition(win, obj.overviewIsOpen);
  });

  return win;
};
