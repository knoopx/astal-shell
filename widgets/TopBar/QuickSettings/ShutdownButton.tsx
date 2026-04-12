import { execAsync } from "ags/process";
import { confirm } from "../../../support/confirm";
import ActionButton from "./ActionButton";

export default () => (
  <ActionButton
    icon="system-shutdown-symbolic"
    tooltipText="Shutdown"
    onClicked={() => confirm(() => execAsync(["systemctl", "poweroff"]))}
  />
);
