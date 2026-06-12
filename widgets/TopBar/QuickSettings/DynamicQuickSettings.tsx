import type { QuickSettingsEntry } from "../../../support/quickSettings";
import { Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import { getQuickSettings } from "../../../support/quickSettings";
import { confirm } from "../../../support/confirm";
import ActionButton from "./ActionButton";

export default function DynamicQuickSettings() {
  const entries = getQuickSettings();

  return (
    <box spacing={4} valign={Gtk.Align.CENTER}>
      {entries.map((entry: QuickSettingsEntry) => (
        <ActionButton
          key={entry.id}
          icon={entry.icon}
          tooltipText={entry.label}
          onClicked={() => {
            const handler = () =>
              execAsync(Array.isArray(entry.command)
                ? entry.command
                : entry.command.split(" "));
            entry.confirm ? confirm(handler) : handler();
          }}
        />
      ))}
    </box>
  );
}
