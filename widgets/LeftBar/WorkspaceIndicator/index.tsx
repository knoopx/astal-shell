import Niri from "../../../support/niri";
import { Gtk } from "astal/gtk3";
import { bind } from "astal";
import niri from "../../../support/niri";

export default () => {
  return (
    <box
      css={`
        padding: 4px;
      `}
      orientation={Gtk.Orientation.VERTICAL}
      halign={Gtk.Align.CENTER}
      spacing={6}
    >
      {bind(niri, "workspaces").as((workspaces) =>
        workspaces?.map((workspace) => {
          return (
            <button
              css={`
                padding: 0;
                background: none;
                border: none;
                min-width: 6px;
                min-height: 24px;
                border-radius: 3px;
                background-color: ${workspace.is_focused ? '@theme_selected_bg_color' : 'rgba(255, 255, 255, 0.9)'};
                transition: all 0.2s ease;
              `}
              onClicked={() => niri.focusWorkspace(workspace.id)}
            />
          );
        })
      )}
    </box>
  );
};
