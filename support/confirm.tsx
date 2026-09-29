import { createState, createRoot } from "ags";
import { Gtk, Astal } from "ags/gtk4";
import Gdk from "gi://Gdk?version=4.0";
import { getCurrentTheme } from "./theme";

export interface ConfirmOptions {
  title?: string;
  message?: string;
}

export function confirm(handler: () => void, options: ConfirmOptions = {}) {
  const [visible, setVisible] = createState(false);
  // Snapshot the theme now so the dialog keeps its look even if the user swaps
  // themes while it is on screen.
  const theme = getCurrentTheme();
  const {
    title = "Are you sure?",
    message = "This action cannot be undone.",
  } = options;

  let disposeScope = () => {};

  function hide() {
    setVisible(false);
    // Release the dialog's scope so its signal handlers and reactive
    // bindings are disconnected once the dialog is dismissed.
    disposeScope();
  }

  function yes() {
    hide();
    handler();
  }

  function no() {
    hide();
  }

  // confirm() runs from an event handler, outside any tracking context, so
  // the jsx runtime cannot register cleanups there. Create the dialog inside
  // a root scope so handler/binding cleanup is tracked and released on dismiss.
  const dialog = createRoot((dispose) => {
    disposeScope = dispose;

    return (
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
              hide();
            }
          }}
        />
        {/* Nothing in the container paints, so the transparent window shows the
            desktop straight through behind the floating text and buttons. */}
        <box
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.CENTER}
          orientation={Gtk.Orientation.VERTICAL}
          spacing={16}
        >
        <label
          css={`
            font-size: ${theme.font.size.large};
            font-weight: ${theme.font.weight.bold};
            color: ${theme.text.primary};
          `}
          label={title}
        />
        <label
          css={`
            margin-top: ${theme.spacing.small};
            font-size: ${theme.font.size.small};
            color: ${theme.text.secondary};
          `}
          label={message}
        />
        {/* Equal button sizes keep the destructive choice from reading as
            the default action; the user has to consciously pick it. */}
        <box
          orientation={Gtk.Orientation.HORIZONTAL}
          spacing={12}
          css={`
            margin-top: ${theme.spacing.large};
          `}
        >
          <button
            hexpand
            css={`
              min-width: 8em;
              min-height: 2.5em;
              border-radius: 8px;
              padding: 0.5em 1em;
              font-weight: ${theme.font.weight.bold};
              background-color: ${theme.background.secondary};
              color: ${theme.text.primary};
            `}
            onClicked={no}
          >
            No
          </button>
          {/* White text keeps the label legible on any status.error hue. */}
          <button
            hexpand
            css={`
              min-width: 8em;
              min-height: 2.5em;
              border-radius: 8px;
              padding: 0.5em 1em;
              font-weight: ${theme.font.weight.bold};
              background-color: ${theme.status.error};
              color: white;
            `}
            onClicked={yes}
          >
            Yes
          </button>
        </box>
      </box>
      </window>
    );
  });

  // Show the dialog
  setVisible(true);
  return dialog;
}
