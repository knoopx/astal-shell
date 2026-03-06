interface Binding<T> {
  as<U>(fn: (v: T) => U): Binding<U>;
}

type MeterProps = {
  value: Binding<number>;
  invert?: boolean;
  [key: string]: unknown;
};

const levelClass = (value: number, invert: boolean) => {
  if (invert) {
    if (value > 0.75) return "low";
    if (value > 0.25) return "medium";
    return "high";
  }
  if (value > 0.75) return "high";
  if (value > 0.25) return "medium";
  return "low";
};

export default ({ invert = false, value, ...levelbarProps }: MeterProps) => (
  <levelbar
    class={value.as((v: number) => levelClass(v, invert))}
    value={value}
    {...levelbarProps}
    vertical
    inverted
    heightRequest={24}
    widthRequest={8}
    css={`
      border-radius: 2px;
    `}
  />
);
