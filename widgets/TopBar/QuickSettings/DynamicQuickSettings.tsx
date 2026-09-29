import type { QuickSettingsEntry } from "../../../support/quickSettings";
import { Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import { getQuickSettings } from "../../../support/quickSettings";
import { confirm } from "../../../support/confirm";
import ActionButton from "./ActionButton";

export default function DynamicQuickSettings() {
  const entries = getQuickSettings();

  return (
    <box
      spacing={16}
      valign={Gtk.Align.CENTER}
      css={`
        margin-left: 8px;
        margin-right: 8px;
      `}
    >
      {entries.map((entry: QuickSettingsEntry) => (
        <ActionButton
          icon={entry.icon}
          tooltipText={entry.label}
          onClicked={() => {
            const handler = () =>
              execAsync(
                Array.isArray(entry.command)
                  ? entry.command
                  : entry.command.split(" "),
              );
            if (entry.confirm) confirm(handler);
            else handler();
          }}
        />
      ))}
    </box>
  );
}
