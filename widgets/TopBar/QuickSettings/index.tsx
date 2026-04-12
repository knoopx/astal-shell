import Volume from "./Volume";
import ShutdownButton from "./ShutdownButton";
import RebootButton from "./RebootButton";
import LogoutButton from "./LogoutButton";
import { Gtk } from "ags/gtk4";

export default () => (
  <box
    css={`
      margin-left: 8px;
    `}
    spacing={8}
    valign={Gtk.Align.CENTER}
  >
    <Volume />
    <box spacing={4} valign={Gtk.Align.CENTER}>
      <ShutdownButton />
      <RebootButton />
      <LogoutButton />
    </box>
  </box>
);
