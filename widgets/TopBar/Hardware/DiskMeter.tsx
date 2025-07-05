import { createPoll } from "ags/time";
import { Gtk } from "ags/gtk3";
import GTop from "gi://GTop";
import Meter from "./Meter";
import Label from "./Label";

const disk = createPoll(
  {
    size: "0G",
    used: "0G",
    use: "0%",
    mount_on: "?",
  },
  2000,
  () => {
    const fsusage = new GTop.glibtop_fsusage();
    GTop.glibtop_get_fsusage(fsusage, "/");

    const size = fsusage.blocks * fsusage.block_size;
    const used = (fsusage.blocks - fsusage.bfree) * fsusage.block_size;
    const use = size > 0 ? (used / size) * 100 : 0;

    return {
      size: `${(size / 1024 ** 3).toFixed(0)}G`,
      used: `${(used / 1024 ** 3).toFixed(0)}G`,
      use: `${use.toFixed(0)}%`,
      mount_on: "/",
    };
  }
);

export default () => (
  <box halign={Gtk.Align.CENTER}>
    <Meter value={disk(({ use }) => parseInt(use) / 100)} />
    <Label label="HDD" />
  </box>
);
