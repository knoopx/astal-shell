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

export default ({
  invert = false,
  value,
  ...levelbarProps
}: {
  value: { as<U>(fn: (v: number) => U): unknown };
  invert?: boolean;
  [key: string]: unknown;
}) => (
  <levelbar
    class={value.as((v: number) => levelClass(v, invert)) as string}
    value={value as unknown as number}
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
