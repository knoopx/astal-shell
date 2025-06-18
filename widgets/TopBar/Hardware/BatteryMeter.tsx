import { Variable } from "astal";
import { Astal } from "astal/gtk3";
import Battery from "gi://AstalBattery";
import Meter from "./Meter";
import Label from "./Label";

// Check if battery is available
const hasBattery = (() => {
  try {
    const device = Battery.get_default();
    // Use the is_battery property from the documentation
    return device !== null && device.is_battery;
  } catch {
    return false;
  }
})();

const battery = Variable.derive(
  [
    Variable(null).poll(5000, () => {
      if (!hasBattery) return null;
      try {
        const device = Battery.get_default();
        return device;
      } catch {
        return null;
      }
    }),
  ],
  (device) => {
    if (!device || !device.is_battery) return null;
    return {
      percentage: device.percentage,
      charging: device.charging,
    };
  }
);

export default () => {
  // Don't render if no battery is present
  if (!hasBattery) {
    return null;
  }

  return (
    <box halign={Astal.WindowAnchor.CENTER}>
      {battery((data) => {
        if (!data) return null;
        return <Meter value={data.percentage} />;
      })}
      <Label label="BAT" />
    </box>
  );
};
