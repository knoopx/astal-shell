import { bind } from "astal";
import { Gtk } from "astal/gtk3";

import networkSpeed from "./networkSpeed";
import NetworkRow from "./NetworkRow";

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
              <NetworkRow value={upload} icon="▲" threshold={threshold} />
              <NetworkRow value={download} icon="▼" threshold={threshold} />
            </>
          )}
        </box>
      );
    })}
  </box>
);
