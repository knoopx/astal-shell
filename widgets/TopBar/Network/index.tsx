import { bind } from "astal";
import { Gtk } from "astal/gtk3";

import networkSpeed from "./networkSpeed";
import { format } from "../../../support/util";

export default () => (
  <box>
    {bind(networkSpeed).as(({ download, upload }) => (
      <box
        widthRequest={90}
        vertical
        valign={Gtk.Align.CENTER}
        css={`
          font-size: 0.6em;
          opacity: 0.8;
        `}
      >
        <label halign={Gtk.Align.END} label={format(upload) + "/s ▲"} />
        <label halign={Gtk.Align.END} label={format(download) + "/s ▼"} />
      </box>
    ))}
  </box>
);
