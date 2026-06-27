import { createBinding, For } from "ags";
import app from "ags/gtk4/app";
import niri, { NiriWindow } from "../../support/niri";
import { Astal, Gtk } from "ags/gtk4";
import Gdk from "gi://Gdk?version=4.0";
import { getDisplayId, getBarMargins } from "../../support/util";
import { getCurrentTheme } from "../../support/theme";
import { setupOverviewOpacityTransition } from "../../support/window";
import { getAppIcon } from "../../support/icons";
import Icon from "../Icon";

function handleWindowClick(gesture: Gtk.GestureClick, windowId: number): void {
  const btn = gesture.get_current_button();
  if (btn === Gdk.BUTTON_PRIMARY) {
    niri.focusWindow(windowId).then(() => niri.centerColumn());
  } else if (btn === Gdk.BUTTON_MIDDLE) {
    niri.closeWindow(windowId);
  }
}

function handleWorkspaceScroll(
  _controller: Gtk.EventControllerScroll,
  _dx: number,
  dy: number,
): boolean {
  const currentWorkspace = niri.workspaces.find((ws) => ws.is_active);
  if (!currentWorkspace || currentWorkspace.windows.length === 0) return false;

  const windows = currentWorkspace.windows;
  const currentFocusedIndex = windows.findIndex((w) => w.is_focused);
  const direction = dy > 0 ? 1 : -1;

  let nextIndex: number;
  if (direction > 0) {
    nextIndex =
      currentFocusedIndex >= windows.length - 1 ? 0 : currentFocusedIndex + 1;
  } else {
    nextIndex =
      currentFocusedIndex <= 0 ? windows.length - 1 : currentFocusedIndex - 1;
  }

  const nextWindow = windows[nextIndex];
  if (nextWindow) {
    niri.focusWindow(nextWindow.id);
  }

  return true;
}

const WindowButton = ({
  window,
  activeWindowId,
}: {
  window: NiriWindow;
  activeWindowId: ReturnType<typeof createBinding<unknown>>;
}) => {
  const theme = getCurrentTheme();
  const isFocused = activeWindowId.as((id) => id === window.id);

  return (
    <box tooltipText={window.title ?? window.app_id ?? undefined}>
      <Gtk.GestureClick
        button={0}
        onPressed={(gesture: Gtk.GestureClick) =>
          handleWindowClick(gesture, window.id)
        }
      />
      <box
        cssClasses={isFocused((f) => [
          f ? "app-icon focused" : "app-icon unfocused",
        ])}
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
        <Icon
          name={getAppIcon(window.app_id)}
          size={42}
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

const AppIconsBar = ({
  currentWorkspaceWindows,
  activeWindowId,
}: {
  currentWorkspaceWindows: ReturnType<typeof createBinding<unknown>>;
  activeWindowId: ReturnType<typeof createBinding<unknown>>;
}) => {
  return (
    <box cssClasses={["app-icons"]} spacing={8} $type="center">
      <Gtk.EventControllerScroll
        flags={Gtk.EventControllerScrollFlags.VERTICAL}
        onScroll={handleWorkspaceScroll}
      />
      <For
        each={currentWorkspaceWindows.as((windows: NiriWindow[]) => {
          return [...windows].sort((a, b) => {
            const ax = a.layout?.pos_in_scrolling_layout?.[0] ?? 0;
            const bx = b.layout?.pos_in_scrolling_layout?.[0] ?? 0;
            return ax - bx;
          });
        })}
      >
        {(window: NiriWindow) => (
          <WindowButton
            window={window}
            activeWindowId={activeWindowId}
          />
        )}
      </For>
    </box>
  );
};

export default ({ monitor }: { monitor: number }) => {
  const currentWorkspace = createBinding(niri, "workspaces").as((workspaces) =>
    workspaces.find((ws) => ws.is_active),
  );

  const currentWorkspaceWindows = currentWorkspace.as(
    (ws) => ws?.windows ?? [],
  );

  const activeWindowId = currentWorkspace.as(
    (ws) => ws?.active_window_id ?? -1,
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
      css="background: transparent;"
    >
      <centerbox>
        <AppIconsBar
          currentWorkspaceWindows={currentWorkspaceWindows}
          activeWindowId={activeWindowId}
        />
      </centerbox>
    </window>
  );

  setupOverviewOpacityTransition(win as unknown as Gtk.Widget);

  return win;
};
