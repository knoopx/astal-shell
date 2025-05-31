import { App, Astal } from "astal/gtk3";
import { Gtk } from "astal/gtk3";
import WorkspaceIndicator from "./WorkspaceIndicator";
import niri from "../../support/niri";
import { applyOpacityTransition } from "../../support/transitions";

export default ({ monitor }: { monitor: number }) => {
  const { TOP, LEFT, BOTTOM } = Astal.WindowAnchor;

  const win = (
    <window
      name="left-bar"
      monitor={monitor}
      visible={false}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={TOP | LEFT | BOTTOM}
      marginTop={110}
      marginBottom={96}
      marginLeft={16}
      application={App}
      css={`
        background: transparent;
      `}
      child={
        <box
          orientation={Gtk.Orientation.VERTICAL}
          valign={Gtk.Align.CENTER}
          vexpand={true}
          child={<WorkspaceIndicator />}
        />
      }
    />
  );

  niri.overviewIsOpen.subscribe((v) => {
    applyOpacityTransition(win, v);
  });

  return win;
};
