type ActionButtonProps = {
  icon: string;
  tooltipText: string;
  onClicked: () => void;
};

export default function ActionButton({
  icon,
  tooltipText,
  onClicked,
}: ActionButtonProps) {
  const css = `
    padding: 0;
    margin: 0;
    border-radius: 100%;
    min-width: 24px;
    min-height: 24px;
    background-color: rgba(255, 255, 255, 0.12);
  `;
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
