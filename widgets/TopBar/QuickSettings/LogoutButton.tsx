import { execAsync } from "ags/process";
import { confirm } from "../../../support/confirm";
import ActionButton from "./ActionButton";

export default () => (
  <ActionButton
    icon="system-log-out-symbolic"
    tooltipText="Logout"
    onClicked={() =>
      confirm(() => execAsync(["niri", "msg", "action", "quit", "-s"]))
    }
  />
);
