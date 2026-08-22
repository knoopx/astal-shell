import Battery from "gi://AstalBattery";
import GLib from "gi://GLib";

export const hasNvidiaGpu = GLib.file_test(
  "/proc/driver/nvidia",
  GLib.FileTest.IS_DIR,
);

export const hasBattery = (() => {
  try {
    const device = Battery.get_default();
    return device !== null && device.isPresent === true;
  } catch {
    return false;
  }
})();