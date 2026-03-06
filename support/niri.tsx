// Niri IPC integration
// Reference: https://github.com/niri-wm/niri/blob/main/niri-ipc/src/lib.rs

import GObject, { register, property } from "ags/gobject";
import { execAsync, subprocess } from "ags/process";

// Types matching niri-ipc structs

type Timestamp = {
  secs: number;
  nanos: number;
};

type WindowLayout = {
  pos_in_scrolling_layout: [number, number] | null;
  tile_size: [number, number];
  window_size: [number, number];
  tile_pos_in_workspace_view: [number, number] | null;
  window_offset_in_tile: [number, number];
};

type WindowData = {
  id: number;
  title: string | null;
  app_id: string | null;
  pid: number | null;
  workspace_id: number | null;
  is_focused: boolean;
  is_floating: boolean;
  is_urgent: boolean;
  layout: WindowLayout;
  focus_timestamp: Timestamp | null;
};

type WorkspaceData = {
  id: number;
  idx: number;
  name: string | null;
  output: string | null;
  is_urgent: boolean;
  is_active: boolean;
  is_focused: boolean;
  active_window_id: number | null;
};

@register({ GTypeName: "NiriWindow" })
export class NiriWindow extends GObject.Object {
  @property(Number) id = 0;
  @property(String) title: string | null = null;
  @property(String) app_id: string | null = null;
  @property(Number) pid: number | null = null;
  @property(Number) workspace_id: number | null = null;
  @property(Boolean) is_focused = false;
  @property(Boolean) is_floating = false;
  @property(Boolean) is_urgent = false;
  @property(Object) layout: WindowLayout = {
    pos_in_scrolling_layout: null,
    tile_size: [0, 0],
    window_size: [0, 0],
    tile_pos_in_workspace_view: null,
    window_offset_in_tile: [0, 0],
  };

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
    this.is_focused = data.is_focused;
    this.is_floating = data.is_floating;
    this.is_urgent = data.is_urgent;
    this.layout = data.layout;
  }
}

@register({ GTypeName: "NiriWorkspace" })
export class NiriWorkspace extends GObject.Object {
  @property(Number) id = 0;
  @property(Number) idx = 0;
  @property(String) name: string | null = null;
  @property(String) output: string | null = null;
  @property(Boolean) is_urgent = false;
  @property(Boolean) is_active = false;
  @property(Boolean) is_focused = false;
  @property(Number) active_window_id: number | null = null;
  @property(Array) windows: NiriWindow[] = [];

  constructor(data: WorkspaceData) {
    super();
    this.updateFromData(data);
  }

  updateFromData(data: WorkspaceData) {
    this.id = data.id;
    this.idx = data.idx;
    this.name = data.name ?? null;
    this.output = data.output ?? null;
    this.is_urgent = data.is_urgent;
    this.is_active = data.is_active;
    this.is_focused = data.is_focused;
    this.active_window_id = data.active_window_id ?? null;
  }
}

@register({ GTypeName: "Niri" })
class Niri extends GObject.Object {
  @property(Number) activeWorkspaceIdx = 1;
  @property(Array) workspaces: NiriWorkspace[] = [];
  @property(Array) windows: NiriWindow[] = [];
  @property(Boolean) overviewIsOpen = false;

  private focusedWindowId: number | null = null;
  private windowsMap = new Map<number, NiriWindow>();
  private workspacesMap = new Map<number, NiriWorkspace>();

  constructor() {
    super();
    subprocess(
      ["niri", "msg", "--json", "event-stream"],
      (line) => this.handleEvent(JSON.parse(line)),
      (err) => console.error("niri event-stream error:", err),
    );
  }

  private handleEvent(event: Record<string, unknown>) {
    for (const key in event) {
      const value = event[key] as Record<string, unknown>;
      switch (key) {
        case "WorkspacesChanged":
          this.onWorkspacesChanged(value.workspaces as WorkspaceData[]);
          break;
        case "WorkspaceActivated":
          this.onWorkspaceActivated(
            value.id as number,
            value.focused as boolean,
          );
          break;
        case "WorkspaceUrgencyChanged":
          this.onWorkspaceUrgencyChanged(
            value.id as number,
            value.urgent as boolean,
          );
          break;
        case "WorkspaceActiveWindowChanged":
          this.onWorkspaceActiveWindowChanged(
            value.workspace_id as number,
            value.active_window_id as number | null,
          );
          break;
        case "WindowsChanged":
          this.onWindowsChanged(value.windows as WindowData[]);
          break;
        case "WindowOpenedOrChanged":
          this.onWindowOpenedOrChanged(value.window as WindowData);
          break;
        case "WindowClosed":
          this.onWindowClosed(value.id as number);
          break;
        case "WindowFocusChanged":
          this.onWindowFocusChanged(value.id as number | null);
          break;
        case "WindowUrgencyChanged":
          this.onWindowUrgencyChanged(
            value.id as number,
            value.urgent as boolean,
          );
          break;
        case "WindowLayoutsChanged":
          this.onWindowLayoutsChanged(
            value.changes as Array<[number, WindowLayout]>,
          );
          break;
        case "OverviewOpenedOrClosed":
          this.overviewIsOpen = value.is_open as boolean;
          this.notify("overview-is-open");
          break;
      }
    }
  }

