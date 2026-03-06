import Wp from "gi://AstalWp";
import OSDWindow from "./OSDWindow";

export default function VolumeOSD({ monitor }: { monitor: number }) {
  const speaker = Wp.get_default()!.audio.defaultSpeaker;

  return (
    <OSDWindow
      name="volume-osd"
      monitor={monitor}
      getIcon={() => speaker.volumeIcon || "audio-volume-muted"}
      getValue={() => speaker.volume || 0}
      connect={(cb) => speaker.connect("notify::volume", cb)}
      disconnect={(id) => speaker.disconnect(id)}
    />
  );
}
