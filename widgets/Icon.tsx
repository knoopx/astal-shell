import type { Accessor } from "ags";
import type Gio from "gi://Gio";

interface IconProps {
  name?: string | Accessor<string>;
  gicon?: Gio.Icon | Accessor<Gio.Icon>;
  size?: number;
  css?: string | Accessor<string>;
  cssClasses?: string[] | Accessor<string[]>;
}

export default function Icon({
  name,
  gicon,
  size = 16,
  css,
  cssClasses,
}: IconProps) {
  return (
    <image
      $type="icon"
      iconName={name}
      gicon={gicon}
      pixelSize={size}
      css={css}
      cssClasses={cssClasses}
    />
  );
}
