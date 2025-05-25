import { App, Astal } from "astal/gtk3";
import { Gtk } from "astal/gtk3";
import WorkspaceIndicator from "./WorkspaceIndicator";
import niri from "../../support/niri";

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
