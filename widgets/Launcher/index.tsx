import Apps from "gi://AstalApps";
import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { bind, GLib, Variable } from "astal";

const MAX_ITEMS = 12;

function hide() {
  App.get_window("launcher")!.hide();
}

const AppButton = ({ app }: { app: Apps.Application }) => {
  return (
    <button
      onClicked={() => {
        hide();
        app.launch();
      }}
    >
      <box spacing={10}>
        <icon
          css={`
            font-size: 3em;
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

  const text = Variable("");
  const list = text((text) => apps.fuzzy_query(text).slice(0, MAX_ITEMS));
  const onSelect = () => {
    apps.fuzzy_query(text.get())?.[0].launch();
    hide();
  };

  let ref;

  return (
    <window
      name="launcher"
      visible={false}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.BOTTOM |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT
      }
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={Astal.Keymode.ON_DEMAND}
      application={App}
      onShow={(self) => {
        ref.set_text("");
        ref.grab_focus();
      }}
      onKeyPressEvent={(self, e) => {
        if (e.get_keyval()[1] === Gdk.KEY_Escape) self.hide();
      }}
      css={`
        background: rgba(0, 0, 0, 0.35);
      `}
    >
      <box
        widthRequest={500}
        spacing={16}
        halign={Gtk.Align.CENTER}
        vertical
        css={`
          margin-top: 8em;
          margin-bottom: 8em;
          background-color: @theme_bg_color;
          box-shadow: 2px 3px 7px 0 rgba(0, 0, 0, 0.4);
          border-radius: 12px;
          padding: 12px;
        `}
      >
        <entry
          setup={(self) => {
            ref = self;
          }}
          placeholderText="Search"
          onChanged={(self) => {
            text.set(self.text);
          }}
          onActivate={onSelect}
        />
        <box spacing={6} vertical>
          {list.as((list) => list.map((app) => <AppButton app={app} />))}
        </box>
      </box>
    </window>
  );
};
