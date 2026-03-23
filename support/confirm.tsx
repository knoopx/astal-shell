import { createState } from "ags";
import { Gtk, Astal } from "ags/gtk4";
import Gdk from "gi://Gdk?version=4.0";

export function confirm(handler: () => void) {
  const [visible, setVisible] = createState(false);

  function yes() {
    setVisible(false);
    handler();
  }

  function no() {
    setVisible(false);
  }

  const dialog = (
    <window
      name="confirm"
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.BOTTOM |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT
      }
      keymode={Astal.Keymode.ON_DEMAND}
      visible={visible}
    >
      <Gtk.EventControllerKey
        onKeyPressed={(_self: Gtk.EventControllerKey, keyval: number) => {
          if (keyval === Gdk.KEY_Escape) {
            setVisible(false);
          }
        }}
      />
      <box
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
        orientation={Gtk.Orientation.VERTICAL}
        spacing={16}
      >
        <label
          css={`
            font-weight: bold;
          `}
          label="Are you sure?"
        />
        <box spacing={16}>
          <button hexpand onClicked={no}>No</button>
          <button
            hexpand
            css={`
              min-width: 8em;
              color: @error_color;
            `}
            onClicked={yes}
          >
            Yes
          </button>
        </box>
      </box>
    </window>
  );

  // Show the dialog
  setVisible(true);
  return dialog;
}
