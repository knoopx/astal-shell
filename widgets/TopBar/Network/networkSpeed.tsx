import { createState } from "ags";
import { createPoll } from "ags/time";
import { exec } from "ags/process";
import {
  parseProcNetDev,
  calculateNetworkSpeed,
} from "../../../support/networkParser";

const interval = 1000;
let lastTotalDownBytes = 0;
let lastTotalUpBytes = 0;

// Create a blink state that syncs with network polling
export const [blinkState, setBlinkState] = createState(true);

const networkSpeed = createPoll({ download: 0, upload: 0 }, interval, () => {
  setBlinkState((prev) => !prev);

  const content = exec("cat /proc/net/dev");
  const traffic = parseProcNetDev(content);
  const result = calculateNetworkSpeed(
    traffic,
    lastTotalDownBytes,
    lastTotalUpBytes,
    interval,
  );

  lastTotalDownBytes = result.totalDown;
  lastTotalUpBytes = result.totalUp;

  return { download: result.download, upload: result.upload };
});

export default networkSpeed;
