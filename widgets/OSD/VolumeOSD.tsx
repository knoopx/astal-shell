import Wp from "gi://AstalWp";
import OSDWindow from "./OSDWindow";

export default function VolumeOSD({ monitor }: { monitor: number }) {
  const wp = Wp.get_default()!;
  const speaker = wp.audio.defaultSpeaker;

  // `speaker.volume` is reported on the Wp scale (default CUBIC = cbrt of the
  // base-relative linear volume), so it is a perceptual value that does not
  // match the system's 0-100% level and can exceed 1.0 when boosted, which
  // overflows the bar's 0..1 range. Convert to the bar's native 0..1
  // (0-100% linear) range and clamp so the fill always stays in bounds.
  const progress = () => {
    const v = speaker.volume || 0;
    const linear = wp.scale === Wp.Scale.LINEAR ? v : v * v * v;
    return Math.min(1, Math.max(0, linear));
  };

  return (
    <OSDWindow
      name="volume-osd"
      monitor={monitor}
      getIcon={() => speaker.volumeIcon || "audio-volume-muted"}
      getValue={progress}
      connect={(cb) => speaker.connect("notify::volume", cb)}
      disconnect={(id) => speaker.disconnect(id)}
    />
  );
}
