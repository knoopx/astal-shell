const levelClass = (value) => {
  if (value > 0.75) {
    return "high";
  }
  if (value > 0.25) {
    return "medium";
  }
  return "low";
};

export const Meter = (props) => (
  <levelbar
    className={levelClass(props.value)}
    {...props}
    vertical
    inverted
    heightRequest={24}
    css={`
      border-radius: 2px;
    `}
  />
);

export default Meter;
