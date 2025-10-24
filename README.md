# Astal Shell

Astal-based shell for my [NixOS configuration](https://github.com/knoopx/nix).

![Screenshot](https://github.com/knoopx/nix/blob/master/screenshot.png)

### Development

```bash
# Run the main shell
nix run path:.
```

### Using in NixOS

You can use this flake in your NixOS configuration:

```nix
{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    astal-shell.url = "github:knoopx/astal-shell";
  };

  outputs = { nixpkgs, astal-shell, ... }: {
    nixosConfigurations.yourhostname = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        # Your other modules
        ({ pkgs, ... }: {
          # Add the overlay
          nixpkgs.overlays = [ astal-shell.overlays.default ];

          # Install the packages
          environment.systemPackages = with pkgs; [
            astal-shell
          ];
        })
      ];
    };
  };
}
```

### Using with Home Manager

```nix
{ inputs, pkgs, ... }: {
  imports = [ inputs.astal-shell.homeManagerModules.default ];

services.astal-shell = {
    enable = true;

    # Optional: configure display margins
    displays = {
      "LG HDR 4K" = [390 145];
      "DP-1" = [250 80];
    };

    # Optional: configure theme
    theme = {
      background = {
        primary = "rgba(30, 30, 46, 1.0)";
        secondary = "rgba(24, 24, 37, 1.0)";
      };
      text = {
        primary = "rgba(205, 214, 244, 1.0)";
        secondary = "rgba(186, 194, 222, 0.7)";
      };
      # ... other theme options
    };

    # Optional: use a different package
    package = pkgs.astal-shell;
  };

    # Optional: customize theme
    theme = {
      background = {
        primary = "rgba(30, 30, 46, 1.0)";
        secondary = "rgba(24, 24, 37, 1.0)";
      };
      # ... other theme options
    };

    # Optional: use a different package
    package = pkgs.astal-shell;
  };
}
```

## Configuration

### Display/Margins Configuration

Monitors are identified using:

1. Connector name (e.g., `DP-1`, `HDMI-A-1`)
2. Model information
3. Fallback to `monitor_{number}` naming

You can customize margins for specific displays in `~/.config/astal-shell/displays.json`:

```json
{
  "DP-1": [250, 80],
  "HDMI-A-1": [400, 120]
}
```

### Theming

The shell uses a JSON-based configuration. Theme settings are stored in `~/.config/astal-shell/theme.json`:

```json
{
  "colors": {
    "background": {
      "primary": "rgba(0, 0, 0, 0.8)",
      "secondary": "rgba(0, 0, 0, 0.6)"
    },
    "text": {
      "primary": "rgba(255, 255, 255, 1.0)",
      "secondary": "rgba(255, 255, 255, 0.8)",
      "focused": "rgba(255, 255, 255, 1.0)",
      "unfocused": "rgba(255, 255, 255, 0.6)"
    },
    "accent": {
      "primary": "rgba(100, 149, 237, 0.8)",
      "secondary": "rgba(100, 149, 237, 0.6)",
      "border": "rgba(100, 149, 237, 0.4)",
      "overlay": "rgba(100, 149, 237, 0.2)"
    },
    "status": {
      "success": "rgba(76, 175, 80, 0.8)",
      "warning": "rgba(255, 193, 7, 0.8)",
      "error": "rgba(244, 67, 54, 0.8)"
    }
  },
  "opacity": {
    "high": 1.0,
    "medium": 0.8,
    "low": 0.6
  },
  "font": {
    "sizes": {
      "small": "0.8em",
      "normal": "1em",
      "large": "1.2em"
    },
    "weights": {
      "normal": "normal",
      "bold": "bold"
    }
  },
  "spacing": {
    "small": "4px",
    "medium": "8px",
    "large": "16px"
  },
  "borderRadius": {
    "small": "2px",
    "medium": "4px",
    "large": "9999px"
  }
}
```
