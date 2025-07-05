// Niri IPC integration compliant with official niri-ipc API
// Reference: https://yalter.github.io/niri/niri_ipc/

import GObject, { register, property } from "ags/gobject";
import { execAsync, subprocess } from "ags/process";
import { createState } from "ags";
import GLib from "gi://GLib";

export type WindowData = {
  id: number;
  title: string | null;
  app_id: string | null;
  pid: number | null;
  workspace_id: number | null;
  is_focused: boolean;
  is_floating: boolean;
  is_urgent: boolean;
};

// @ts-ignore: TypeScript has conflicts with AGS GObject decorators for this class
@register({ GTypeName: "NiriWindow" })
// @ts-ignore
export class NiriWindow extends GObject.Object {
  // @ts-ignore
  @property(Number)
  id = 0;

  // @ts-ignore
  @property(String)
  title: string | null = null;

  // @ts-ignore
  @property(String)
  app_id: string | null = null;

  // @ts-ignore
  @property(Number)
  pid: number | null = null;

  // @ts-ignore
  @property(Number)
  workspace_id: number | null = null;

  // @ts-ignore
  @property(Boolean)
  is_focused = false;

  // @ts-ignore
  @property(Boolean)
  // @ts-ignore
  is_floating = false;

  // @ts-ignore
  @property(Boolean)
  is_urgent = false;

  constructor(data: WindowData) {
    super();
    this.updateFromData(data);
  }

  updateFromData(data: WindowData) {
    this.id = data.id;
    this.title = data.title ?? null;
    this.app_id = data.app_id ?? null;
    this.pid = data.pid ?? null;
    this.workspace_id = data.workspace_id ?? null;
    this.is_focused = data.is_focused || false;
    this.is_floating = data.is_floating || false;
    this.is_urgent = data.is_urgent || false;
  }
}

export type WorkspaceData = {
  id: number; // u64 in official API
  idx: number; // u8 in official API - index on monitor
  name: string | null; // Option<String> in official API
  output: string | null; // Option<String> in official API - output name
  is_urgent: boolean; // renamed from urgent to match official API
  is_active: boolean;
  is_focused: boolean;
  active_window_id: number | null; // Option<u64> in official API
  windows: WindowData[]; // Raw data from niri API
};

@register({ GTypeName: "NiriWorkspace" })
export class NiriWorkspace extends GObject.Object {
  @property(Number)
  id = 0;

  @property(Number)
  idx = 0;

  @property(String)
  name: string | null = null;

  @property(String)
  output: string | null = null;

  @property(Boolean)
  is_urgent = false;

  @property(Boolean)
  is_active = false;

  @property(Boolean)
  is_focused = false;

  @property(Number)
  active_window_id: number | null = null;

  @property(Array)
  windows: NiriWindow[] = [];

  constructor(data: WorkspaceData) {
    super();
    this.updateFromData(data);
  }

  updateFromData(data: WorkspaceData) {
    this.id = data.id;
    this.idx = data.idx;
    this.name = data.name ?? null;
    this.output = data.output ?? null;
    this.is_urgent = data.is_urgent || false;
    this.is_active = data.is_active || data.is_focused;
    this.is_focused = data.is_focused || false;
    this.active_window_id = data.active_window_id ?? null;
    // windows will be updated separately via updateWorkspaceWindows
  }
}

@register({ GTypeName: "Niri" })
export class Niri extends GObject.Object {
  @property(Number)
  activeWorkspaceIdx = 1;

  @property(Array)
  workspaces: NiriWorkspace[] = [];

  @property(Array)
  windows: NiriWindow[] = [];

  @property(Boolean)
  overviewIsOpen = false;

  private activeWindowId;
  private setActiveWindowId;
  private updateTimeout: number | null = null;

  // Object persistence maps similar to official Astal implementation
  private windowsMap = new Map<number, NiriWindow>();
  private workspacesMap = new Map<number, NiriWorkspace>();

