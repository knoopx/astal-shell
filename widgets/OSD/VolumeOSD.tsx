import { Gtk, Astal } from "ags/gtk3";
import app from "ags/gtk3/app";
import { timeout } from "ags/time";
import { createState, onCleanup } from "ags";
import Wp from "gi://AstalWp";

const VolumeProgress = ({ visible, setVisible }) => {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!;
  const [iconName, setIconName] = createState(
    speaker.volumeIcon || "audio-volume-muted"
  );
  const [value, setValue] = createState(speaker.volume || 0);
  let count = 0;

  function show(v: number, icon: string) {
    setVisible(true);
    setValue(v);
    setIconName(icon);
    count++;
    timeout(1000, () => {
      count--;
      if (count === 0) setVisible(false);
    });
  }

  const connectionId = speaker.connect("notify::volume", () => {
    show(speaker.volume, speaker.volumeIcon);
  });

  // Clean up the connection when component is destroyed
  onCleanup(() => {
    speaker.disconnect(connectionId);
  });

  return (
    <box
      spacing={16}
      halign={Gtk.Align.END}
      valign={Gtk.Align.CENTER}
      vertical={true}
      css={`
        font-size: 1.5em;
        background-color: rgba(0, 0, 0, 0.8);
        border-radius: 9999px;
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

export default function VolumeOSD({ monitor }: { monitor: number }) {
  const [visible, setVisible] = createState(false);
  const { RIGHT } = Astal.WindowAnchor;

  return (
    <window
      name="volume-osd"
      namespace="volume-osd"
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
      <VolumeProgress visible={visible} setVisible={setVisible} />
    </window>
  );
}
