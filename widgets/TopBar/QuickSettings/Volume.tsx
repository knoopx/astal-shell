import Wp from "gi://AstalWp";
import { createBinding } from "ags";
import { Gtk } from "ags/gtk3";

export default () => {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!;
  const volumeIcon = createBinding(speaker, "volumeIcon");
  const volume = createBinding(speaker, "volume");

  return (
    <box spacing={4} valign={Gtk.Align.CENTER} >
      <icon icon={volumeIcon} />
      <slider
      widthRequest={100}

        onDragged={({ value }) => (speaker.volume = value)}
        value={volume}
      />
    </box>
  );
};
