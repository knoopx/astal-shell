import type { Binding } from "ags";
import type GObject from "gi://GObject";

interface IconProps {
  name?: string | Binding<string>;
  gicon?: GObject.Icon | Binding<GObject.Icon>;
  size?: number;
  css?: string;
  cssClasses?: string[];
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
      iconName={name as string | Binding<string> | undefined}
      gicon={gicon as GObject.Icon | Binding<GObject.Icon> | undefined}
      pixelSize={size}
      css={css}
      cssClasses={cssClasses}
    />
  );
}
