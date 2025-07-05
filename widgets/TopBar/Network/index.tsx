import { With } from "ags";
import { Gtk } from "ags/gtk3";

import networkSpeed from "./networkSpeed";
import NetworkRow from "./NetworkRow";

export default () => {
  return (
    <box>
      <With value={networkSpeed}>
        {({ download, upload }) => {
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
                <box vertical>
                  <NetworkRow
                    value={upload}
                    icon="▲"
                    threshold={threshold}
                    color="@error_color"
                  />
                  <NetworkRow
                    value={download}
                    icon="▼"
                    threshold={threshold}
                    color="@success_color"
                  />
                </box>
              )}
            </box>
          );
        }}
      </With>
    </box>
  );
};
