const levelClass = (value, invert = false) => {
  if (invert) {
    if (value > 0.75) {
      return "low";
    }
    if (value > 0.25) {
      return "medium";
    }
    return "high";
  } else {
    if (value > 0.75) {
      return "high";
    }
    if (value > 0.25) {
      return "medium";
    }
    return "low";
  }
};

export const Meter = (props) => (
  <levelbar
    className={levelClass(props.value, props.invert)}
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
