import { createBinding } from "ags";
import { Gtk } from "ags/gtk3";
import Battery from "gi://AstalBattery";
import Meter from "./Meter";
import Label from "./Label";

export default () => {
  const batteryDevice = Battery.get_default();
  const percentage = createBinding(batteryDevice, "percentage");
  const charging = createBinding(batteryDevice, "charging");
  const state = createBinding(batteryDevice, "state");
  const timeToFull = createBinding(batteryDevice, "time_to_full");
  const capacity = createBinding(batteryDevice, "capacity");
  const energy = createBinding(batteryDevice, "energy");
  const energyFull = createBinding(batteryDevice, "energy_full");
  const energyRate = createBinding(batteryDevice, "energy_rate");
  const voltage = createBinding(batteryDevice, "voltage");
  const temperature = createBinding(batteryDevice, "temperature");
  const technology = createBinding(batteryDevice, "technology");
  const vendor = createBinding(batteryDevice, "vendor");
  const model = createBinding(batteryDevice, "model");

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "Unknown";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

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

  const tooltipMarkup = percentage((p) => {
    const s = state.get();
    const c = charging.get();
    const ttf = timeToFull.get();
    const cap = capacity.get();
    const en = energy.get();
    const enFull = energyFull.get();
    const enRate = energyRate.get();
    const vol = voltage.get();
    const temp = temperature.get();
    const tech = technology.get();
    const vend = vendor.get();
    const mod = model.get();

    let markup = `<b>Battery: ${Math.round(p)}%</b>\n`;
    markup += `<b>Status:</b> ${getStateText(s)}\n`;

    if (c && ttf > 0) {
      markup += `<b>Time to full:</b> ${formatTime(ttf)}\n`;
    }

    if (cap > 0) {
      markup += `<b>Capacity:</b> ${Math.round(cap)}%\n`;
    }

    if (en > 0 && enFull > 0) {
      markup += `<b>Energy:</b> ${en.toFixed(1)}/${enFull.toFixed(1)} Wh\n`;
    }

    if (enRate > 0) {
      markup += `<b>Power draw:</b> ${enRate.toFixed(1)} W\n`;
    }

    if (vol > 0) {
      markup += `<b>Voltage:</b> ${vol.toFixed(2)} V\n`;
    }

    if (temp > 0) {
      markup += `<b>Temperature:</b> ${temp.toFixed(1)}°C\n`;
    }

    if (tech) {
      markup += `<b>Technology:</b> ${tech}\n`;
    }

    if (vend && mod) {
      markup += `<b>Device:</b> ${vend} ${mod}`;
    }

    return markup.trim();
  });

  return (
    <box halign={Gtk.Align.CENTER}>
      <box tooltipMarkup={tooltipMarkup}>
        <Meter invert value={percentage} />
      </box>
      <Label label="BAT" />
    </box>
  );
};
