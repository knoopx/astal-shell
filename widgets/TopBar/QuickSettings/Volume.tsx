import Wp from "gi://AstalWp";
import { createBinding, onCleanup } from "ags";
import { Gtk } from "ags/gtk4";
import Astal from "gi://Astal?version=4.0";

export default () => {
  const speaker = Wp.get_default()!.audio.defaultSpeaker;
  const volumeIcon = createBinding(speaker, "volumeIcon");

  const slider = (<slider
    widthRequest={100}
    value={speaker.volume}
    onChangeValue={(_self, _scroll, value) => { speaker.volume = value }}
  />) as Astal.Slider;

  const signalId = speaker.connect("notify::volume", () => {
    slider.value = speaker.volume;
  });

  onCleanup(() => speaker.disconnect(signalId));

  return (
    <box spacing={4} valign={Gtk.Align.CENTER}>
      <image iconName={volumeIcon} pixelSize={16} />
      {slider}
    </box>
  );
};
