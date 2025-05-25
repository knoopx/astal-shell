import { App, Astal } from "astal/gtk3";
import { bind } from "astal";
import niri from "../../support/niri";
import AstalApps from "gi://AstalApps";

export default ({ monitor }: { monitor: number }) => {
  const { BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;
  const apps = new AstalApps.Apps();

  // Helper function to get application icon
  const getAppIcon = (appId: string): string => {
    if (!appId) return "application-x-executable";

    // Try to find the application by exact match on entry (desktop file name)
    let app = apps.list.find(
      (a) => a.entry === appId || a.entry === `${appId}.desktop`
    );

    // If not found, try to find by wmClass
    if (!app) {
      app = apps.list.find(
        (a) => a.wmClass?.toLowerCase() === appId.toLowerCase()
      );
    }

    // If still not found, try fuzzy search
    if (!app) {
      const results = apps.fuzzy_query(appId);
      app = results[0]; // Take the best match
    }

    return app?.iconName || "application-x-executable";
  };

  const CenterModules = (
    <box className="app-icons" spacing={8}>
      {bind(niri, "workspaces").as((workspaces) => {
        const currentWorkspace = workspaces.find((ws) => ws.is_active);
        if (!currentWorkspace) return [];

        return currentWorkspace.windows.map((window) => {
          return (
            <button
              className={`app-icon ${
                window.is_focused ? "focused" : "unfocused"
              }`}
              css={`
                min-width: 32px;
                min-height: 32px;
                border-radius: 4px;
                padding: 4px;
                background-color: transparent;
                border: none;
                opacity: ${window.is_focused ? 1.0 : 0.6};
                transition: all 0.2s ease-in-out;
              `}
              // background-color: ${window.is_focused ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
              // border: ${window.is_focused ? '2px solid rgba(255, 255, 255, 0.3)' : '2px solid transparent'};

              tooltip_text={window.title || window.app_id}
              onClicked={() => {
                niri.focusWindow(window.id);
              }}
              onButtonPressEvent={(self, event) => {
                if (event.get_button()[1] === 3) {
                  niri.closeWindow(window.id);
                  return true;
                }
                return false;
              }}
              child={
                window.app_id ? (
                  <icon
                    icon={getAppIcon(window.app_id)}
                    css={`
                      font-size: 48px;
                      color: ${window.is_focused
                        ? "rgba(255, 255, 255, 1.0)"
                        : "rgba(255, 255, 255, 0.7)"};
                      transition: color 0.2s ease-in-out;
                    `}
                  />
                ) : (
                  <label
                    label="?"
                    css={`
                      font-size: 16px;
                      color: ${window.is_focused ? "#fff" : "#888"};
                      transition: color 0.2s ease-in-out;
                    `}
                  />
                )
              }
            />
          );
        });
      })}
    </box>
  );

  const win = (
    <window
      name="bottom-bar"
      monitor={monitor}
      visible={false}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={BOTTOM | LEFT | RIGHT}
      marginBottom={96}
      marginLeft={300}
      marginRight={300}
      application={App}
      css={`
        background: transparent;
      `}
      child={<centerbox center_widget={CenterModules} />}
    />
  );

  niri.overviewIsOpen.subscribe((v) => {
    if (v) {
      setTimeout(() => {
        win.set_visible(true);
      }, 100);
    } else {
      win.set_visible(false);
    }
  });

  return win;
};
