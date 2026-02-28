import { createPoll } from "ags/time";
import GTop from "gi://GTop";
import LabeledMeter from "./LabeledMeter";

const ram = createPoll(0, 2000, () => {
  const memory = new GTop.glibtop_mem();
  GTop.glibtop_get_mem(memory);
  return (memory.user / memory.total) * 100;
});

export default () => <LabeledMeter value={ram((v) => v / 100)} label="RAM" />;
