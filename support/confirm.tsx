import { createState } from "ags";
import { Gtk } from "ags/gtk3";
import Gdk from "gi://Gdk?version=3.0";

export function confirm(handler: () => void) {
  const [visible, setVisible] = createState(false);

  function yes() {
    setVisible(false);
    handler();
  }

  function no() {
    setVisible(false);
  }

  function onKeyPress(self: Gtk.Window, event: Gdk.EventKey) {
    if (event.keyval === Gdk.KEY_Escape) {
      setVisible(false);
    }
  }

  const dialog = (
    <window
      name="confirm"
      onKeyPressEvent={(self, event) => onKeyPress(self, event)}
      visible={visible}
    >
      <box halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} vertical spacing={16}>
        <label
          css={`
            font-weight: bold;
          `}
          label="Are you sure?"
        />
        <box homogeneous spacing={16}>
          <button onClicked={no}>No</button>
          <button
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
