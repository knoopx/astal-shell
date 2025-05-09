import { Astal, Gdk, Gtk, Widget } from "astal/gtk3";

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;

type PopoverProps = Widget.WindowProps & {
  onClose?(self: Widget.Window): void;
};

export default ({
  child,
  marginBottom,
  marginTop,
  marginLeft,
  marginRight,
  halign = Gtk.Align.CENTER,
  valign = Gtk.Align.CENTER,
  onClose,
  ...props
}: PopoverProps) => {
  return (
    <window
      {...props}
      css="background-color: transparent"
      anchor={TOP | LEFT | BOTTOM | RIGHT}
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={Astal.Keymode.NONE}
      onNotifyVisible={(self) => {
        if (!self.visible) onClose?.(self);
      }}
      onButtonPressEvent={(self, event) => {
        const [, _x, _y] = event.get_coords();
        const { x, y, width, height } = self.get_child()!.get_allocation();

        const xOut = _x < x || _x > x + width;
        const yOut = _y < y || _y > y + height;

        if (xOut || yOut) {
          self.visible = false;
        }
      }}
      onKeyPressEvent={(self, event: Gdk.Event) => {
        if (event.get_keyval()[1] === Gdk.KEY_Escape) {
          self.visible = false;
        }
      }}
    >
      <box
        onButtonPressEvent={() => true}
        expand
        halign={halign}
        valign={valign}
        marginBottom={marginBottom}
        marginTop={marginTop}
        marginStart={marginLeft}
        marginEnd={marginRight}
        css={`
          background-color: @theme_bg_color;
          box-shadow: 2px 3px 7px 0 rgba(0, 0, 0, 0.4);
          border-radius: 12px;
          padding: 12px;
        `}
      >
        {child}
      </box>
    </window>
  );
};
