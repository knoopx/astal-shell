import { createBinding, For, onCleanup } from "ags";
import app from "ags/gtk4/app";
import niri, { NiriWindow } from "../../support/niri";
import AstalApps from "gi://AstalApps";
import { applyOpacityTransition } from "../../support/transitions";
import { Astal, Gtk } from "ags/gtk4";
import Gdk from "gi://Gdk?version=4.0";
import { getDisplayId, getBarMargins } from "../../support/util";
import { getCurrentTheme } from "../../support/theme";

export default ({ monitor }: { monitor: number }) => {
  const apps = new AstalApps.Apps();

  // Create bindings to current workspace windows and active window
  const currentWorkspace = createBinding(niri, "workspaces").as((workspaces) =>
    workspaces.find((ws) => ws.is_active),
  );

  const currentWorkspaceWindows = currentWorkspace.as(
    (ws) => ws?.windows ?? [],
  );

  const activeWindowId = currentWorkspace.as(
    (ws) => ws?.active_window_id ?? -1,
  );

  // Helper function to get application icon
  const getAppIcon = (appId: string): string => {
    if (!appId) return "application-x-executable";

    let app = apps.list.find(
      (a) => a.entry === appId || a.entry === `${appId}.desktop`,
    );

    if (!app) {
      app = apps.list.find(
        (a) => a.wmClass?.toLowerCase() === appId.toLowerCase(),
      );
    }

    if (!app) {
      const results = apps.fuzzy_query(appId);
      app = results[0];
    }

    return app?.iconName || "application-x-executable";
  };

  // Window button component
  const WindowButton = ({ window }: { window: NiriWindow }) => {
    const theme = getCurrentTheme();
    const isFocused = activeWindowId.as((id) => id === window.id);
    return (
      <box
        tooltipText={window.title ?? window.app_id ?? undefined}
      >
        <Gtk.GestureClick
          button={0}
          onPressed={(gesture: Gtk.GestureClick) => {
            const btn = gesture.get_current_button();
            if (btn === Gdk.BUTTON_PRIMARY) {
              niri.focusWindow(window.id).then(() => niri.centerColumn());
            } else if (btn === Gdk.BUTTON_MIDDLE) {
              niri.closeWindow(window.id);
            }
          }}
        />
        <box
          cssClasses={isFocused((f) => [f ? "app-icon focused" : "app-icon unfocused"])}
          css={isFocused(
            (f) => `
            border-radius: ${theme.borderRadius.medium};
            padding: ${theme.spacing.small};
            background-color: transparent;
            border: none;
            opacity: ${f ? theme.opacity.high : theme.opacity.low};
          `,
          )}
        >
          <image
            iconName={
              window.app_id
                ? getAppIcon(window.app_id)
                : "application-x-executable"
            }
            pixelSize={42}
            css={isFocused(
              (f) => `
            color: ${f ? theme.text.focused : theme.text.unfocused};
          `,
            )}
          />
        </box>
      </box>
    );
  };

  const CenterModules = (
    <box
      cssClasses={["app-icons"]}
      spacing={8}
      $type="center"
    >
      <Gtk.EventControllerScroll
        flags={Gtk.EventControllerScrollFlags.VERTICAL}
        onScroll={(_controller: Gtk.EventControllerScroll, _dx: number, dy: number) => {
          const currentWorkspace = niri.workspaces.find((ws) => ws.is_active);
          if (!currentWorkspace || currentWorkspace.windows.length === 0)
            return false;

          const windows = currentWorkspace.windows;
          const currentFocusedIndex = windows.findIndex((w) => w.is_focused);

          const direction = dy > 0 ? 1 : -1;

          let nextIndex: number;
          if (direction > 0) {
            nextIndex =
              currentFocusedIndex >= windows.length - 1
                ? 0
                : currentFocusedIndex + 1;
          } else {
            nextIndex =
              currentFocusedIndex <= 0
                ? windows.length - 1
                : currentFocusedIndex - 1;
          }

          const nextWindow = windows[nextIndex];
          if (nextWindow) {
            niri.focusWindow(nextWindow.id);
          }

          return true;
        }}
      />
      <For
        each={currentWorkspaceWindows.as((windows) => {
          return [...windows].sort((a, b) => {
            const ax = a.layout?.pos_in_scrolling_layout?.[0] ?? 0;
            const bx = b.layout?.pos_in_scrolling_layout?.[0] ?? 0;
            return ax - bx;
          });
        })}
      >
        {(window: NiriWindow) => <WindowButton window={window} />}
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

  const signalId = niri.connect("notify::overview-is-open", () => {
    applyOpacityTransition(win as unknown as Gtk.Widget, niri.overviewIsOpen);
  });

  onCleanup(() => {
    niri.disconnect(signalId);
  });

  return win;
};
