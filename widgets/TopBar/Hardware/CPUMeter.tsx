import { createPoll } from "ags/time";
import GTop from "gi://GTop";
import LabeledMeter from "./LabeledMeter";

const cpu = createPoll({ used: 0, total: 0, load: 0 }, 2000, (prev) => {
  const cpu = new GTop.glibtop_cpu();
  GTop.glibtop_get_cpu(cpu);

  const used = cpu.user + cpu.sys + cpu.nice + cpu.irq + cpu.softirq;
  const total = used + cpu.idle + cpu.iowait;

  const diffUsed = used - prev.used;
  const diffTotal = total - prev.total;

  return {
    used,
    total,
    load: diffTotal > 0 ? (diffUsed / diffTotal) * 100 : 0,
  };
});

export default () => (
  <LabeledMeter value={cpu((data) => data.load / 100)} label="CPU" />
);
