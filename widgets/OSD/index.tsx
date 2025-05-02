import { App, Astal, Gdk, Gtk } from "astal/gtk3";
import { timeout } from "astal/time";
import Variable from "astal/variable";
import Wp from "gi://AstalWp";

const OnScreenProgress = ({ visible }) => {
  const speaker = Wp.get_default()!.get_default_speaker();
  const iconName = Variable("");
  const value = Variable(0);
  let count = 0;

  function show(v: number, icon: string) {
    visible.set(true);
    value.set(v);
    iconName.set(icon);
    count++;
    timeout(1000, () => {
      count--;
      if (count === 0) visible.set(false);
    });
  }

  return (
    <box
      setup={(self) => {
        self.hook(speaker, "notify::volume", () => {
          show(speaker.volume, speaker.volumeIcon);
        });
      }}
      spacing={16}
      halign={Gtk.Align.CENTER}
      valign={Gtk.Align.CENTER}
      css={`
        font-size: 1.5em;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 2em;
        padding-top: 1em;
        padding-bottom: 1em;
        padding-left: 1em;
        padding-right: 2em;
      `}
    >
      <icon icon={iconName()} />
      <levelbar
        css={`
          min-height: 0.5em;
          border-radius: 0.5em;
        `}
        valign={Gtk.Align.CENTER}
        widthRequest={176}
        value={value()}
      />
    </box>
  );
};

export default function OSD({ monitor }: { monitor: Gdk.Monitor }) {
  const visible = Variable(false);

  return (
    <window
      name="osd"
      namespace="osd"
      visible={visible()}
      setup={(self) => {
        self.clickThrough = true;
      }}
      css={`
        background: none;
      `}
      monitor={monitor}
      application={App}
      layer={Astal.Layer.OVERLAY}
      keymode={Astal.Keymode.ON_DEMAND}
      halign={Gtk.Align.CENTER}
      valign={Gtk.Align.CENTER}
    >
      <OnScreenProgress visible={visible} />
    </window>
  );
}
