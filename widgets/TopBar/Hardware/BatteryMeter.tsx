import { Variable, bind } from "astal";
import { Astal, Gtk } from "astal/gtk3";
import Battery from "gi://AstalBattery";
import Meter from "./Meter";
import Label from "./Label";

export default () => {
  // Setup binding to battery device properties
  const batteryDevice = Battery.get_default();
  const battery = Variable.derive(
    [
      bind(batteryDevice, "percentage"),
      bind(batteryDevice, "charging"),
      bind(batteryDevice, "state"),
      bind(batteryDevice, "time_remaining"),
      bind(batteryDevice, "time_to_full"),
      bind(batteryDevice, "capacity"),
      bind(batteryDevice, "energy"),
      bind(batteryDevice, "energy_full"),
      bind(batteryDevice, "energy_rate"),
      bind(batteryDevice, "voltage"),
      bind(batteryDevice, "temperature"),
      bind(batteryDevice, "technology"),
      bind(batteryDevice, "vendor"),
      bind(batteryDevice, "model"),
      bind(batteryDevice, "serial"),
    ],
    (
      percentage,
      charging,
      state,
      timeRemaining,
      timeToFull,
      capacity,
      energy,
      energyFull,
      energyRate,
      voltage,
      temperature,
      technology,
      vendor,
      model,
      serial
    ) => {
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
        percentage,
        charging,
        state,
        timeRemaining,
        timeToFull,
        capacity,
        energy,
        energyFull,
        energyRate,
        voltage,
        temperature,
        technology,
        vendor,
        model,
        serial,
        formatTime,
      };
    }
  );
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

        // Handle percentage - check if it's in 0-1 range or 0-100 range
        const percentageValue =
          data.percentage > 1 ? data.percentage : data.percentage * 100;
        const capacityValue =
          data.capacity > 1 ? data.capacity : data.capacity * 100;

        let tooltipMarkup = `<b>Battery: ${Math.round(percentageValue)}%</b>\n`;
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
          tooltipMarkup += `<b>Capacity:</b> ${Math.round(capacityValue)}%\n`;
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
            <Meter
              invert
              value={
                data.percentage > 1 ? data.percentage / 100 : data.percentage
              }
            />
          </box>
        );
      })}
      <Label label="BAT" />
    </box>
  );
};
