import { describe, it, expect } from "vitest";
import { formatBytes } from "./formatBytes";

describe("formatBytes", () => {
  describe("given zero bytes", () => {
    describe("when formatting", () => {
      it("then returns 0 B", () => {
        expect(formatBytes(0)).toEqual({ value: "0", unit: "B" });
      });
    });
  });

  describe("given negative bytes", () => {
    describe("when formatting", () => {
      it("then returns 0 B", () => {
        expect(formatBytes(-100)).toEqual({ value: "0", unit: "B" });
      });
    });
  });

  describe("given non-finite values", () => {
    const cases = [
      { input: NaN, scenario: "NaN" },
      { input: Infinity, scenario: "Infinity" },
      { input: -Infinity, scenario: "-Infinity" },
    ];

    cases.forEach(({ input, scenario }) => {
      describe(`given ${scenario}`, () => {
        it("then returns 0 B", () => {
          expect(formatBytes(input)).toEqual({ value: "0", unit: "B" });
        });
      });
    });
  });

  describe("given bytes in each unit range", () => {
    const cases = [
      { input: 1, expected: { value: "1", unit: "B" }, scenario: "1 byte" },
      {
        input: 500,
        expected: { value: "500", unit: "B" },
        scenario: "500 bytes",
      },
      {
        input: 1024,
        expected: { value: "1", unit: "KB" },
        scenario: "exactly 1 KB",
      },
      {
        input: 1536,
        expected: { value: "2", unit: "KB" },
        scenario: "1.5 KB rounds to 2",
      },
      {
        input: 1024 * 1024,
        expected: { value: "1", unit: "MB" },
        scenario: "exactly 1 MB",
      },
      {
        input: 1024 * 1024 * 1024,
        expected: { value: "1", unit: "GB" },
        scenario: "exactly 1 GB",
      },
      {
        input: 1024 * 1024 * 1024 * 1024,
        expected: { value: "1", unit: "TB" },
        scenario: "exactly 1 TB",
      },
      {
        input: 1024 * 1024 * 1024 * 1024 * 1024,
        expected: { value: "1", unit: "PB" },
        scenario: "exactly 1 PB",
      },
    ];

    cases.forEach(({ input, expected, scenario }) => {
      describe(`given ${scenario}`, () => {
        it(`then returns ${expected.value} ${expected.unit}`, () => {
          expect(formatBytes(input)).toEqual(expected);
        });
      });
    });
  });

  describe("given a value beyond PB range", () => {
    describe("when formatting", () => {
      it("then caps at PB unit", () => {
        const exabyte = 1024 * 1024 * 1024 * 1024 * 1024 * 1024;
        const result = formatBytes(exabyte);
        expect(result.unit).toBe("PB");
        expect(result.value).toBe("1024");
      });
    });
  });
});
