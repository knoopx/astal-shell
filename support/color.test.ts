import { describe, it, expect } from "vitest";
import { levelColor, type LevelTheme } from "./color";

// Fixed theme injected through the public interface — the distinct status
// colors prove the injected theme drives the decision (no fallback hiding a
// bug in the wiring).
const theme: LevelTheme = {
  status: {
    success: "rgba(0, 128, 0, 0.9)",
    warning: "rgba(255, 165, 0, 0.5)",
    error: "rgba(255, 0, 0, 0.75)",
  },
};

const EXPECTED = {
  success: [0, 128 / 255, 0, 0.9],
  warning: [1, 165 / 255, 0, 0.5],
  error: [1, 0, 0, 0.75],
};

describe("levelColor", () => {
  describe("given a non-inverted meter (high values are error)", () => {
    describe("when the value is above 0.75", () => {
      it("then returns the error color", () => {
        expect(levelColor(0.9, false, theme)).toEqual(EXPECTED.error);
        expect(levelColor(1, false, theme)).toEqual(EXPECTED.error);
      });
    });

    describe("when the value is exactly 0.75", () => {
      it("then returns the warning color (not above the error threshold)", () => {
        expect(levelColor(0.75, false, theme)).toEqual(EXPECTED.warning);
      });
    });

    describe("when the value is above 0.25 and at most 0.75", () => {
      it("then returns the warning color", () => {
        expect(levelColor(0.5, false, theme)).toEqual(EXPECTED.warning);
      });
    });

    describe("when the value is exactly 0.25", () => {
      it("then returns the success color (not above the warning threshold)", () => {
        expect(levelColor(0.25, false, theme)).toEqual(EXPECTED.success);
      });
    });

    describe("when the value is 0.25 or below", () => {
      it("then returns the success color", () => {
        expect(levelColor(0.1, false, theme)).toEqual(EXPECTED.success);
        expect(levelColor(0, false, theme)).toEqual(EXPECTED.success);
      });
    });
  });

  describe("given an inverted meter (high values are success)", () => {
    describe("when the value is above 0.75", () => {
      it("then returns the success color", () => {
        expect(levelColor(0.9, true, theme)).toEqual(EXPECTED.success);
        expect(levelColor(1, true, theme)).toEqual(EXPECTED.success);
      });
    });

    describe("when the value is exactly 0.75", () => {
      it("then returns the warning color (not above the success threshold)", () => {
        expect(levelColor(0.75, true, theme)).toEqual(EXPECTED.warning);
      });
    });

    describe("when the value is above 0.25 and at most 0.75", () => {
      it("then returns the warning color", () => {
        expect(levelColor(0.5, true, theme)).toEqual(EXPECTED.warning);
      });
    });

    describe("when the value is exactly 0.25", () => {
      it("then returns the error color (not above the warning threshold)", () => {
        expect(levelColor(0.25, true, theme)).toEqual(EXPECTED.error);
      });
    });

    describe("when the value is 0.25 or below", () => {
      it("then returns the error color", () => {
        expect(levelColor(0.1, true, theme)).toEqual(EXPECTED.error);
        expect(levelColor(0, true, theme)).toEqual(EXPECTED.error);
      });
    });
  });

  describe("given no invert argument (default)", () => {
    describe("when calling with the default invert value", () => {
      it("then behaves as a non-inverted meter", () => {
        expect(levelColor(0.9, undefined, theme)).toEqual(EXPECTED.error);
        expect(levelColor(0.5, undefined, theme)).toEqual(EXPECTED.warning);
        expect(levelColor(0.1, undefined, theme)).toEqual(EXPECTED.success);
      });
    });
  });
});