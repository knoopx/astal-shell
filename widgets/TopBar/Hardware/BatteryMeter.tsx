import { Variable } from "astal";
import { Astal, Gtk } from "astal/gtk3";
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

    // Format time remaining
    const formatTime = (seconds: number) => {
      if (seconds <= 0) return "Unknown";
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    };

    return {
      percentage:
        device.energy_full > 0 && device.energy >= 0
          ? (device.energy / device.energy_full) * 100
          : device.percentage,
      charging: device.charging,
      state: device.state,
      timeRemaining: device.time_remaining,
      timeToFull: device.time_to_full,
      capacity: device.capacity,
      energy: device.energy,
      energyFull: device.energy_full,
      energyRate: device.energy_rate,
      voltage: device.voltage,
      temperature: device.temperature,
      technology: device.technology,
      vendor: device.vendor,
      model: device.model,
      serial: device.serial,
      formatTime,
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

        // Generate detailed tooltip markup
        const getStateText = (state: number) => {
          switch (state) {
            case 1:
              return "Charging";
            case 2:
              return "Discharging";
            case 3:
              return "Empty";
            case 4:
              return "Fully charged";
            case 5:
              return "Pending charge";
            case 6:
              return "Pending discharge";
            default:
              return "Unknown";
          }
        };

        let tooltipMarkup = `<b>Battery: ${Math.round(data.percentage)}%</b>\n`;
        tooltipMarkup += `<b>Status:</b> ${getStateText(data.state)}\n`;

        if (data.charging && data.timeToFull > 0) {
          tooltipMarkup += `<b>Time to full:</b> ${data.formatTime(
            data.timeToFull
          )}\n`;
        }

        if (!data.charging && data.timeRemaining > 0) {
          tooltipMarkup += `<b>Time remaining:</b> ${data.formatTime(
            data.timeRemaining
          )}\n`;
        }

        if (data.capacity > 0) {
          tooltipMarkup += `<b>Capacity:</b> ${Math.round(data.capacity)}%\n`;
        }

        if (data.energy > 0 && data.energyFull > 0) {
          tooltipMarkup += `<b>Energy:</b> ${data.energy.toFixed(
            1
          )}/${data.energyFull.toFixed(1)} Wh\n`;
        }

        if (data.energyRate > 0) {
          tooltipMarkup += `<b>Power draw:</b> ${data.energyRate.toFixed(
            1
          )} W\n`;
        }

        if (data.voltage > 0) {
          tooltipMarkup += `<b>Voltage:</b> ${data.voltage.toFixed(2)} V\n`;
        }

        if (data.temperature > 0) {
          tooltipMarkup += `<b>Temperature:</b> ${data.temperature.toFixed(
            1
          )}°C\n`;
        }

        if (data.technology) {
          tooltipMarkup += `<b>Technology:</b> ${data.technology}\n`;
        }

        if (data.vendor && data.model) {
          tooltipMarkup += `<b>Device:</b> ${data.vendor} ${data.model}`;
        }

        return (
          <box tooltipMarkup={tooltipMarkup.trim()}>
            <Meter invert value={data.percentage} />
          </box>
        );
      })}
      <Label label="BAT" />
    </box>
  );
};
