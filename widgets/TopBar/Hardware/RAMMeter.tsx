import { Variable } from "astal";
import { Astal } from "astal/gtk3";
import GTop from "gi://GTop";
import Meter from "./Meter";
import Label from "./Label";

const ram = Variable(0).poll(2000, () => {
  const memory = new GTop.glibtop_mem();
  GTop.glibtop_get_mem(memory);
  return (memory.user / memory.total) * 100;
});

export default () => (
  <box halign={Astal.WindowAnchor.CENTER}>
    {ram((v) => (
      <Meter value={v / 100} />
    ))}
    <Label label="RAM" />
  </box>
);
