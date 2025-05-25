import Niri from "../../../support/niri";
import { Gtk } from "astal/gtk3";
import { bind } from "astal";
import niri from "../../../support/niri";

export default () => {
  return (
    <centerbox
      css={`
        padding-left: 8px;
        padding-right: 8px;
      `}
      valign={Gtk.Align.CENTER}
    >
      {bind(niri, "workspaces").as((workspaces) =>
        workspaces?.map((workspace) => {
          return (
            <button
              key={workspace.id}
              hexpand={false}
              vexpand={false}
              css={`
                padding: 0;
                background: none;
                font-size: 12px;
              `}
              onClick={() => niri.focusWorkspace(workspace.id)}
            >
              <label>{workspace.is_focused ? "●" : "○"}</label>
            </button>
          );
        })
      )}
    </centerbox>
  );
};
