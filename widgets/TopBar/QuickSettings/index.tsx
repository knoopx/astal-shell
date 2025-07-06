import Volume from "./Volume";
import { execAsync } from "ags/process";
import { Gtk } from "ags/gtk3";
import { confirm } from "../../../support/confirm";
import ActionButton from "./ActionButton";

export default () => {
  const logout = () =>
    confirm(() => execAsync(["niri", "msg", "action", "quit", "-s"]));
  const reboot = () => confirm(() => execAsync(["systemctl", "reboot"]));
  const poweroff = () => confirm(() => execAsync(["systemctl", "poweroff"]));
  return (
    <box
      css={`
        margin-left: 8px;
      `}
      spacing={8}
      valign={Gtk.Align.CENTER}
    >
      <Volume />
      <box spacing={4} valign={Gtk.Align.CENTER}>
        <ActionButton
          icon="system-shutdown-symbolic"
          tooltipText="Shutdown"
          onClicked={poweroff}
        />
        <ActionButton
          icon="system-reboot-symbolic"
          tooltipText="Reboot"
          onClicked={reboot}
        />
        <ActionButton
          icon="system-log-out-symbolic"
          tooltipText="Logout"
          onClicked={logout}
        />
      </box>
    </box>
  );
};
