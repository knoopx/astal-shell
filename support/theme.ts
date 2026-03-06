import GLib from "gi://GLib";
import { readJSONFile, writeJSONFile } from "./util";
import { deepMerge } from "./deepMerge";

interface Theme {
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
    border: string;
    overlay: string;
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

const defaultTheme: Theme = {
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
    secondary: "rgba(100, 149, 237, 0.8)",
    border: "rgba(255, 255, 255, 0.2)",
    overlay: "rgba(0, 0, 0, 0.6)",
  },
  status: {
    success: "rgba(40, 167, 69, 0.8)",
    warning: "rgba(255, 193, 7, 0.8)",
    error: "rgba(220, 53, 69, 0.8)",
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
      currentTheme = deepMerge(defaultTheme, userTheme as Partial<Theme>);
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

function saveTheme(theme: Theme): void {
  const themePath = `${GLib.get_home_dir()}/.config/astal-shell/theme.json`;
  writeJSONFile(themePath, theme);
}

export function getCurrentTheme(): Theme {
  return currentTheme;
}
