import { Gtk } from "ags/gtk3";
import Apps from "gi://AstalApps";

const AppButton = ({ app }: { app: Apps.Application }) => {
  return (
    <button
      onPressed={() => {
        app.launch();
      }}
      name={app.name}
      css={`
        padding: 0;
        margin: 0;
        background-color: transparent;
      `}
    >
      <icon
        icon={app.get_icon_name()}
        css={`
          font-size: 1.5em;
        `}
        valign={Gtk.Align.CENTER}
      />
    </button>
  );
};

export default () => {
  const apps = new Apps.Apps();

  const matches = [
    "nautilus",
    "firefox",
    "spotify",
    "plex web",
    "gmail",
    "telegram",
    "whatsapp",
    "webull",
    "reddit",
    "youtube",
    "home assistant",
  ].map((x) => apps.exact_query(x)[0]);

  const appButtons = matches.map((app) => <AppButton app={app} />);

  return <box spacing={4}>{appButtons}</box>;
};
