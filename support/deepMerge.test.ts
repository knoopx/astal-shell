import { describe, it, expect } from "vitest";
import { deepMerge, isObject } from "./deepMerge";

describe("isObject", () => {
  describe("given plain objects", () => {
    const cases = [
      { input: {}, expected: true, scenario: "empty object" },
      { input: { a: 1 }, expected: true, scenario: "object with properties" },
    ];

    cases.forEach(({ input, expected, scenario }) => {
      it(`then returns ${expected} for ${scenario}`, () => {
        expect(isObject(input)).toBe(expected);
      });
    });
  });

  describe("given non-object values", () => {
    const cases = [
      { input: null, scenario: "null" },
      { input: undefined, scenario: "undefined" },
      { input: 42, scenario: "number" },
      { input: "string", scenario: "string" },
      { input: true, scenario: "boolean" },
      { input: [1, 2], scenario: "array" },
    ];

    cases.forEach(({ input, scenario }) => {
      it(`then returns false for ${scenario}`, () => {
        expect(isObject(input)).toBe(false);
      });
    });
  });
});

describe("deepMerge", () => {
  describe("given flat objects", () => {
    describe("when source overrides target keys", () => {
      it("then merged result contains source values", () => {
        const target = { a: 1, b: 2 };
        const source = { b: 3 };
        expect(deepMerge(target, source)).toEqual({ a: 1, b: 3 });
      });
    });

    describe("when source has new keys", () => {
      it("then merged result includes both", () => {
        const target = { a: 1 } as Record<string, unknown>;
        const source = { b: 2 };
        expect(deepMerge(target, source)).toEqual({ a: 1, b: 2 });
      });
    });
  });

  describe("given nested objects", () => {
    describe("when source partially overrides nested values", () => {
      it("then deep merges preserving untouched nested keys", () => {
        const target = {
          colors: { primary: "red", secondary: "blue" },
          font: { size: "12px" },
        };
        const source = {
          colors: { primary: "green" },
        };
        expect(deepMerge(target, source)).toEqual({
          colors: { primary: "green", secondary: "blue" },
          font: { size: "12px" },
        });
      });
    });

    describe("when source has deeply nested overrides", () => {
      it("then merges at all depth levels", () => {
        const target = {
          level1: { level2: { level3: "original", keep: "kept" } },
        };
        const source = {
          level1: { level2: { level3: "overridden" } },
        };
        expect(deepMerge(target, source)).toEqual({
          level1: { level2: { level3: "overridden", keep: "kept" } },
        });
      });
    });
  });

  describe("given source with undefined values", () => {
    describe("when merging", () => {
      it("then preserves target values for undefined source keys", () => {
        const target = { a: 1, b: 2 };
        const source = { a: undefined };
        expect(deepMerge(target, source)).toEqual({ a: 1, b: 2 });
      });
    });
  });

  describe("given source replaces object with primitive", () => {
    describe("when merging", () => {
      it("then source primitive wins", () => {
        const target = { a: { nested: true } } as Record<string, unknown>;
        const source = { a: "flat" };
        expect(deepMerge(target, source)).toEqual({ a: "flat" });
      });
    });
  });

  describe("given source replaces primitive with object", () => {
    describe("when merging", () => {
      it("then source object wins", () => {
        const target = { a: "flat" } as Record<string, unknown>;
        const source = { a: { nested: true } };
        expect(deepMerge(target, source)).toEqual({ a: { nested: true } });
      });
    });
  });

  describe("given empty source", () => {
    describe("when merging", () => {
      it("then returns target unchanged", () => {
        const target = { a: 1, b: { c: 2 } };
        expect(deepMerge(target, {})).toEqual({ a: 1, b: { c: 2 } });
      });
    });
  });

  describe("given target immutability", () => {
    describe("when merging", () => {
      it("then does not mutate the original target", () => {
        const target = { a: 1, b: { c: 2 } };
        const targetCopy = JSON.parse(JSON.stringify(target));
        deepMerge(target, { a: 99 });
        expect(target).toEqual(targetCopy);
      });
    });
  });

  describe("given arrays in objects", () => {
    describe("when source replaces an array", () => {
      it("then source array replaces target array (no array merge)", () => {
        const target = { items: [1, 2, 3] } as Record<string, unknown>;
        const source = { items: [4, 5] };
        expect(deepMerge(target, source)).toEqual({ items: [4, 5] });
      });
    });
  });
});
