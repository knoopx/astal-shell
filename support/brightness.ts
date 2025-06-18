import GObject, { register, property } from "astal/gobject";
import { monitorFile, readFileAsync } from "astal/file";
import { exec } from "astal/process";

const get = (args: string) => Number(exec(`brightnessctl ${args}`));
const screen = exec(`bash -c "ls -w1 /sys/class/backlight | head -1"`);

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
  #screen = get("get") / (get("max") || 1);

  @property(Number)
  get screen() {
    return this.#screen;
  }

  constructor() {
    super();
    monitorFile(`/sys/class/backlight/${screen}/brightness`, async (f) => {
      const v = await readFileAsync(f);
      this.#screen = Number(v) / this.#screenMax;
      this.notify("screen");
    });
  }
}