  constructor() {
    super();
    [this.activeWindowId, this.setActiveWindowId] = createState(-1);

    // Start event stream - it will send initial WorkspacesChanged and WindowsChanged events
    subprocess(
      ["niri", "msg", "--json", "event-stream"],
      (event) => this.handleEvent(JSON.parse(event)),
      (err) => console.error(err)
    );
  }

  handleEvent(event: any) {
    for (const key in event) {
      const value = event[key];
      switch (key) {
        case "OverviewOpenedOrClosed":
          this.onOverviewOpenedOrClosed(value.is_open);
          break;
        case "WindowFocusChanged":
          this.onWindowFocusChanged(value.id);
          break;
        case "WorkspacesChanged":
          this.onWorkspacesChanged(value.workspaces);
          break;
        case "WorkspaceActivated":
          this.onWorkspaceActivated(value.id, value.focused);
          break;
        case "WorkspaceUrgencyChanged":
          this.onWorkspaceUrgencyChanged(value.id, value.urgent);
          break;
        case "WorkspaceActiveWindowChanged":
          this.onWorkspaceActiveWindowChanged(
            value.workspace_id,
            value.active_window_id
          );
          break;
        case "WindowsChanged":
          this.onWindowsChanged(value.windows);
          break;
        case "WindowOpenedOrChanged":
          this.onWindowOpenedOrChanged(value.window);
          break;
        case "WindowClosed":
          this.onWindowClosed(value.id);
          break;
        case "WindowUrgencyChanged":
          this.onWindowUrgencyChanged(value.id, value.urgent);
          break;
        case "KeyboardLayoutsChanged":
          // Handle if needed
          break;
        case "KeyboardLayoutSwitched":
          // Handle if needed
          break;
      }
    }
  }

  onOverviewOpenedOrClosed(isOpen: boolean) {
    this.overviewIsOpen = isOpen;
    this.notify("overview-is-open");
  }

