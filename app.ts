import { App } from "astal/gtk3";
import Bar from "./widgets/Bar";
import OSD from "./widgets/OSD";
import Launcher from "./widgets/Launcher";
import Dock from "./widgets/Dock";

App.start({
  css: `
    levelbar .filled {
      border-radius: 2px;
      background-clip: padding-box;
      background-color: @theme_selected_bg_color;
    }
    `,
  main() {
    Launcher();
    App.get_monitors().map(Bar);
    App.get_monitors().map(OSD);
    App.get_monitors().map(Dock);
  },
});
