import { Gtk } from "ags/gtk3";
import { blinkState } from "./networkSpeed";
import { formatBytes } from "../../../support/formatBytes";

interface NetworkRowProps {
  value: number;
  icon: string;
  threshold: number;
  color?: string;
}

export default ({ value, icon, threshold, color }: NetworkRowProps) => {
  const { value: formattedValue, unit } = formatBytes(value);
  const isActive = value >= threshold;

  return (
    <box halign={Gtk.Align.END}>
      <label label={formattedValue} />
      <box css="margin-left: 0.4em; min-width: 3em;" halign={Gtk.Align.START}>
        {[
          <label
            label={unit + "/s"}
            halign={Gtk.Align.START}
            justify={Gtk.Justification.LEFT}
          />,
        ]}
      </box>
      <label
        label={icon}
        css={blinkState((blink) =>
          isActive && color
            ? `color: ${color}; opacity: ${blink ? "1" : "0.3"};`
            : "",
        )}
      />
    </box>
  );
};
