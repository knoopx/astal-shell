import { describe, it, expect } from "vitest";
import {
  moonPhase,
  moonPhaseFromDate,
  openWeatherWMOToEmoji,
  EMoonPhase,
  EMoonPhaseName,
  moonIcons,
  MOON_PHASE_COUNT,
} from "./weather";

describe("moonPhase", () => {
  describe("given a known new moon date (2024-01-11)", () => {
    describe("when calculating phase", () => {
      it("then returns New phase", () => {
        const result = moonPhase(2024, 1, 11);
        expect(result.phase).toBe(EMoonPhase.New);
        expect(result.name).toBe(EMoonPhaseName.New);
        expect(result.icon).toBe("🌑");
      });
    });
  });

  describe("given a known full moon date (2024-01-25)", () => {
    describe("when calculating phase", () => {
      it("then returns Full phase", () => {
        const result = moonPhase(2024, 1, 25);
        expect(result.phase).toBe(EMoonPhase.Full);
        expect(result.name).toBe(EMoonPhaseName.Full);
        expect(result.icon).toBe("🌕");
      });
    });
  });

  describe("given January/February dates (month < 3 adjustment)", () => {
    describe("when month is January", () => {
      it("then calculates without error", () => {
        const result = moonPhase(2024, 1, 15);
        expect(result.phase).toBeGreaterThanOrEqual(EMoonPhase.New);
        expect(result.phase).toBeLessThan(MOON_PHASE_COUNT);
      });
    });

    describe("when month is February", () => {
      it("then calculates without error", () => {
        const result = moonPhase(2024, 2, 15);
        expect(result.phase).toBeGreaterThanOrEqual(EMoonPhase.New);
        expect(result.phase).toBeLessThan(MOON_PHASE_COUNT);
      });
    });
  });

  describe("given dates across different months", () => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    months.forEach((month) => {
      describe(`when month is ${month}`, () => {
        it("then returns a valid phase", () => {
          const result = moonPhase(2024, month, 15);
          expect(result.phase).toBeGreaterThanOrEqual(0);
          expect(result.phase).toBeLessThan(8);
          expect(result.name).toBeDefined();
          expect(result.icon).toBeDefined();
          expect(moonIcons).toContain(result.icon);
        });
      });
    });
  });

  describe("given result structure", () => {
    describe("when calculating any phase", () => {
      it("then icon matches phase index", () => {
        const result = moonPhase(2024, 6, 15);
        expect(result.icon).toBe(moonIcons[result.phase]);
      });
    });
  });
});

describe("moonPhaseFromDate", () => {
  describe("given a Date object", () => {
    describe("when calculating", () => {
      it("then returns same result as moonPhase with equivalent args", () => {
        const date = new Date(2024, 5, 15); // June 15, 2024
        const fromDate = moonPhaseFromDate(date);
        const direct = moonPhase(2024, 6, 15);
        expect(fromDate).toEqual(direct);
      });
    });
  });
});

