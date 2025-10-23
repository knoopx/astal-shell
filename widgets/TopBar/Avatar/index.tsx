import { Gtk } from "ags/gtk3";
import GLib from "gi://GLib";
import { getCurrentTheme } from "../../../support/theme";

export default ({ onToggle }: { onToggle: () => void }) => {
  return (
    <button
      css={`
        padding: 0;
        background: transparent;
        margin-left: 8px;
      `}
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
      onClicked={onToggle}
    >
      <box
        css={`
          border-radius: 100%;
          border: 2px solid ${getCurrentTheme().accent.border};
        `}
      >
        <box
          css={`
            min-width: 32px;
            min-height: 32px;
            background-image: url("${GLib.getenv("HOME")}/.face");
            background-size: cover;
            background-position: center;
            border-radius: 100%;
          `}
        />
      </box>
    </button>
  );
};