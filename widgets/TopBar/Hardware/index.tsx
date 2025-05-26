import { subprocess, Variable } from "astal";
import { Astal, Gtk } from "astal/gtk3";
import GTop from "gi://GTop";

const ram = Variable(0).poll(2000, () => {
  const memory = new GTop.glibtop_mem();
  GTop.glibtop_get_mem(memory);
  return (memory.user / memory.total) * 100;
});

const gpu = Variable([0, 0, 0, 0]).poll(
  2000,
  [
    "bash",
    "-c",
    "nvidia-smi --query-gpu=temperature.gpu,utilization.gpu,memory.used,memory.total --format=csv,noheader,nounits",
  ],
  (out, prev) => out.split(", ").map(Number)
);

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

const actions = {
  [Astal.MouseButton.PRIMARY]: () => subprocess("missioncenter"),
};

const Label = (props) => (
  <label
    {...props}
    angle={90.0}
    css={`
      margin-left: -1em;
      font-size: 0.5em;
      font-weight: bold;
    `}
  />
);

const levelClass = (value) => {
  if (value > 0.75) {
    return "high";
  }
  if (value > 0.25) {
    return "medium";
  }
  return "low";
};

const Meter = (props) => (
  <levelbar
    className={levelClass(props.value)}
    {...props}
    vertical
    inverted
    heightRequest={24}
    css={`
      border-radius: 2px;
    `}
  />
);

export default () => (
  <eventbox onClickRelease={(_, { button }) => actions[button]?.()}>
    <box
      css={`
        margin-left: 8px;
      `}
      spacing={8}
      valign={Gtk.Align.CENTER}
    >
      {cpu((v) => <Meter value={v / 100} />)}
      <Label label="CPU" />
      {ram((v) => <Meter value={v / 100} />)}
      <Label label="RAM" />
      {gpu((v) => <Meter value={v[1] / 100} />)}
      <Label label="GPU" />
      {gpu((v) => <Meter value={v[2] / v[3]} />)}
      <Label label="VRAM" />
      {disk(({ use }) => <Meter value={parseInt(use) / 100} />)}
      <Label label="HDD" />
    </box>
  </eventbox>
);
