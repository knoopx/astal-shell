const { round, trunc: truncate } = Math;

export enum EMoonPhase {
  New = 0,
  Full = 4,
}

export const MOON_PHASE_COUNT = 8;

export const moonIcons: [
  New: string,
  WaxingCrescent: string,
  QuarterMoon: string,
  WaxingGibbous: string,
  Full: string,
  WaningGibbous: string,
  LastQuarter: string,
  WaningCrescent: string,
] = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];

export enum EMoonPhaseName {
  New = "New",
  WaxingCrescent = "Waxing Crescent",
  QuarterMoon = "Quarter Moon",
  WaxingGibbous = "Waxing Gibbous",
  Full = "Full",
  WaningGibbous = "Waning Gibbous",
  LastQuarter = "Last Quarter",
  WaningCrescent = "Waning Crescent",
}

const MOON_PHASE_NAMES: EMoonPhaseName[] = [
  EMoonPhaseName.New,
  EMoonPhaseName.WaxingCrescent,
  EMoonPhaseName.QuarterMoon,
  EMoonPhaseName.WaxingGibbous,
  EMoonPhaseName.Full,
  EMoonPhaseName.WaningGibbous,
  EMoonPhaseName.LastQuarter,
  EMoonPhaseName.WaningCrescent,
];

// Reference: http://individual.utoronto.ca/kalendis/lunar/#FALC
// An average synodic month takes 29 days, 12 hours, 44 minutes, 3 seconds.
const LUNAR_CYCLE = 29.5305882;
const DAYS_PER_YEAR = 365.25;
const DAYS_PER_MONTH = 30.6;
// Number of days since known new moon on `1900-01-01`.
const DAYS_SINCE_NEW_MOON_1900_01_01 = 694039.09;

interface MoonPhaseResult {
  name: EMoonPhaseName;
  phase: EMoonPhase;
  icon: string;
}

// Ported from `http://www.voidware.com/moon_phase.htm`.
export function moonPhase(
  year: number,
  month: number,
  day: number,
): MoonPhaseResult {
  if (month < 3) {
    year--;
    month += 12;
  }

  month += 1;

  let totalDaysElapsed: number =
    DAYS_PER_YEAR * year +
    DAYS_PER_MONTH * month +
    day -
    DAYS_SINCE_NEW_MOON_1900_01_01;

  totalDaysElapsed /= LUNAR_CYCLE;

  let phase: number = truncate(totalDaysElapsed);

  totalDaysElapsed -= phase;

  // Scale fraction from `0-8`.
  phase = round(totalDaysElapsed * 8);
  if (phase >= 8) phase = 0;

  if (phase >= MOON_PHASE_COUNT || phase < EMoonPhase.New)
    throw new Error(`Invalid moon phase: ${phase}`);

  return { phase, name: MOON_PHASE_NAMES[phase], icon: moonIcons[phase] };
}

export function moonPhaseFromDate(date: Date = new Date()): MoonPhaseResult {
  const year: number = date.getFullYear();
  const month: number = date.getMonth() + 1;
  const day: number = date.getDate();
  return moonPhase(year, month, day);
}

interface WeatherCodeResult {
  value: string;
  originalNumericCode: number;
  description: string;
}

export function openWeatherWMOToEmoji(
  weatherCode: number = -1,
  daylight = true,
): WeatherCodeResult {
  switch (weatherCode) {
    case 0:
      return daylight
        ? { value: "☀️", originalNumericCode: 0, description: "Clear sky" }
        : { value: "🌙", originalNumericCode: 0, description: "Clear sky" };
    case 1:
      return daylight
        ? {
            value: "🌤️",
            originalNumericCode: 1,
            description: "Mainly clear",
          }
        : {
            value: "🌤️🌙",
            originalNumericCode: 1,
            description: "Mainly clear",
          };
    case 2:
      return {
        value: "☁️",
        originalNumericCode: 2,
        description: "Partly cloudy",
      };
    case 3:
      return daylight
        ? { value: "🌥️", originalNumericCode: 3, description: "Overcast" }
        : { value: "☁️🌙", originalNumericCode: 3, description: "Overcast" };
    case 45:
      return { value: "🌫️", originalNumericCode: 45, description: "Fog" };
    case 48:
      return {
        value: "🌫️❄️",
        originalNumericCode: 48,
        description: "Depositing rime fog",
      };
    case 51:
      return {
        value: "🌧️",
        originalNumericCode: 51,
        description: "Drizzle: Light",
      };
    case 53:
      return {
        value: "🌧️",
        originalNumericCode: 53,
        description: "Drizzle: Moderate",
      };
    case 55:
      return {
        value: "🌧️",
        originalNumericCode: 55,
        description: "Drizzle: Dense intensity",
      };
    case 56:
      return {
        value: "🌨️",
        originalNumericCode: 56,
        description: "Freezing Drizzle: Light",
      };
    case 57:
      return {
        value: "🌨️",
        originalNumericCode: 57,
        description: "Freezing Drizzle: Dense intensity",
      };
    case 61:
      return {
        value: "🌦️",
        originalNumericCode: 61,
        description: "Rain: Slight",
      };
    case 63:
      return {
        value: "🌧️",
        originalNumericCode: 63,
        description: "Rain: Moderate",
      };
    case 65:
      return {
        value: "🌧️",
        originalNumericCode: 65,
        description: "Rain: Heavy intensity",
      };
    case 66:
      return {
        value: "🌧️",
        originalNumericCode: 66,
        description: "Freezing Rain: Light",
      };
    case 67:
      return {
        value: "🌧️",
        originalNumericCode: 67,
        description: "Freezing Rain: Heavy intensity",
      };
    case 71:
      return {
        value: "🌨️",
        originalNumericCode: 71,
        description: "Snow fall: Slight",
      };
    case 73:
      return {
        value: "🌨️",
        originalNumericCode: 73,
        description: "Snow fall: Moderate",
      };
    case 75:
      return {
        value: "🌨️",
        originalNumericCode: 75,
        description: "Snow fall: Heavy intensity",
      };
    case 77:
      return {
        value: "🌨️",
        originalNumericCode: 77,
        description: "Snow grains",
      };
    case 80:
      return {
        value: "🌦️",
        originalNumericCode: 80,
        description: "Rain showers: Slight",
      };
    case 81:
      return {
        value: "🌧️🌧️",
        originalNumericCode: 81,
        description: "Rain showers: Moderate",
      };
    case 82:
      return {
        value: "🌧️🌧️🌧️",
        originalNumericCode: 82,
        description: "Rain showers: Violent",
      };
    case 85:
      return {
        value: "🌨️",
        originalNumericCode: 85,
        description: "Snow showers slight",
      };
    case 86:
      return {
        value: "🌨️🌨️",
        originalNumericCode: 86,
        description: "Snow showers heavy",
      };
    case 95:
      return {
        value: "🌩️",
        originalNumericCode: 95,
        description: "Thunderstorm: Slight or moderate",
      };
    case 96:
      return {
        value: "⛈️",
        originalNumericCode: 96,
        description: "Thunderstorm with slight hail",
      };
    case 99:
      return {
        value: "⛈️🌨️",
        originalNumericCode: 99,
        description: "Thunderstorm with heavy hail",
      };
    default:
      return {
        value: "🤷‍♂️",
        originalNumericCode: -1,
        description: "Unknown weather code",
      };
  }
}
