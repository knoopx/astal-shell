import Apps from "gi://AstalApps";
import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { bind, GLib, Variable } from "astal";

const MAX_ITEMS = 12;

type AppButtonProps = Astal.Button & { app: Apps.Application };

const AppButton = ({ app, ...props }: AppButtonProps) => {
  return (
    <button {...props}>
      <box spacing={10}>
        <icon
          css={`
            font-size: 3em;
            min-width: 48px;
            min-height: 48px;
          `}
          icon={app.iconName}
        />
        <box valign={Gtk.Align.CENTER} vertical>
          <label truncate xalign={0} label={app.name} />
          {app.description && (
            <label
              wrap
              truncate
              widthChars={40}
              maxWidthChars={40}
              xalign={0}
              label={app.description}
              css={`
                font-weight: normal;
              `}
            />
          )}
        </box>
      </box>
    </button>
  );
};

export default () => {
  const apps = new Apps.Apps();
  const selected = Variable(null);
  const text = Variable("");
  const list = text((text) => apps.fuzzy_query(text).slice(0, MAX_ITEMS));
  const run = (app: Apps.Application) => {
    App.get_window("launcher")!.hide();
    app.launch();
    text.set("");
    textEntry.set_text("");
  };

  const textEntry = (
    <entry
      placeholderText="Search"
      onChanged={(self) => {
        text.set(self.text);
      }}
      onActivate={() => run(selected.get() || list.get()[0])}
    />
  );

  return (
    <window
      name="launcher"
      visible={false}
      anchor={Astal.WindowAnchor.TOP}
      exclusivity={Astal.Exclusivity.IGNORE}
      // keymode={Astal.Keymode.ON_DEMAND}
      keymode={Astal.Keymode.EXCLUSIVE}
      modal={true}
      application={App}
      onNotifyVisible={(self) => {
        textEntry.grab_focus();
      }}
      onKeyPressEvent={(self, e) => {
        if (self.visible) {
          const key = e.get_keyval()[1];
          if (key === Gdk.KEY_Escape) self.hide();
          if (!textEntry.has_focus && ![65362, 65364].includes(key)) {
            textEntry.grab_focus();
            textEntry.set_position(textEntry.get_text_length());
          }
        }
      }}
      marginTop={100}
      css={`
        background: none;
      `}
    >
      <box
        widthRequest={500}
        spacing={16}
        valign={Gtk.Align.START}
        halign={Gtk.Align.CENTER}
        vertical
        css={`
          border: 3px solid @theme_selected_bg_color;
          background-color: @theme_bg_color;
          border-radius: 12px;
          padding: 12px;
        `}
      >
        {textEntry}

        <box spacing={6} vertical>
          {list.as((apps) =>
            apps.map((app) => (
              <AppButton
                onClicked={() => run(app)}
                onFocus={() => selected.set(app)}
                app={app}
              />
            ))
          )}
        </box>
      </box>
    </window>
  );
};