  // Full workspace list replacement
  private onWorkspacesChanged(workspaces: WorkspaceData[]) {
    const currentIds = new Set(workspaces.map((ws) => ws.id));

    for (const id of this.workspacesMap.keys()) {
      if (!currentIds.has(id)) this.workspacesMap.delete(id);
    }

    for (const ws of workspaces) {
      const existing = this.workspacesMap.get(ws.id);
      if (existing) {
        existing.updateFromData(ws);
      } else {
        this.workspacesMap.set(ws.id, new NiriWorkspace(ws));
      }
    }

    this.rebuildWorkspaces();
    this.assignWindowsToWorkspaces();
    this.notify("workspaces");
  }

  private onWorkspaceActivated(workspaceId: number, focused: boolean) {
    for (const ws of this.workspacesMap.values()) {
      if (ws.id === workspaceId) {
        ws.is_active = true;
        ws.is_focused = focused;
      } else {
        // Only clear is_active for workspaces on the same output
        const activated = this.workspacesMap.get(workspaceId);
        if (activated && ws.output === activated.output) {
          ws.is_active = false;
        }
        if (focused) ws.is_focused = false;
      }
    }

    this.rebuildWorkspaces();
    this.notify("workspaces");
  }

  private onWorkspaceUrgencyChanged(workspaceId: number, urgent: boolean) {
    const ws = this.workspacesMap.get(workspaceId);
    if (ws) ws.is_urgent = urgent;
    this.notify("workspaces");
  }

  private onWorkspaceActiveWindowChanged(
    workspaceId: number,
    activeWindowId: number | null,
  ) {
    const ws = this.workspacesMap.get(workspaceId);
    if (ws) ws.active_window_id = activeWindowId;
    this.notify("workspaces");
  }

  // Full window list replacement
  private onWindowsChanged(windows: WindowData[]) {
    this.windowsMap.clear();
    for (const w of windows) {
      this.windowsMap.set(w.id, new NiriWindow(w));
      if (w.is_focused) this.focusedWindowId = w.id;
    }
    this.rebuildWindows();
    this.assignWindowsToWorkspaces();
    this.notify("windows");
    this.notify("workspaces");
  }

  private onWindowOpenedOrChanged(window: WindowData) {
    const existing = this.windowsMap.get(window.id);
    if (existing) {
      existing.updateFromData(window);
    } else {
      this.windowsMap.set(window.id, new NiriWindow(window));
    }

    if (window.is_focused) {
      this.focusedWindowId = window.id;
      this.applyFocusState();
    }

    this.rebuildWindows();
    this.assignWindowsToWorkspaces();
    this.notify("windows");
    this.notify("workspaces");
  }

  private onWindowClosed(windowId: number) {
    this.windowsMap.delete(windowId);
    if (this.focusedWindowId === windowId) this.focusedWindowId = null;

    this.rebuildWindows();
    this.assignWindowsToWorkspaces();
    this.notify("windows");
    this.notify("workspaces");
  }

  private onWindowFocusChanged(id: number | null) {
    this.focusedWindowId = id;
    this.applyFocusState();
    this.notify("windows");
    this.notify("workspaces");
  }

  private onWindowUrgencyChanged(windowId: number, urgent: boolean) {
    const win = this.windowsMap.get(windowId);
    if (win) win.is_urgent = urgent;
    this.notify("windows");
  }

  private onWindowLayoutsChanged(changes: Array<[number, WindowLayout]>) {
    for (const [id, layout] of changes) {
      const win = this.windowsMap.get(id);
      if (win) win.layout = layout;
    }
    this.notify("windows");
    this.notify("workspaces");
  }

  // Apply focus state from focusedWindowId to all window objects
  private applyFocusState() {
    for (const win of this.windowsMap.values()) {
      win.is_focused = win.id === this.focusedWindowId;
    }
  }

  // Rebuild the sorted workspaces array from the map
  private rebuildWorkspaces() {
    this.workspaces = Array.from(this.workspacesMap.values()).sort(
      (a, b) => a.id - b.id,
    );
    const focused = this.workspaces.find((ws) => ws.is_focused);
    if (focused) this.activeWorkspaceIdx = focused.idx;
  }

  // Rebuild the windows array from the map
  private rebuildWindows() {
    this.windows = Array.from(this.windowsMap.values());
  }

  // Group windows into their workspace objects
  private assignWindowsToWorkspaces() {
    const byWorkspace = new Map<number, NiriWindow[]>();
    for (const ws of this.workspacesMap.values()) {
      byWorkspace.set(ws.id, []);
    }

    for (const win of this.windowsMap.values()) {
      if (win.workspace_id !== null && byWorkspace.has(win.workspace_id)) {
        byWorkspace.get(win.workspace_id)!.push(win);
      }
    }

    for (const ws of this.workspacesMap.values()) {
      const wins = byWorkspace.get(ws.id) ?? [];
      wins.sort((a, b) => a.id - b.id);
      ws.windows = wins;
    }
  }

  // Actions

  focusWorkspace(idx: number) {
    return this.action("focus-workspace", String(idx));
  }

  focusWindow(id: number) {
    return this.action("focus-window", "--id", String(id));
  }

  closeWindow(id: number) {
    return this.action("close-window", "--id", String(id));
  }

  centerColumn() {
    return this.action("center-column");
  }

  moveWindowToWorkspace(windowId: number, workspaceIdx: number) {
    return this.action(
      "move-window-to-workspace",
      "--window-id",
      String(windowId),
      String(workspaceIdx),
    );
  }

  toggleOverview() {
    return this.action("toggle-overview");
  }

  action(...args: string[]) {
    return execAsync(["niri", "msg", "action", ...args]);
  }
}

export default new Niri();
