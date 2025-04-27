import { Astal, Gdk, Gtk } from "astal/gtk3";

export async function confirm(handler): Promise<boolean> {
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;
  const { IGNORE } = Astal.Exclusivity;
  const { EXCLUSIVE } = Astal.Keymode;
  const { CENTER } = Gtk.Align;

  function yes() {
    dialogWindow.close();
    handler();
  }

  function no() {
    dialogWindow.close();
  }

  function onKeyPress(w: Astal.Window, event: Gdk.Event) {
    if (event.get_keyval()[1] === Gdk.KEY_Escape) {
      dialogWindow.close();
    }
  }

  const dialogWindow = (
    <window
      name="confirm"
      namespace={"dialog"}
      onKeyPressEvent={onKeyPress}
      exclusivity={IGNORE}
      keymode={EXCLUSIVE}
      anchor={TOP | BOTTOM | LEFT | RIGHT}
    >
      <box halign={CENTER} valign={CENTER} vertical spacing={16}>
        <label css={`font-weight: bold`} label="Are you sure?" />
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

  dialogWindow.show();

  return dialogWindow;
}
