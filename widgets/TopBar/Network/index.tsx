import { bind } from "astal";
import { Gtk } from "astal/gtk3";

import networkSpeed from "./networkSpeed";
import { format } from "../../../support/util";

export default () => (
  <box>
    {bind(networkSpeed).as(({ download, upload }) => {
      const threshold = 1024; // 1 KB/s threshold
      const showNetworkData = download >= threshold || upload >= threshold;

      return (
        <box
          widthRequest={90}
          vertical
          valign={Gtk.Align.CENTER}
          css={`
            font-size: 0.6em;
            opacity: 0.8;
          `}
        >
          {showNetworkData && (
            <>
              <label
                halign={Gtk.Align.END}
                label={format(upload) + "/s ▲"}
                css="color: @theme_selected_bg_color;"
              />
              <label
                halign={Gtk.Align.END}
                label={format(download) + "/s ▼"}
                css="color: @theme_selected_bg_color;"
              />
            </>
          )}
        </box>
      );
    })}
  </box>
);
