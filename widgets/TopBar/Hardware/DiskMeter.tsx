import { createPoll } from "ags/time";
import GTop from "gi://GTop";
import LabeledMeter from "./LabeledMeter";

const disk = createPoll(0, 2000, () => {
  const fsusage = new GTop.glibtop_fsusage();
  GTop.glibtop_get_fsusage(fsusage, "/");

  const size = fsusage.blocks * fsusage.block_size;
  const used = (fsusage.blocks - fsusage.bfree) * fsusage.block_size;
  return size > 0 ? used / size : 0;
});

export default () => <LabeledMeter value={disk} label="HDD" />;
