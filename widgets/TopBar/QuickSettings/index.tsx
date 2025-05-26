import { Variable } from "astal";
import Volume from "./Volume";
import { execAsync } from "astal/process";
import { Gtk } from "astal/gtk3";
import { confirm } from "../../../support/confirm";

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
        <button
          vexpand={false}
          hexpand={false}
          css={`
            padding: 0;
            border-radius: 100%;
            min-width: 24px;
            min-height: 24px;
          `}
          onPressed={poweroff}
          tooltipText="Shutdown"
          child={<icon icon="system-shutdown-symbolic" />}
        />

        <button
          vexpand={false}
          hexpand={false}
          css={`
            padding: 0;
            border-radius: 100%;
            min-width: 24px;
            min-height: 24px;
          `}
          onPressed={reboot}
          tooltipText="Reboot"
          child={<icon icon="system-reboot-symbolic" />}
        />
        <button
          vexpand={false}
          hexpand={false}
          css={`
            padding: 0;
            border-radius: 100%;
            min-width: 24px;
            min-height: 24px;
          `}
          onPressed={logout}
          tooltipText="Logout"
          child={<icon icon="system-log-out-symbolic" />}
        />
      </box>
    </box>
  );
};
