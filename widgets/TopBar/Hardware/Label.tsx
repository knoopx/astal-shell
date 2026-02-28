type LabelProps = {
  label: string;
  [key: string]: any;
};

export default ({ label, ...rest }: LabelProps) => (
  <label
    {...rest}
    label={label}
    angle={90.0}
    css={`
      font-size: 0.5em;
      font-weight: bold;
    `}
  />
);
