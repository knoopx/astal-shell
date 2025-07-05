import GObject, { register, property } from "ags/gobject";
import { monitorFile, readFileAsync } from "ags/file";
import { exec } from "ags/process";

const safeExec = (command: string, fallback: string = "0"): string => {
  try {
    return exec(command);
  } catch (error) {
    console.warn(`Command failed: ${command}`, error);
    return fallback;
  }
};

const get = (args: string) => {
  const result = safeExec(`brightnessctl ${args}`);
  return Number(result) || 0;
};

const getScreen = () => {
  const result = safeExec(`bash -c "ls -w1 /sys/class/backlight | head -1"`, "");
  return result.trim();
};

@register({
  GTypeName: "Brightness",
})
export default class Brightness extends GObject.Object {
  static instance: Brightness;
  static get_default() {
    if (!this.instance) this.instance = new Brightness();

    return this.instance;
  }

  #screenMax = get("max");
  #screen = get("get") / (this.#screenMax || 1);
  #screenName = getScreen();

  @property(Number)
  screen = this.#screen;

  get screenValue() {
    return this.#screen;
  }

  constructor() {
    super();

    // Only set up monitoring if we have a valid screen device
    if (this.#screenName && this.#screenMax > 0) {
      try {
        monitorFile(`/sys/class/backlight/${this.#screenName}/brightness`, async (f) => {
          try {
            const v = await readFileAsync(f);
            this.#screen = Number(v) / this.#screenMax;
            this.notify("screen");
          } catch (error) {
            console.warn("Failed to read brightness file:", error);
          }
        });
      } catch (error) {
        console.warn("Failed to monitor brightness file:", error);
      }
    } else {
      console.warn("Brightness control not available: brightnessctl not found or no backlight devices");
    }
  }
}
