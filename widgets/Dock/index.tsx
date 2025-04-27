import { App, Astal, Gtk, type Gdk } from "astal/gtk3";
import Apps from "gi://AstalApps";
import { bind, derive, Variable } from "astal";
import niri from "../../support/niri";

function AppButton({ app }: { app: Apps.Application }) {
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
}

export default (monitor) => {
  const apps = new Apps.Apps();
  const myApps = [
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

  const visible = Variable(false);
  niri.activeWindowId.subscribe((x) => {
    visible.set(x == null);
  });

  return (
    <window
      name="dock"
      anchor={
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.BOTTOM
      }
      monitor={monitor.id}
      keymode={Astal.Keymode.NONE}
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
        {myApps.map((app) => (
          <AppButton app={app} />
        ))}
      </box>
    </window>
  );
};
