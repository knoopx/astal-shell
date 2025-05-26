import Wp from "gi://AstalWp";
import { bind } from "astal";
import { Gtk } from "astal/gtk3";

export default () => {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!;

  return (
    <box spacing={4} valign={Gtk.Align.CENTER} >
      <icon icon={bind(speaker, "volumeIcon")} />
      <slider
      widthRequest={100}

        onDragged={({ value }) => (speaker.volume = value)}
        value={bind(speaker, "volume")}
      />
    </box>
  );
};
