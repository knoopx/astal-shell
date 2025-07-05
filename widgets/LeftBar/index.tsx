import { Gtk, Astal } from "ags/gtk3";
import app from "ags/gtk3/app";
import WorkspaceIndicator from "./WorkspaceIndicator";
import niri from "../../support/niri";
import { applyOpacityTransition } from "../../support/transitions";

export default ({ monitor }: { monitor: number }) => {
  const { TOP, LEFT, BOTTOM } = Astal.WindowAnchor;

  const win = (
    <window
      name="left-bar"
      monitor={monitor}
      application={app}
      visible={false}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={LEFT | TOP | BOTTOM}
      marginLeft={16}
      marginTop={110}
      marginBottom={96}
      css={`
        background: transparent;
      `}
    >
      <box
        vertical
        valign={Gtk.Align.CENTER}
        vexpand={true}
      >
        <WorkspaceIndicator />
      </box>
    </window>
  );

  // Store signal connection ID for proper cleanup
  const signalId = niri.connect("notify::overview-is-open", (obj) => {
    applyOpacityTransition(win, obj.overviewIsOpen);
  });

  // Clean up signal connection when window is destroyed
  win.connect("destroy", () => {
    niri.disconnect(signalId);
  });

  return win;
};
