const VIRTUAL_INTERFACE_PATTERNS = [
  /^lo$/,
  /^ifb[0-9]+/,
  /^lxdbr[0-9]+/,
  /^virbr[0-9]+/,
  /^br[0-9]+/,
  /^vnet[0-9]+/,
  /^tun[0-9]+/,
  /^tap[0-9]+/,
];

export function isVirtualInterface(name: string): boolean {
  return VIRTUAL_INTERFACE_PATTERNS.some((pattern) => pattern.test(name));
}

interface InterfaceTraffic {
  name: string;
  downBytes: number;
  upBytes: number;
}

export function parseProcNetDev(content: string): InterfaceTraffic[] {
  const lines = content.split("\n");
  const result: InterfaceTraffic[] = [];

  for (const line of lines) {
    const fields = line.trim().split(/\W+/);
    if (fields.length <= 2) continue;

    const name = fields[0];
    const downBytes = Number.parseInt(fields[1]);
    const upBytes = Number.parseInt(fields[9]);

    if (isVirtualInterface(name) || isNaN(downBytes) || isNaN(upBytes))
      continue;

    result.push({ name, downBytes, upBytes });
  }

  return result;
}

export function calculateNetworkSpeed(
  currentTraffic: InterfaceTraffic[],
  previousTotalDown: number,
  previousTotalUp: number,
  intervalMs: number,
): {
  download: number;
  upload: number;
  totalDown: number;
  totalUp: number;
} {
  let totalDown = 0;
  let totalUp = 0;

  for (const iface of currentTraffic) {
    totalDown += iface.downBytes;
    totalUp += iface.upBytes;
  }

  const intervalSec = intervalMs / 1000;
  const download =
    previousTotalDown === 0 ? 0 : (totalDown - previousTotalDown) / intervalSec;
  const upload =
    previousTotalUp === 0 ? 0 : (totalUp - previousTotalUp) / intervalSec;

  return { download, upload, totalDown, totalUp };
}
