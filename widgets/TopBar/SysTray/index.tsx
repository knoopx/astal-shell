import Tray from "gi://AstalTray";
import { createBinding, For } from "ags";

export default () => {
  const tray = Tray.get_default();
  const items = createBinding(tray, "items");

  return (
    <box class="SysTray" spacing={8}>
      <For each={items}>
        {(item: any) => {
          const tooltipMarkup = createBinding(item, "tooltipMarkup");
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
  );
};
