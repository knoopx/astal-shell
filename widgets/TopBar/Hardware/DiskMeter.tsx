import { Variable } from "astal";
import { Astal } from "astal/gtk3";
import GTop from "gi://GTop";
import Meter from "./Meter";
import Label from "./Label";

const disk = Variable({
  size: "0G",
  used: "0G",
  use: "0%",
  mount_on: "?",
}).poll(2000, () => {
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
});

export default () => (
  <box halign={Astal.WindowAnchor.CENTER}>
    {disk(({ use }) => (
      <Meter value={parseInt(use) / 100} />
    ))}
    <Label label="HDD" />
  </box>
);
