import { createBinding, With, For } from "ags";
import app from "ags/gtk3/app";
import niri from "../../support/niri";
import AstalApps from "gi://AstalApps";
import { applyOpacityTransition } from "../../support/transitions";
import { Gtk, Astal } from "ags/gtk3";
import { getDisplayId, getBarMargins } from "../../support/util";
import { getCurrentTheme } from "../../support/theme";

export default ({ monitor }: { monitor: number }) => {
  const apps = new AstalApps.Apps();

  // Create a direct binding to current workspace windows
   const currentWorkspaceWindows = createBinding(niri, "workspaces").as(
     (workspaces) => {
       const currentWorkspace = workspaces.find((ws) => ws.is_active);
       return currentWorkspace?.windows || [];
     }
   );


  // Helper function to get application icon
  const getAppIcon = (appId: string): string => {
    if (!appId) return "application-x-executable";

    let app = apps.list.find(
      (a) => a.entry === appId || a.entry === `${appId}.desktop`
    );

    if (!app) {
      app = apps.list.find(
        (a) => a.wmClass?.toLowerCase() === appId.toLowerCase()
      );
    }

    if (!app) {
      const results = apps.fuzzy_query(appId);
      app = results[0];
    }

    return app?.iconName || "application-x-executable";
  };

  // Window button component
const WindowButton = ({ window }: { window: any }) => {
  const theme = getCurrentTheme();
  const isFocused = createBinding(window, "is_focused");
  return (
    <button
      class={isFocused((f) => `app-icon ${f ? "focused" : "unfocused"}`)}
        css={isFocused((f) => `
          border-radius: ${theme.borderRadius.medium};
          padding: ${theme.spacing.small};
          background-color: transparent;
          border: none;
          box-shadow: none;
          opacity: ${f ? theme.opacity.high : theme.opacity.low};
          transition: all 0.2s ease-in-out;
        `)}
      tooltipText={window.title || window.app_id}
      onClicked={() => {
        niri.focusWindow(window.id);
      }}
      onButtonPressEvent={(self, event) => {
        if (event.button === 3) {
          niri.closeWindow(window.id);
          return true;
        }
        return false;
      }}
    >
      <icon
        icon={
          window.app_id ? getAppIcon(window.app_id) : "application-x-executable"
        }
        css={isFocused((f) => `
          font-size: 42px;
          color: ${f
            ? theme.text.focused
            : theme.text.unfocused};
          transition: color 0.2s;
        `)}
      />
    </button>
  );
};



   const CenterModules = (
     <box
       class="app-icons"
       spacing={8}
       $type="center"
       onScrollEvent={(self, event) => {
         const currentWorkspace = niri.workspaces.find((ws) => ws.is_active);
         if (!currentWorkspace || currentWorkspace.windows.length === 0)
           return false;

         const windows = currentWorkspace.windows;
         const currentFocusedIndex = windows.findIndex((w) => w.is_focused);

         // Get scroll direction from the deltas array
         let direction = 1; // default forward
         try {
           const deltas = (event as any).get_scroll_deltas();
           // The actual scroll value is in the third element (index 2)
           if (Array.isArray(deltas) && deltas.length >= 3) {
             const scrollValue = deltas[2];
             if (typeof scrollValue === "number") {
               direction = scrollValue > 0 ? 1 : -1;
             }
           }
         } catch (e) {
           // Fallback to event.direction if deltas fail
           if (event.direction === 0) {
             // UP
             direction = -1;
           } else if (event.direction === 1) {
             // DOWN
             direction = 1;
           }
         }

         let nextIndex: number;
         if (direction > 0) {
           // Forward
           nextIndex =
             currentFocusedIndex >= windows.length - 1
               ? 0
               : currentFocusedIndex + 1;
         } else {
           // Backward
           nextIndex =
             currentFocusedIndex <= 0
               ? windows.length - 1
               : currentFocusedIndex - 1;
         }

         const nextWindow = windows[nextIndex];
         if (nextWindow) {
           niri.focusWindow(nextWindow.id);
         }

         return true; // Event handled
       }}
     >
<For each={currentWorkspaceWindows.as(windows => {
           return [...windows].sort((a, b) => {
             const ax = a.layout?.pos_in_scrolling_layout?.[0] ?? 0;
             const bx = b.layout?.pos_in_scrolling_layout?.[0] ?? 0;
             return ax - bx;
           });
         })}>
         {(window: any) => <WindowButton window={window} />}
       </For>
     </box>
   );

  const displayId = getDisplayId(monitor);
  const margins = getBarMargins(displayId);
  const { BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;

  const win = (
    <window
      name="bottom-bar"
      monitor={monitor}
      application={app}
      visible={false}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={BOTTOM | LEFT | RIGHT}
      marginBottom={margins.vertical}
      marginLeft={margins.horizontal}
      marginRight={margins.horizontal}
        css={`
         background: transparent;
       `}
    >
      <centerbox>{CenterModules}</centerbox>
    </window>
  );

  niri.connect("notify::overview-is-open", (obj) => {
    applyOpacityTransition(win, obj.overviewIsOpen);
  });

  return win;
};
