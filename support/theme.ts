import GLib from "gi://GLib";
import { readJSONFile, writeJSONFile } from "./util";

export interface Theme {
  // Colors
  background: {
    primary: string;
    secondary: string;
  };
  text: {
    primary: string;
    secondary: string;
    focused: string;
    unfocused: string;
  };
  accent: {
    primary: string;
    secondary: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
  };

  // Opacity values
  opacity: {
    high: number;
    medium: number;
    low: number;
  };

  // Font styles
  font: {
    size: {
      small: string;
      normal: string;
      large: string;
    };
    weight: {
      normal: string;
      bold: string;
    };
  };

  // Spacing
  spacing: {
    small: string;
    medium: string;
    large: string;
  };

  // Border radius
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
}

export const defaultTheme: Theme = {
  background: {
    primary: "rgba(0, 0, 0, 0.8)",
    secondary: "rgba(255, 255, 255, 0.12)",
  },
  text: {
    primary: "rgba(255, 255, 255, 1.0)",
    secondary: "rgba(255, 255, 255, 0.7)",
    focused: "rgba(255, 255, 255, 1.0)",
    unfocused: "rgba(255, 255, 255, 0.7)",
  },
  accent: {
    primary: "rgba(255, 255, 255, 0.9)",
    secondary: "@theme_selected_bg_color",
  },
  status: {
    success: "@success_color",
    warning: "@warning_color",
    error: "@error_color",
  },
  opacity: {
    high: 1.0,
    medium: 0.8,
    low: 0.6,
  },
  font: {
    size: {
      small: "0.8em",
      normal: "1em",
      large: "1.2em",
    },
    weight: {
      normal: "normal",
      bold: "bold",
    },
  },
  spacing: {
    small: "4px",
    medium: "8px",
    large: "16px",
  },
  borderRadius: {
    small: "2px",
    medium: "4px",
    large: "9999px",
  },
};

let currentTheme: Theme = defaultTheme;

export function loadTheme(): Theme {
  const themePath = `${GLib.get_home_dir()}/.config/astal-shell/theme.json`;

  try {
    const userTheme = readJSONFile(themePath);
    if (userTheme && typeof userTheme === "object") {
      // Deep merge user theme with default theme
      currentTheme = deepMerge(defaultTheme, userTheme);
      console.log("Loaded custom theme from:", themePath);
    } else {
      // Create default theme file if it doesn't exist
      saveTheme(defaultTheme);
      currentTheme = defaultTheme;
      console.log("Created default theme file at:", themePath);
    }
  } catch (error) {
    console.warn("Failed to load theme, using default:", error);
    currentTheme = defaultTheme;
  }

  return currentTheme;
}

export function saveTheme(theme: Theme): void {
  const themePath = `${GLib.get_home_dir()}/.config/astal-shell/theme.json`;
  writeJSONFile(themePath, theme);
}

export function getCurrentTheme(): Theme {
  return currentTheme;
}

function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (isObject(sourceValue) && isObject(targetValue)) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue;
      }
    }
  }

  return result;
}

function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
