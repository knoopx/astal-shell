import { Gtk } from "astal/gtk3";
import { format } from "../../../support/util";

interface NetworkRowProps {
  value: number;
  icon: string;
  threshold: number;
}

export default ({ value, icon, threshold }: NetworkRowProps) => (
  <box halign={Gtk.Align.END}>
    <label
      label={format(value).padStart(7) + "/s "}
      css="font-family: monospace;"
    />
    <label
      label={icon}
      css={value >= threshold ? "color: @theme_selected_bg_color;" : ""}
    />
  </box>
);
