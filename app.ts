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
    for (const monitor in App.get_monitors()) {
      Bar({ monitor });
      OSD({ monitor });
      Dock({ monitor });
    }
  },
});
