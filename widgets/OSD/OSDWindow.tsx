import { Gtk, Astal } from "ags/gtk3";
import app from "ags/gtk3/app";
import { timeout } from "ags/time";
import { createState, onCleanup } from "ags";
import { getCurrentTheme } from "../../support/theme";

interface OSDConfig {
  name: string;
  monitor: number;
  getIcon: () => string;
  getValue: () => number;
  connect: (callback: () => void) => number;
  disconnect: (id: number) => void;
}

export default function OSDWindow({
  name,
  monitor,
  getIcon,
  getValue,
  connect,
  disconnect,
}: OSDConfig) {
  const [visible, setVisible] = createState(false);
  const [iconName, setIconName] = createState(getIcon());
  const [value, setValue] = createState(getValue());
  let count = 0;

  function show() {
    setVisible(true);
    setValue(getValue());
    setIconName(getIcon());
    count++;
    timeout(1000, () => {
      count--;
      if (count === 0) setVisible(false);
    });
  }

  const connectionId = connect(show);

  onCleanup(() => {
    disconnect(connectionId);
  });

  const theme = getCurrentTheme();
  const { RIGHT } = Astal.WindowAnchor;

  return (
    <window
      name={name}
      namespace={name}
      application={app}
      visible={visible}
      css={`
        background: none;
        margin: 1em;
      `}
      monitor={monitor}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={RIGHT}
      keymode={Astal.Keymode.NONE}
      halign={Gtk.Align.END}
      valign={Gtk.Align.CENTER}
    >
      <box
        spacing={16}
        halign={Gtk.Align.END}
        valign={Gtk.Align.CENTER}
        vertical
        css={`
          font-size: ${theme.font.size.large};
          background-color: ${theme.background.primary};
          border-radius: ${theme.borderRadius.large};
          padding: 0.8em;
          margin: 2em;
          padding-top: 1em;
        `}
      >
        <levelbar
          css={`
            min-width: 0.7em;
            border-radius: 0.7em;
          `}
          halign={Gtk.Align.CENTER}
          heightRequest={100}
          value={value}
          vertical
          inverted
        />
        <icon icon={iconName} />
      </box>
    </window>
  );
}
