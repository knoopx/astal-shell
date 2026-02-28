import Brightness from "../../support/brightness";
import OSDWindow from "./OSDWindow";

export default function BrightnessOSD({ monitor }: { monitor: number }) {
  const brightness = Brightness.get_default();

  if (brightness.screenValue === undefined) {
    return <box />;
  }

  return (
    <OSDWindow
      name="brightness-osd"
      monitor={monitor}
      getIcon={() => "display-brightness-symbolic"}
      getValue={() => brightness.screen || 0}
      connect={(cb) => brightness.connect("notify::screen", cb)}
      disconnect={(id) => brightness.disconnect(id)}
    />
  );
}
