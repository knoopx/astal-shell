import { bind } from "astal";
import { Gtk } from "astal/gtk3";

import networkSpeed from "./networkSpeed";
import { format } from "../../../support/util";

export default () => (
  <box>
    {bind(networkSpeed).as(({ download, upload }) => (
      <box
        widthRequest={80}
        vertical
        valign={Gtk.Align.CENTER}
        css={`
          font-size: 0.7em;
          font-weight: bold;
        `}
      >
        <label halign={Gtk.Align.END} label={format(upload) + "/s ▲"} />
        <label halign={Gtk.Align.END} label={format(download) + "/s ▼"} />
      </box>
    ))}
  </box>
);
