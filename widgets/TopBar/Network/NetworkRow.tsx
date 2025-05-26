import { Gtk } from "astal/gtk3";

interface NetworkRowProps {
  value: number;
  icon: string;
  threshold: number;
  color?: string;
}

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes < 0) return { value: "0", unit: "B" };
  if (bytes === 0) return { value: "0", unit: "B" };

  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.max(
    0,
    Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  );
  const value = bytes / Math.pow(1024, i);
  return {
    value: Math.round(value).toString(),
    // value: parseFloat(value.toFixed(2)).toString(),
    unit: sizes[i],
  };
};

export default ({ value, icon, threshold, color }: NetworkRowProps) => {
  const { value: formattedValue, unit } = formatBytes(value);

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
        css={value >= threshold && color ? `color: ${color};` : ""}
      />
    </box>
  );
};
