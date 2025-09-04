import { getCurrentTheme } from "../../../support/theme";

type ActionButtonProps = {
  icon: string;
  tooltipText: string;
  onClicked: () => void;
  css?: string;
};

export default function ActionButton({
  icon,
  tooltipText,
  onClicked,
  css: additionalCss = "",
}: ActionButtonProps) {
  const theme = getCurrentTheme();
  const baseCss = `
    padding: 0;
    margin: 0;
    border-radius: ${theme.borderRadius.large};
    min-width: 24px;
    min-height: 24px;
    background-color: ${theme.background.secondary};
  `;
  const css = additionalCss ? `${baseCss}${additionalCss}` : baseCss;

  return (
    <button
      vexpand={false}
      hexpand={false}
      css={css}
      onClicked={onClicked}
      tooltipText={tooltipText}
    >
      <icon icon={icon} />
    </button>
  );
}
