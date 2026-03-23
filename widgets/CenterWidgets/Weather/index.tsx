import { createState, onCleanup } from "ags";
import { execAsync, subprocess } from "ags/process";
import { Gtk } from "ags/gtk4";
import niri from "../../../support/niri";
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
      const weatherRes = await execAsync(
        `curl https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,is_day,weather_code&models=gem_seamless`,
      );
      const weatherData = JSON.parse(weatherRes);
      const emoji = weatherData.current.is_day
        ? openWeatherWMOToEmoji(weatherData.current.weather_code).value
        : moonPhaseFromDate().icon;

      setWeather(
        () => `${emoji} ${Math.round(weatherData.current.temperature_2m)}°C`,
      );
    } catch (e) {
      console.warn("Failed to update weather:", e);
    }
  };

  const interval = setInterval(updateWeather, 300e3);
  updateWeather();

  onCleanup(() => clearInterval(interval));

  const theme = getCurrentTheme();
  return (
    <button
      css="background: transparent; margin: 0; padding: 0; margin-top: -8px;"
      halign={Gtk.Align.CENTER}
      onClicked={() => {
        niri.toggleOverview();
        subprocess("gnome-weather");
      }}
    >
      <label
        css={`
          font-size: ${theme.font.size.small};
          font-weight: ${theme.font.weight.normal};
          opacity: ${theme.opacity.medium};
        `}
        halign={Gtk.Align.CENTER}
        label={weather}
      />
    </button>
  );
};
