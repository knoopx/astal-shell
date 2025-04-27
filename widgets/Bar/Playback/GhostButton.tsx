export default ({ css, ...props }) => {
  return <button {...props} css={`background: none; ${css ?? ""}`} />;
};
