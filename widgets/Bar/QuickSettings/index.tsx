import { Variable } from "astal";
import Popover from "../../Popover";
import Volume from "./Volume";
import { execAsync } from "astal/process";
import { App, Gtk } from "astal/gtk3";
import { confirm } from "../../../support/confirm";

export default ({ gdkmonitor }) => {
  const visible = Variable(false);

  const logout = () =>
    confirm(() => execAsync(["niri", "msg", "action", "quit", "-s"]));
  const reboot = () => confirm(() => execAsync(["systemctl", "reboot"]));
  const poweroff = () => confirm(() => execAsync(["systemctl", "poweroff"]));

  <Popover
    visible={visible()}
    onClose={() => visible.set(false)}
    marginTop={36}
    valign={Gtk.Align.START}
    halign={Gtk.Align.END}
    application={App}
    gdkmonitor={gdkmonitor}
  >
    <box
      widthRequest={320}
      vertical
      spacing={16}
      css={`
        padding: 8px;
      `}
    >
      <box spacing={16}>
        <button hexpand onPressed={logout}>
          <icon icon="system-log-out-symbolic" />
        </button>
        <button hexpand onPressed={reboot}>
          <icon icon="system-reboot-symbolic" />
        </button>
        <button hexpand onPressed={poweroff}>
          <icon icon="system-shutdown-symbolic" />
        </button>
      </box>
      <Volume />
    </box>
  </Popover>;

  return (
    <box>
      <button
        css={`
          background: transparent;
          font-size: 1.2em;
        `}
        onClicked={() => {
          visible.set(true);
        }}
      >
        <icon icon="sidebar-show-right-symbolic" />
      </button>
    </box>
  );
};
