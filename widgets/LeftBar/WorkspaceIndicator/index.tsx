import { Gtk } from "ags/gtk3";
import { createBinding, For } from "ags";
import niri, { NiriWorkspace } from "../../../support/niri";
import { getCurrentTheme } from "../../../support/theme";

export default () => {
  const theme = getCurrentTheme();
  const workspaces = createBinding(niri, "workspaces");

  return (
    <box
      css={`
        padding: 4px;
      `}
      orientation={Gtk.Orientation.VERTICAL}
      halign={Gtk.Align.CENTER}
      spacing={6}
    >
      <For each={workspaces}>
        {(workspace: NiriWorkspace) => (
          <button
            css={createBinding(workspace, "is_focused").as(
              (focused) => `
              padding: 0;
              background: none;
              border: none;
              min-width: 6px;
              min-height: 24px;
              border-radius: ${theme.borderRadius.small};
              background-color: ${
                focused ? theme.accent.primary : theme.accent.secondary
              };
              transition: all 0.2s ease;
            `,
            )}
            onClicked={() => {
              niri.focusWorkspace(workspace.idx);
            }}
          />
        )}
      </For>
    </box>
  );
};