describe("openWeatherWMOToEmoji", () => {
  describe("given clear sky during daytime", () => {
    describe("when converting code 0", () => {
      it("then returns sun emoji", () => {
        const result = openWeatherWMOToEmoji(0, true);
        expect(result.value).toBe("☀️");
        expect(result.description).toBe("Clear sky");
        expect(result.originalNumericCode).toBe(0);
      });
    });
  });

  describe("given clear sky during nighttime", () => {
    describe("when converting code 0", () => {
      it("then returns moon emoji", () => {
        const result = openWeatherWMOToEmoji(0, false);
        expect(result.value).toBe("🌙");
        expect(result.description).toBe("Clear sky");
      });
    });
  });

  describe("given mainly clear conditions", () => {
    describe("when daytime", () => {
      it("then returns partly sunny emoji", () => {
        const result = openWeatherWMOToEmoji(1, true);
        expect(result.value).toBe("🌤️");
        expect(result.description).toBe("Mainly clear");
      });
    });

    describe("when nighttime", () => {
      it("then returns partly clear with moon", () => {
        const result = openWeatherWMOToEmoji(1, false);
        expect(result.value).toBe("🌤️🌙");
      });
    });
  });

  describe("given overcast conditions", () => {
    describe("when daytime", () => {
      it("then returns cloud with sun emoji for code 3", () => {
        const result = openWeatherWMOToEmoji(3, true);
        expect(result.value).toBe("🌥️");
        expect(result.description).toBe("Overcast");
      });
    });

    describe("when nighttime", () => {
      it("then returns cloud with moon for code 3", () => {
        const result = openWeatherWMOToEmoji(3, false);
        expect(result.value).toBe("☁️🌙");
      });
    });
  });

  describe("given precipitation codes", () => {
    const precipitationCases = [
      { code: 51, description: "Drizzle: Light" },
      { code: 53, description: "Drizzle: Moderate" },
      { code: 55, description: "Drizzle: Dense intensity" },
      { code: 61, description: "Rain: Slight" },
      { code: 63, description: "Rain: Moderate" },
      { code: 65, description: "Rain: Heavy intensity" },
    ];

    precipitationCases.forEach(({ code, description }) => {
      describe(`when code is ${code} (${description})`, () => {
        it("then returns a rain-related emoji", () => {
          const result = openWeatherWMOToEmoji(code);
          expect(result.description).toBe(description);
          expect(result.originalNumericCode).toBe(code);
        });
      });
    });
  });

  describe("given snow codes", () => {
    const snowCases = [
      { code: 71, description: "Snow fall: Slight" },
      { code: 73, description: "Snow fall: Moderate" },
      { code: 75, description: "Snow fall: Heavy intensity" },
      { code: 77, description: "Snow grains" },
    ];

    snowCases.forEach(({ code, description }) => {
      describe(`when code is ${code} (${description})`, () => {
        it("then returns snow emoji", () => {
          const result = openWeatherWMOToEmoji(code);
          expect(result.value).toBe("🌨️");
          expect(result.description).toBe(description);
        });
      });
    });
  });

  describe("given thunderstorm codes", () => {
    it("then code 95 returns thunderstorm emoji", () => {
      const result = openWeatherWMOToEmoji(95);
      expect(result.value).toBe("🌩️");
      expect(result.description).toBe("Thunderstorm: Slight or moderate");
    });

    it("then code 96 returns severe thunderstorm emoji", () => {
      const result = openWeatherWMOToEmoji(96);
      expect(result.value).toBe("⛈️");
      expect(result.description).toBe("Thunderstorm with slight hail");
    });

    it("then code 99 returns severe thunderstorm with hail", () => {
      const result = openWeatherWMOToEmoji(99);
      expect(result.value).toBe("⛈️🌨️");
      expect(result.description).toBe("Thunderstorm with heavy hail");
    });
  });

  describe("given fog codes", () => {
    it("then code 45 returns fog emoji", () => {
      const result = openWeatherWMOToEmoji(45);
      expect(result.value).toBe("🌫️");
      expect(result.description).toBe("Fog");
    });

    it("then code 48 returns rime fog emoji", () => {
      const result = openWeatherWMOToEmoji(48);
      expect(result.value).toBe("🌫️❄️");
      expect(result.description).toBe("Depositing rime fog");
    });
  });

  describe("given unknown weather code", () => {
    describe("when code is not in WMO table", () => {
      it("then returns shrug emoji with -1 code", () => {
        const result = openWeatherWMOToEmoji(999);
        expect(result.value).toBe("🤷‍♂️");
        expect(result.originalNumericCode).toBe(-1);
        expect(result.description).toBe("Unknown weather code");
      });
    });
  });

  describe("given no arguments", () => {
    describe("when called with defaults", () => {
      it("then returns unknown weather", () => {
        const result = openWeatherWMOToEmoji();
        expect(result.originalNumericCode).toBe(-1);
        expect(result.description).toBe("Unknown weather code");
      });
    });
  });
});
