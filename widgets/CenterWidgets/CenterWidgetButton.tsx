import { subprocess } from "ags/process";
import { Gtk } from "ags/gtk4";
import niri from "../../support/niri";

export default function CenterWidgetButton({
  app,
  css = "",
  children,
}: {
  app?: string;
  css?: string;
  children: JSX.Element;
}) {
  return (
    <button
      css={`background: transparent; margin: 0; padding: 0; ${css}`}
      halign={Gtk.Align.CENTER}
      onClicked={() => {
        niri.toggleOverview();
        if (app) subprocess(app);
      }}
    >
      {children}
    </button>
  );
}