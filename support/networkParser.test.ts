import { describe, it, expect } from "vitest";
import {
  isVirtualInterface,
  parseProcNetDev,
  calculateNetworkSpeed,
} from "./networkParser";

describe("isVirtualInterface", () => {
  describe("given loopback interface", () => {
    it("then returns true", () => {
      expect(isVirtualInterface("lo")).toBe(true);
    });
  });

  describe("given virtual interface patterns", () => {
    const virtualInterfaces = [
      "ifb0",
      "ifb1",
      "lxdbr0",
      "virbr0",
      "br0",
      "vnet0",
      "vnet12",
      "tun0",
      "tap0",
    ];

    virtualInterfaces.forEach((name) => {
      it(`then returns true for ${name}`, () => {
        expect(isVirtualInterface(name)).toBe(true);
      });
    });
  });

  describe("given physical interfaces", () => {
    const physicalInterfaces = ["eth0", "enp0s3", "wlan0", "wlp2s0", "eno1"];

    physicalInterfaces.forEach((name) => {
      it(`then returns false for ${name}`, () => {
        expect(isVirtualInterface(name)).toBe(false);
      });
    });
  });

  describe("given edge cases", () => {
    it("then returns false for empty string", () => {
      expect(isVirtualInterface("")).toBe(false);
    });

    it("then returns false for 'loopback' (not 'lo')", () => {
      expect(isVirtualInterface("loopback")).toBe(false);
    });
  });
});

describe("parseProcNetDev", () => {
  const SAMPLE_PROC_NET_DEV = `Inter-|   Receive                                                |  Transmit
 face |bytes    packets errs drop fifo frame compressed multicast|bytes    packets errs drop fifo colls carrier compressed
    lo: 1234567    8901    0    0    0     0          0         0  1234567    8901    0    0    0     0       0          0
  eth0: 9876543   12345    0    0    0     0          0         0  5432100    6789    0    0    0     0       0          0
 wlan0: 1111111    2222    0    0    0     0          0         0  3333333    4444    0    0    0     0       0          0
virbr0:       0       0    0    0    0     0          0         0        0       0    0    0    0     0       0          0`;

  describe("given standard /proc/net/dev output", () => {
    describe("when parsing", () => {
      it("then extracts physical interfaces only", () => {
        const result = parseProcNetDev(SAMPLE_PROC_NET_DEV);
        const names = result.map((r) => r.name);
        expect(names).toContain("eth0");
        expect(names).toContain("wlan0");
        expect(names).not.toContain("lo");
        expect(names).not.toContain("virbr0");
      });

      it("then parses download bytes correctly", () => {
        const result = parseProcNetDev(SAMPLE_PROC_NET_DEV);
        const eth0 = result.find((r) => r.name === "eth0");
        expect(eth0?.downBytes).toBe(9876543);
      });

      it("then parses upload bytes correctly", () => {
        const result = parseProcNetDev(SAMPLE_PROC_NET_DEV);
        const eth0 = result.find((r) => r.name === "eth0");
        expect(eth0?.upBytes).toBe(5432100);
      });
    });
  });

  describe("given empty input", () => {
    describe("when parsing", () => {
      it("then returns empty array", () => {
        expect(parseProcNetDev("")).toEqual([]);
      });
    });
  });

  describe("given header-only input", () => {
    describe("when parsing", () => {
      it("then returns empty array", () => {
        const headerOnly = `Inter-|   Receive
 face |bytes    packets`;
        expect(parseProcNetDev(headerOnly)).toEqual([]);
      });
    });
  });

  describe("given only virtual interfaces", () => {
    describe("when parsing", () => {
      it("then returns empty array", () => {
        const virtualOnly = `    lo: 100 10 0 0 0 0 0 0 200 20 0 0 0 0 0 0
virbr0: 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0`;
        expect(parseProcNetDev(virtualOnly)).toEqual([]);
      });
    });
  });
});

describe("calculateNetworkSpeed", () => {
  describe("given first measurement (previous totals are 0)", () => {
    describe("when calculating speed", () => {
      it("then returns zero speed (baseline measurement)", () => {
        const traffic = [{ name: "eth0", downBytes: 1000, upBytes: 500 }];
        const result = calculateNetworkSpeed(traffic, 0, 0, 1000);
        expect(result.download).toBe(0);
        expect(result.upload).toBe(0);
        expect(result.totalDown).toBe(1000);
        expect(result.totalUp).toBe(500);
      });
    });
  });

  describe("given a second measurement with traffic increase", () => {
    describe("when calculating speed at 1 second interval", () => {
      it("then returns bytes per second", () => {
        const traffic = [{ name: "eth0", downBytes: 2000, upBytes: 1500 }];
        const result = calculateNetworkSpeed(traffic, 1000, 500, 1000);
        expect(result.download).toBe(1000);
        expect(result.upload).toBe(1000);
      });
    });

    describe("when calculating speed at 2 second interval", () => {
      it("then divides by interval seconds", () => {
        const traffic = [{ name: "eth0", downBytes: 3000, upBytes: 2000 }];
        const result = calculateNetworkSpeed(traffic, 1000, 500, 2000);
        expect(result.download).toBe(1000);
        expect(result.upload).toBe(750);
      });
    });
  });

  describe("given multiple interfaces", () => {
    describe("when calculating speed", () => {
      it("then sums traffic across all interfaces", () => {
        const traffic = [
          { name: "eth0", downBytes: 1000, upBytes: 500 },
          { name: "wlan0", downBytes: 2000, upBytes: 1000 },
        ];
        const result = calculateNetworkSpeed(traffic, 2000, 1000, 1000);
        expect(result.download).toBe(1000);
        expect(result.upload).toBe(500);
        expect(result.totalDown).toBe(3000);
        expect(result.totalUp).toBe(1500);
      });
    });
  });

  describe("given no interfaces", () => {
    describe("when calculating speed", () => {
      it("then returns zero for everything", () => {
        const result = calculateNetworkSpeed([], 0, 0, 1000);
        expect(result.download).toBe(0);
        expect(result.upload).toBe(0);
        expect(result.totalDown).toBe(0);
        expect(result.totalUp).toBe(0);
      });
    });
  });
});
