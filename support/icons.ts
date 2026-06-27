import AstalApps from "gi://AstalApps";

const DEFAULT_APP_ICON = "application-x-executable";

// Singleton AstalApps instance shared across all widgets
const apps = new AstalApps.Apps();

/**
 * Resolve an icon name for a given app ID using AstalApps.
 * Falls back to the default app icon if not found.
 */
export function getAppIcon(appId: string): string {
  if (!appId) return DEFAULT_APP_ICON;

  let app = apps.list.find(
    (a) => a.entry === appId || a.entry === `${appId}.desktop`,
  );

  if (!app) {
    app = apps.list.find(
      (a) => a.wmClass?.toLowerCase() === appId.toLowerCase(),
    );
  }

  if (!app) {
    const results = apps.fuzzy_query(appId);
    app = results[0];
  }

  return app?.iconName || DEFAULT_APP_ICON;
}

export { DEFAULT_APP_ICON };
