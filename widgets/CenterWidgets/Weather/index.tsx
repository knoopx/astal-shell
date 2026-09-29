import { createState, onCleanup } from "ags";
import { execAsync } from "ags/process";
import { Gtk } from "ags/gtk4";
import CenterWidgetButton from "../CenterWidgetButton";
import { getCurrentTheme } from "../../../support/theme";
import {
  moonPhaseFromDate,
  openWeatherWMOToEmoji,
} from "../../../support/weather";

export default () => {
  const [weather, setWeather] = createState<string>("");

  const updateWeather = async () => {
    try {
      const res = await execAsync(
        'curl "http://ip-api.com/json?fields=lat,lon"',
      );
      const loc = JSON.parse(res);
      if (typeof loc?.lat !== "number" || typeof loc?.lon !== "number") {
        console.warn("Weather geolocation failed:", loc);
        return;
      }
      const weatherRes = await execAsync(
        `curl https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,is_day,weather_code&models=gem_seamless`,
      );
      const weatherData = JSON.parse(weatherRes);
      // API errors, rate limits, and network failures all yield responses
      // without a `current` block; keep the previous value in that case.
      const current = weatherData?.current;
      if (
        !current ||
        typeof current.temperature_2m !== "number" ||
        typeof current.weather_code !== "number" ||
        typeof current.is_day !== "number"
      ) {
        console.warn("Weather response missing current data:", weatherData);
        return;
      }

      const emoji = current.is_day
        ? openWeatherWMOToEmoji(current.weather_code).value
        : moonPhaseFromDate().icon;

      setWeather(() => `${emoji} ${Math.round(current.temperature_2m)}°C`);
    } catch (e) {
      console.warn("Failed to update weather:", e);
    }
  };

  const interval = setInterval(updateWeather, 300e3);
  updateWeather();

  onCleanup(() => clearInterval(interval));

  const theme = getCurrentTheme();
  return (
    <CenterWidgetButton app="gnome-weather" css="margin-top: -8px;">
      <label
        css={`
          font-size: ${theme.font.size.small};
          font-weight: ${theme.font.weight.normal};
          opacity: ${theme.opacity.medium};
        `}
        halign={Gtk.Align.CENTER}
        label={weather}
      />
    </CenterWidgetButton>
  );
};
