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

interface WeatherCodeDefinition {
  daytime?: string;
  nighttime?: string;
  value: string;
  description: string;
}

const WEATHER_CODES: Record<number, WeatherCodeDefinition> = {
  // Clear sky
  0: {
    daytime: "☀️",
    nighttime: "🌙",
    value: "☀️",
    description: "Clear sky",
  },
  // Mainly clear
  1: {
    daytime: "🌤️",
    nighttime: "🌤️🌙",
    value: "🌤️",
    description: "Mainly clear",
  },
  // Partly cloudy
  2: {
    value: "☁️",
    description: "Partly cloudy",
  },
  // Overcast
  3: {
    daytime: "🌥️",
    nighttime: "☁️🌙",
    value: "🌥️",
    description: "Overcast",
  },
  // Fog
  45: {
    value: "🌫️",
    description: "Fog",
  },
  48: {
    value: "🌫️❄️",
    description: "Depositing rime fog",
  },
  // Drizzle
  51: {
    value: "🌧️",
    description: "Drizzle: Light",
  },
  53: {
    value: "🌧️",
    description: "Drizzle: Moderate",
  },
  55: {
    value: "🌧️",
    description: "Drizzle: Dense intensity",
  },
  // Freezing Drizzle
  56: {
    value: "🌨️",
    description: "Freezing Drizzle: Light",
  },
  57: {
    value: "🌨️",
    description: "Freezing Drizzle: Dense intensity",
  },
  // Rain
  61: {
    value: "🌦️",
    description: "Rain: Slight",
  },
  63: {
    value: "🌧️",
    description: "Rain: Moderate",
  },
  65: {
    value: "🌧️",
    description: "Rain: Heavy intensity",
  },
  // Freezing Rain
  66: {
    value: "🌧️",
    description: "Freezing Rain: Light",
  },
  67: {
    value: "🌧️",
    description: "Freezing Rain: Heavy intensity",
  },
  // Snow fall
  71: {
    value: "🌨️",
    description: "Snow fall: Slight",
  },
  73: {
    value: "🌨️",
    description: "Snow fall: Moderate",
  },
  75: {
    value: "🌨️",
    description: "Snow fall: Heavy intensity",
  },
  77: {
    value: "🌨️",
    description: "Snow grains",
  },
  // Rain showers
  80: {
    value: "🌦️",
    description: "Rain showers: Slight",
  },
  81: {
    value: "🌧️🌧️",
    description: "Rain showers: Moderate",
  },
  82: {
    value: "🌧️🌧️🌧️",
    description: "Rain showers: Violent",
  },
  // Snow showers
  85: {
    value: "🌨️",
    description: "Snow showers slight",
  },
  86: {
    value: "🌨️🌨️",
    description: "Snow showers heavy",
  },
  // Thunderstorm
  95: {
    value: "🌩️",
    description: "Thunderstorm: Slight or moderate",
  },
  96: {
    value: "⛈️",
    description: "Thunderstorm with slight hail",
  },
  99: {
    value: "⛈️🌨️",
    description: "Thunderstorm with heavy hail",
  },
};

function getWeatherEmoji(code: number, daylight: boolean): string {
  const definition = WEATHER_CODES[code];
  if (!definition) return "🤷‍♂️";

  if (daylight && definition.daytime) return definition.daytime;
  if (!daylight && definition.nighttime) return definition.nighttime;
  return definition.value;
}

export function openWeatherWMOToEmoji(
  weatherCode: number = -1,
  daylight = true,
): WeatherCodeResult {
  const definition = WEATHER_CODES[weatherCode];

  if (!definition) {
    return {
      value: "🤷‍♂️",
      originalNumericCode: -1,
      description: "Unknown weather code",
    };
  }

  return {
    value: getWeatherEmoji(weatherCode, daylight),
    originalNumericCode: weatherCode,
    description: definition.description,
  };
}
