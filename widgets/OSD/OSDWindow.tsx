import { Gtk, Astal } from "ags/gtk4";
import app from "ags/gtk4/app";
import { timeout } from "ags/time";
import { createState, onCleanup } from "ags";
import { getCurrentTheme } from "../../support/theme";

interface OSDConfig {
  name: string;
  monitor: number;
  getIcon: () => string;
  getValue: () => number;
  connect: (callback: () => void) => number;
  disconnect: (id: number) => void;
}

function parseRgba(rgba: string): [number, number, number, number] {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return [1, 1, 1, 1];
  return [
    Number(match[1]) / 255,
    Number(match[2]) / 255,
    Number(match[3]) / 255,
    match[4] !== undefined ? Number(match[4]) : 1,
  ];
}

function VerticalBar({ value }: { value: ReturnType<typeof createState<number>>[0] }) {
  let currentValue = 0;
  let area: Gtk.DrawingArea;
  const theme = getCurrentTheme();

  return (
    <drawingarea
      widthRequest={12}
      heightRequest={100}
      halign={Gtk.Align.CENTER}
      $={(self: Gtk.DrawingArea) => {
        area = self;
        self.set_draw_func((_area, cr, width, height) => {
          const radius = width / 2;

          cr.setSourceRGBA(1, 1, 1, 0.12);
          cr.newPath();
          cr.arc(width / 2, radius, radius, Math.PI, 0);
          cr.arc(width / 2, height - radius, radius, 0, Math.PI);
          cr.closePath();
          cr.fill();

          const fill = Math.max(0, Math.min(1, currentValue));
          const fillHeight = Math.max(0, Math.round(fill * height));
          if (fillHeight === 0) return;

          const [red, green, blue, alpha] = parseRgba(theme.status.success);
          const y = height - fillHeight;
          const topRadius = Math.min(radius, fillHeight / 2);
          const bottomRadius = radius;

          cr.setSourceRGBA(red, green, blue, alpha);
          cr.newPath();
          cr.arc(width / 2, y + topRadius, topRadius, Math.PI, 0);
          cr.arc(width / 2, height - bottomRadius, bottomRadius, 0, Math.PI);
          cr.closePath();
          cr.fill();
        });
      }}
      css={value((next) => {
        currentValue = next;
        area?.queue_draw();
        return "";
      }) as unknown as string}
    />
  );
}

export default function OSDWindow({
  name,
  monitor,
  getIcon,
  getValue,
  connect,
  disconnect,
}: OSDConfig) {
  const [visible, setVisible] = createState(false);
  const [iconName, setIconName] = createState(getIcon());
  const [value, setValue] = createState(getValue());
  let count = 0;

  function show() {
    setVisible(true);
    setValue(getValue());
    setIconName(getIcon());
    count++;
    timeout(1000, () => {
      count--;
      if (count === 0) setVisible(false);
    });
  }

  const connectionId = connect(show);

  onCleanup(() => {
    disconnect(connectionId);
  });

  const theme = getCurrentTheme();
  const { RIGHT } = Astal.WindowAnchor;

  return (
    <window
      name={name}
      namespace={name}
      application={app}
      visible={visible}
      css={`
        background: none;
        margin: 1em;
      `}
      monitor={monitor}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={RIGHT}
      keymode={Astal.Keymode.NONE}
      halign={Gtk.Align.END}
      valign={Gtk.Align.CENTER}
    >
      <box
        spacing={16}
        halign={Gtk.Align.END}
        valign={Gtk.Align.CENTER}
        orientation={Gtk.Orientation.VERTICAL}
        css={`
          font-size: ${theme.font.size.large};
          background-color: ${theme.background.primary};
          border-radius: ${theme.borderRadius.large};
          padding: 0.8em;
          margin: 2em;
          padding-top: 1em;
        `}
      >
        <VerticalBar value={value} />
        <image iconName={iconName} pixelSize={24} />
      </box>
    </window>
  );
}
