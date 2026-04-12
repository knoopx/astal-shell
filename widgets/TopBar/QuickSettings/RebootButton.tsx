import { execAsync } from "ags/process";
import { confirm } from "../../../support/confirm";
import ActionButton from "./ActionButton";

export default () => (
  <ActionButton
    icon="system-reboot-symbolic"
    tooltipText="Reboot"
    onClicked={() => confirm(() => execAsync(["systemctl", "reboot"]))}
  />
);
