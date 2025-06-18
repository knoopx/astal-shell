import { App, Astal, Gtk } from "astal/gtk3";
import { timeout } from "astal/time";
import Variable from "astal/variable";
import Brightness from "../../support/brightness";

const BrightnessProgress = ({ visible }) => {
  const brightness = Brightness.get_default();
  const iconName = Variable("");
  const value = Variable(0);
  let count = 0;

  function show(v: number) {
    visible.set(true);
    value.set(v);
    iconName.set("display-brightness-symbolic");
    count++;
    timeout(1000, () => {
      count--;
      if (count === 0) visible.set(false);
    });
  }

  return (
    <box
      setup={(self) => {
        self.hook(brightness, "notify::screen", () => {
          show(brightness.screen);
        });
      }}
      spacing={16}
      halign={Gtk.Align.END}
      valign={Gtk.Align.CENTER}
      vertical={true}
      css={`
        font-size: 1.5em;
        background-color: rgba(0, 0, 0, 0.8);
        border-radius: 9999;
        padding: 0.8em;
        margin: 2em;
        padding-top: 1em;
      `}
    >
      <levelbar
        css={`
          min-width: 0.7em;
          border-radius: 0.7em;
        `}
        halign={Gtk.Align.CENTER}
        heightRequest={100}
        value={value()}
        vertical={true}
        inverted={true}
      />
      <icon
        icon={iconName()}
        setup={(self) => {
          self.hook(iconName, () => {
            self.icon = iconName.get();
          });
        }}
      />
    </box>
  );
};

export default function BrightnessOSD({ monitor }: { monitor: number }) {
  const visible = Variable(false);
  const { RIGHT } = Astal.WindowAnchor;

  return (
    <window
      name="brightness-osd"
      namespace="brightness-osd"
      visible={visible()}
      reactive={false}
      css={`
        background: none;
        margin: 1em;
      `}
      monitor={monitor}
      application={App}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={RIGHT}
      keymode={Astal.Keymode.NONE}
      halign={Gtk.Align.END}
      valign={Gtk.Align.CENTER}
    >
      <BrightnessProgress visible={visible} />
    </window>
  );
}
