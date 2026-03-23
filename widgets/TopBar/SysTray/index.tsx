import Tray from "gi://AstalTray";
import { createBinding, For } from "ags";

export default () => {
  const tray = Tray.get_default();
  const items = createBinding(tray, "items");

  return (
    <box cssClasses={["SysTray"]} spacing={8}>
      <For each={items}>
        {(item: Tray.TrayItem) => {
          const tooltipMarkup = createBinding(item, "tooltipMarkup");
          const menuModel = createBinding(item, "menuModel");
          const gicon = createBinding(item, "gicon");

          return (
            <menubutton
              tooltipMarkup={tooltipMarkup}
              menuModel={menuModel}
              css={`
                padding: 0;
                margin: 0;
                background: none;
              `}
              $={(self: import("gi://Gtk?version=4.0").default.MenuButton) => {
                self.insert_action_group("dbusmenu", item.actionGroup);
                item.connect("notify::action-group", () => {
                  self.insert_action_group("dbusmenu", item.actionGroup);
                });
              }}
            >
              <image
                gicon={gicon}
                pixelSize={18}
              />
            </menubutton>
          );
        }}
      </For>
    </box>
  );
};
