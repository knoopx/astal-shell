import { createPoll } from "ags/time";
import { Gtk } from "ags/gtk3";
import GTop from "gi://GTop";
import Meter from "./Meter";
import Label from "./Label";

const ram = createPoll(0, 2000, () => {
  const memory = new GTop.glibtop_mem();
  GTop.glibtop_get_mem(memory);
  return (memory.user / memory.total) * 100;
});

export default () => (
  <box halign={Gtk.Align.CENTER}>
    <Meter value={ram((v) => v / 100)} />
    <Label label="RAM" />
  </box>
);