  private debouncedNotify() {
    if (this.updateTimeout) {
      GLib.Source.remove(this.updateTimeout);
    }

    this.updateTimeout = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 50, () => {
      this.notify("windows");
      this.notify("workspaces");
      this.updateTimeout = null;
      return false;
    });
  }

  onWindowFocusChanged(id: number | null) {
    // This is the authoritative source for window focus
    const newActiveId = id || -1;
    this.setActiveWindowId(newActiveId);

    // Update the focused state for all windows across all workspaces
    this.updateWindowFocusState(newActiveId);
  }

  private updateWindowFocusState(activeWindowId: number) {
    // Update workspace windows
    this.workspaces.forEach((workspace) => {
      workspace.windows.forEach((window) => {
        window.is_focused =
          activeWindowId !== -1 && window.id === activeWindowId;
      });
    });

    // Update global windows array
    this.windows.forEach((window) => {
      window.is_focused = activeWindowId !== -1 && window.id === activeWindowId;
    });

    // Force notification to update UI bindings
    this.notify("workspaces");
    this.notify("windows");
  }

  onWorkspacesChanged(workspaces: WorkspaceData[]) {
    if (!Array.isArray(workspaces)) {
      console.warn("Invalid workspaces data received:", workspaces);
      return;
    }

    // Update workspaces using map for object persistence (like official Astal)
    workspaces.forEach((ws) => {
      const existing = this.workspacesMap.get(ws.id);

      if (existing) {
        // Update existing workspace object
        existing.updateFromData({
          ...ws,
          windows: existing.windows || [], // Preserve existing windows
        });
      } else {
        // Create new workspace object
        const newWorkspace = new NiriWorkspace({
          ...ws,
          windows: [],
        });
        this.workspacesMap.set(ws.id, newWorkspace);
      }
    });

    // Remove workspaces that no longer exist
    const currentIds = new Set(workspaces.map((ws) => ws.id));
    for (const [id, workspace] of this.workspacesMap) {
      if (!currentIds.has(id)) {
        this.workspacesMap.delete(id);
      }
    }

    // Update the reactive array from the map
    this.workspaces = Array.from(this.workspacesMap.values()).sort(
      (a, b) => a.id - b.id
    );

    this.activeWorkspaceIdx =
      this.workspaces.find((workspace) => workspace.is_focused)?.idx || 1;

    this.updateWorkspaceWindows();
    this.notify("windows");
    this.notify("workspaces");
  }

  onWindowsChanged(windows: WindowData[]) {
    if (!Array.isArray(windows)) {
      console.warn("Invalid windows data received:", windows);
      return;
    }

    // Update windows using map for object persistence (like official Astal)
    this.windowsMap.clear(); // Clear and rebuild like official implementation

    windows.forEach((window) => {
      const normalizedWindow: WindowData = {
        id: window.id,
        title: window.title ?? null,
        app_id: window.app_id ?? null,
        pid: window.pid ?? null,
        workspace_id: window.workspace_id ?? null,
        is_focused: window.is_focused || false,
        is_floating: window.is_floating || false,
        is_urgent: window.is_urgent || false,
      };

      // Create a new NiriWindow GObject
      const niriWindow = new NiriWindow(normalizedWindow);
      this.windowsMap.set(window.id, niriWindow);
    });

    // Update the reactive array from the map
    this.windows = Array.from(this.windowsMap.values());

    this.updateWorkspaceWindows();
    this.notify("windows");
    this.notify("workspaces");
  }

  updateWorkspaceWindows() {
    if (!this.workspaces || !this.windows) return;

    // Group windows by workspace while preserving the original order from niri
    const windowsByWorkspace = new Map<number, NiriWindow[]>();

    // Initialize empty arrays for each workspace
    this.workspaces.forEach((workspace) => {
      windowsByWorkspace.set(workspace.id, []);
    });

    // Add windows in the order they appear in this.windows (which comes from niri)
    this.windows.forEach((window) => {
      const workspaceId = window.workspace_id;
      // Handle null workspace_id (floating windows might not have a workspace)
      if (workspaceId !== null && windowsByWorkspace.has(workspaceId)) {
        windowsByWorkspace.get(workspaceId)!.push(window);
      }
    });

    // Update workspace windows and apply correct focus state
    const activeWindowId = this.activeWindowId();
    this.workspaces.forEach((workspace) => {
      let windows = windowsByWorkspace.get(workspace.id) || [];

      // Sort windows by ID (creation order) for consistent taskbar ordering
      // This gives a predictable order that users can rely on
      windows = windows.sort((a, b) => a.id - b.id);

      // Apply current focus state to all windows
      windows.forEach((window) => {
        window.is_focused =
          activeWindowId !== -1 && window.id === activeWindowId;
      });

      workspace.windows = windows;
    });

    this.notify("workspaces");
    this.notify("windows");
  }

  onWorkspaceActivated(workspaceId: number, focused: boolean) {
    // Update focused state
    this.workspaces.forEach((workspace) => {
      workspace.is_focused = workspace.id === workspaceId && focused;
      workspace.is_active = workspace.id === workspaceId;
    });

    // Use idx instead of id for activeWorkspaceIdx
    const activatedWorkspace = this.workspaces.find(
      (ws) => ws.id === workspaceId
    );
    if (activatedWorkspace) {
      this.activeWorkspaceIdx = activatedWorkspace.idx;
    }

    this.notify("workspaces");
    this.notify("windows");
  }

  onWorkspaceUrgencyChanged(workspaceId: number, urgent: boolean) {
    this.workspaces.forEach((workspace) => {
      if (workspace.id === workspaceId) {
        workspace.is_urgent = urgent;
      }
    });
    this.notify("workspaces");
  }

  onWorkspaceActiveWindowChanged(workspaceId: number, windowId: number | null) {
    // Check if this is for the currently active workspace
    const currentWorkspace = this.workspaces.find((ws) => ws.is_focused);

    if (currentWorkspace && currentWorkspace.id === workspaceId) {
      // This is for the active workspace - use this as a fallback if WindowFocusChanged isn't received
      const newActiveWindowId = windowId || -1;

      this.setActiveWindowId(newActiveWindowId);
      this.updateWindowFocusState(newActiveWindowId);
    }
  }

  onWindowOpenedOrChanged(window: WindowData) {
    // Check if window data is valid
    if (!window || typeof window !== "object") {
      console.warn(
        "[niri] WindowOpenedOrChanged: Invalid window data received (not an object):",
        window
      );
      return;
    }

    if (window.id === undefined || window.id === null) {
      console.warn(
        "[niri] WindowOpenedOrChanged: Invalid window data received (missing id):",
        window
      );
      return;
    }

    // Ensure optional fields have proper defaults
    const normalizedWindow: WindowData = {
      id: window.id,
      title: window.title ?? null,
      app_id: window.app_id ?? null,
      pid: window.pid ?? null,
      workspace_id: window.workspace_id ?? null,
      is_focused: window.is_focused || false,
      is_floating: window.is_floating || false,
      is_urgent: window.is_urgent || false,
    };

    // Update or add the window in our windows map (like official Astal)
    const existing = this.windowsMap.get(window.id);
    const activeWindowId = this.activeWindowId();

    if (existing) {
      // Update existing window GObject, preserving focus state from our active window tracking
      existing.updateFromData({
        ...normalizedWindow,
        is_focused: activeWindowId !== -1 && window.id === activeWindowId,
      });
    } else {
      // Add new window GObject, setting focus state based on current active window
      const niriWindow = new NiriWindow({
        ...normalizedWindow,
        is_focused: activeWindowId !== -1 && window.id === activeWindowId,
      });
      this.windowsMap.set(window.id, niriWindow);
    }

    // Update the reactive array from the map
    this.windows = Array.from(this.windowsMap.values());

    this.updateWorkspaceWindows();
    this.notify("workspaces");
    this.notify("windows");
  }

  onWindowClosed(windowId: number) {
    // Remove the window from our windows map (like official Astal)
    this.windowsMap.delete(windowId);

    // Update the reactive array from the map
    this.windows = Array.from(this.windowsMap.values());

    // Clear active window if it was the closed one
    if (this.activeWindowId() === windowId) {
      this.setActiveWindowId(-1);
    }

    this.updateWorkspaceWindows();
    this.notify("workspaces");
    this.notify("windows");
  }

  onWindowUrgencyChanged(windowId: number, urgent: boolean) {
    // Update urgency state for the window in the map (like official Astal)
    const window = this.windowsMap.get(windowId);
    if (window) {
      window.is_urgent = urgent;

      // Update the reactive array from the map
      this.windows = Array.from(this.windowsMap.values());
    }

    this.updateWorkspaceWindows();
    this.notify("workspaces");
    this.notify("windows");
  }

  focusWorkspace(idx: number) {
    // Use workspace index (idx) for focus actions, not ID
    this.action("focus-workspace", String(idx)).then(() => {});
  }

  focusWindow(id: number) {
    this.action("focus-window", "--id", String(id)).catch((error) => {
      console.error(`Failed to focus window ${id}:`, error);
    });
  }

  closeWindow(id: number) {
    this.action("close-window", "--id", String(id)).catch((error) => {
      console.error(`Failed to close window ${id}:`, error);
    });
  }

  moveWindowToWorkspace(windowId: number, workspaceId: number) {
    // Use workspace ID for move actions, not index
    this.action(
      "move-window-to-workspace",
      "--id",
      String(windowId),
      "--workspace",
      String(workspaceId)
    ).catch((error) => {
      console.error(
        `Failed to move window ${windowId} to workspace ${workspaceId}:`,
        error
      );
    });
  }

  toggleOverview() {
    if (this.overviewIsOpen) {
      this.action("close-overview");
    } else {
      this.action("open-overview");
    }
  }

  action(...args: string[]) {
    return execAsync(["niri", "msg", "action", ...args]);
  }
}

export default new Niri();
