import { App, Astal, Gdk, Gtk } from "astal/gtk3";
import Apps from "gi://AstalApps";
import { bind, Binding, Variable } from "astal";
import niri from "../../support/niri";

const AppButton = ({ app }: { app: Apps.Application }) => {
  return (
    <button
      onPressed={() => {
        niri.action("close-overview");
        app.launch();
      }}
      name={app.name}
      css={`
        background: none;
      `}
    >
      <icon
        icon={app.get_icon_name()}
        css={`
          font-size: 3em;
        `}
        valign={Gtk.Align.CENTER}
      />
    </button>
  );
};

export default (monitor: number) => {
  const apps = new Apps.Apps();

  const visible = Variable(false);
  niri.activeWindowId.subscribe((x: null) => {
    visible.set(x == null);
  });

  const appButtons = bind(visible).as(() => {
    const matches = [
      "nautilus",
      "firefox",
      "gmail",
      "calendar",
      "telegram",
      "whatsapp",
      "spotify",
      "plexamp",
      "plex web",
      "webull",
      "reddit",
      "youtube",
      "home assistant",
    ].map((x) => apps.exact_query(x)[0]);

    return matches.map((app) => <AppButton app={app} />);
  });

  return (
    <window
      name="dock"
      anchor={
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.BOTTOM
      }
      monitor={monitor}
      keymode={Astal.Keymode.NONE}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.IGNORE}
      application={App}
      css={`
        background-color: transparent;
      `}
    >
      <box
        css={`
          background-color: rgba(0, 0, 0, 0.5);
          padding-top: 0.5em;
          padding-bottom: 0.5em;
          border-right: 1px solid rgba(255, 255, 255, 0.15);
        `}
        visible={visible()}
        vertical
      >
        {appButtons}
      </box>
    </window>
  );
};
