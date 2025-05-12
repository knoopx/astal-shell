import GObject, { register, property } from "astal/gobject";
import { execAsync, subprocess } from "astal/process";
import { GLib, Variable } from "astal";

export type Workspace = {
  id: number;
  name: string;
  is_focused: boolean;
};

export type Window = {
  id: number;
  title: string;
  app_id: string;
  workspace_id: number;
  is_focused: boolean;
};

@register({ GTypeName: "Niri" })
export class Niri extends GObject.Object {
  @property(Number)
  declare activeWorkspaceIdx: number;

  @property(Object)
  declare workspaces: Workspace[];

  overviewIsOpen: Variable<boolean> = Variable(false);
  activeWindowId: Variable<number> = Variable(-1);

  constructor() {
    super();
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
          this.onWorkspaceActivated(value.id);
          break;
      }
    }
  }

  onOverviewOpenedOrClosed(isOpen: boolean) {
    this.overviewIsOpen.set(isOpen);
  }

  onWindowFocusChanged(id: number) {
    this.activeWindowId.set(id);
  }

  onWorkspacesChanged(workspaces: Workspace[]) {
    this.workspaces = workspaces.sort((a, b) => a.id - b.id);
    this.activeWorkspaceIdx = this.workspaces.find(
      (workspace) => workspace.is_focused
    )?.id!;
  }

  onWorkspaceActivated(workspaceId: number) {
    this.workspaces.find(
      (workspace) => workspace.id === this.activeWorkspaceIdx
    )!.is_focused = false;
    this.workspaces.find(
      (workspace) => workspace.id === workspaceId
    )!.is_focused = true;
    this.activeWorkspaceIdx = workspaceId;
    this.notify("workspaces");
  }

  focusWorkspace(id: number) {
    this.action("focus-workspace", String(id)).then(() => {});
  }

  action(...args: string[]) {
    return execAsync(["niri", "msg", "action", ...args]);
  }
}

export default new Niri();
