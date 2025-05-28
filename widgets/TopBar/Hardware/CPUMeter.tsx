import { Variable } from "astal";
import { Astal } from "astal/gtk3";
import GTop from "gi://GTop";
import Meter from "./Meter";
import Label from "./Label";

const cpu = Variable.derive(
  [
    Variable({ used: 0, total: 0, load: 0 }).poll(
      2000,
      ({ used: lastUsed, total: lastTotal }) => {
        const cpu = new GTop.glibtop_cpu();
        GTop.glibtop_get_cpu(cpu);

        const used = cpu.user + cpu.sys + cpu.nice + cpu.irq + cpu.softirq;
        const total = used + cpu.idle + cpu.iowait;

        const diffUsed = used - lastUsed;
        const diffTotal = total - lastTotal;

        return {
          used,
          total,
          load: diffTotal > 0 ? (diffUsed / diffTotal) * 100 : 0,
        };
      }
    ),
  ],
  ({ load }) => load
);

export default () => (
  <box halign={Astal.WindowAnchor.CENTER}>
    {cpu((v) => (
      <Meter value={v / 100} />
    ))}
    <Label label="CPU" />
  </box>
);
