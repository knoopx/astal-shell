import Tray from "gi://AstalTray";
import { createBinding, With, For } from "ags";

export default () => {
  const tray = Tray.get_default();
  const items = createBinding(tray, "items");

  return (
    <box class="SysTray">
      <box>
        <For each={items}>
          {(item: any) => {
            const tooltipMarkup = createBinding(item, "tooltipMarkup");
            const actionGroup = createBinding(item, "actionGroup");
            const menuModel = createBinding(item, "menuModel");
            const gicon = createBinding(item, "gicon");

            return (
              <menubutton
                tooltipMarkup={tooltipMarkup}
                usePopover={false}
                menuModel={menuModel}
                css={`
                  padding: 0;
                  margin: 0;
                  background: none;
                `}
              >
                <icon
                  gicon={gicon}
                  css={`
                    font-size: 18px;
                  `}
                />
              </menubutton>
            );
          }}
        </For>
      </box>
    </box>
  );
};
