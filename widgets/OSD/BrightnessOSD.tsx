import { Gtk, Astal } from "ags/gtk3";
import app from "ags/gtk3/app";
import { timeout } from "ags/time";
import { createState, onCleanup } from "ags";
import Brightness from "../../support/brightness";
import { getCurrentTheme } from "../../support/theme";

const BrightnessProgress = ({ visible, setVisible }) => {
  const brightness = Brightness.get_default();
  const [iconName, setIconName] = createState("display-brightness-symbolic");
  const [value, setValue] = createState(brightness.screen || 0);
  let count = 0;
  let connectionId: number | null = null;

  function show(v: number) {
    setVisible(true);
    setValue(v);
    setIconName("display-brightness-symbolic");
    count++;
    timeout(1000, () => {
      count--;
      if (count === 0) setVisible(false);
    });
  }

  // Only set up monitoring if brightness is available
  if (brightness.screenValue !== undefined) {
    // Set up brightness monitoring with proper cleanup
    connectionId = brightness.connect("notify::screen", () => {
      show(brightness.screen);
    });
  }

  // Clean up the connection when component is destroyed
  onCleanup(() => {
    if (connectionId !== null) {
      brightness.disconnect(connectionId);
    }
  });

  const theme = getCurrentTheme();
  return (
    <box
      spacing={16}
      halign={Gtk.Align.END}
      valign={Gtk.Align.CENTER}
      vertical={true}
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
        vertical={true}
        inverted={true}
      />
      <icon icon={iconName} />
    </box>
  );
};

export default function BrightnessOSD({ monitor }: { monitor: number }) {
  const [visible, setVisible] = createState(false);
  const { RIGHT } = Astal.WindowAnchor;

  return (
    <window
      name="brightness-osd"
      namespace="brightness-osd"
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
      <BrightnessProgress visible={visible} setVisible={setVisible} />
    </window>
  );
}
