import { Variable } from "astal";
import Popover from "../../Popover";
import Volume from "./Volume";
import { execAsync } from "astal/process";
import { App, Gtk, Gdk } from "astal/gtk3";
import { confirm } from "../../../support/confirm";
import GLib from "gi://GLib";

export default ({ monitor }: { monitor: number }) => {
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
    monitor={monitor}
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
        <button
          hexpand
          onPressed={logout}
          css={`
            color: @theme_bg_color;
            background-color: @theme_selected_bg_color;
          `}
        >
          <icon icon="system-log-out-symbolic" />
        </button>
        <button
          hexpand
          onPressed={reboot}
          css={`
            color: @theme_bg_color;
            background-color: @theme_selected_bg_color;
          `}
        >
          <icon icon="system-reboot-symbolic" />
        </button>
        <button
          hexpand
          onPressed={poweroff}
          css={`
            color: @theme_bg_color;
            background-color: @theme_selected_bg_color;
          `}
        >
          <icon icon="system-shutdown-symbolic" />
        </button>
      </box>
      <Volume />
    </box>
  </Popover>;

  return (
    <button
      css={`
        padding: 0;
        background: transparent;
      `}
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
      onClicked={() => {
        visible.set(true);
      }}
    >
      <box
        css={`
          min-width: 28px;
          min-height: 28px;
          background-image: url("${GLib.getenv("HOME")}/.face");
          background-size: cover;
          border-radius: 100%;
        `}
      />
    </button>
  );
};
