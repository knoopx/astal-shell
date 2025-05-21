import Apps from "gi://AstalApps";
import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { Variable } from "astal";
import ListBox from "../ListBox";

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
    textEntry.set_text("");
    selected.set(null);
    app.launch();
    App.get_window("launcher")!.hide();
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

  const listBox = (
    <ListBox
      selectionMode={Gtk.SelectionMode.SINGLE}
      onSelectedRowsChanged={() => {
        const row = listBox.get_selected_row();
        if (row) selected.set(list.get()[row.get_index()]);
      }}
      css={`
        background: none;
        > row {
          padding: 6px;
          background: none;

          &:selected {
            background-color: alpha(@theme_selected_bg_color, 0.5);
          }
        }
      `}
    >
      {list.as((apps) =>
        apps.map((app) => <AppButton onClicked={() => run(app)} app={app} />)
      )}
    </ListBox>
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
        // if (self.visible) {
        const key = e.get_keyval()[1];
        if (key === Gdk.KEY_Escape) self.hide();
        if (key === Gdk.KEY_Up || key === Gdk.KEY_Down) {
          const rows = listBox.get_children();
          const current = listBox.get_selected_row()?.get_index() ?? -1;

          if (key === Gdk.KEY_Up) {
            const next = Math.max(0, current - 1);
            listBox.select_row(rows[next]);
            return false;
            // rows[next].grab_focus();
          } else if (key === Gdk.KEY_Down) {
            const next = Math.min(rows.length - 1, current + 1);
            listBox.select_row(rows[next]);
            return false;

            // rows[next].grab_focus();
          }
        }
        // }
        // if (!textEntry.has_focus && ![65362, 65364].includes(key)) {
        //   textEntry.grab_focus();
        //   textEntry.set_position(textEntry.get_text_length());
        // }
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
        {listBox}
      </box>
    </window>
  );
};
