import { Gtk, Astal } from "ags/gtk4";
import app from "ags/gtk4/app";
import { onCleanup } from "ags";
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
      <box orientation={Gtk.Orientation.VERTICAL} valign={Gtk.Align.CENTER} vexpand={true}>
        <WorkspaceIndicator />
      </box>
    </window>
  );

  const signalId = niri.connect("notify::overview-is-open", () => {
    applyOpacityTransition(win as unknown as Gtk.Widget, niri.overviewIsOpen);
  });

  onCleanup(() => {
    niri.disconnect(signalId);
  });

  return win;
};
