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
    astal-shell.url = "github:knoopx/ags";
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
  imports = [ inputs.ags.homeManagerModules.default ];

  programs.ags = {
    enable = true;
    configDir = null;  # Don't symlink since we're using the bundled version
    extraPackages = with pkgs; [
      inputs.astal-shell.packages.${pkgs.system}.default
    ];
  };
}
```

## Configuration

### Display Configuration

Display settings are stored in:

- **Configuration File**: `~/.config/astal-shell/displays.json`

#### Default Display Configuration

Monitors are identified using:

1. Connector name (e.g., `DP-1`, `HDMI-A-1`)
2. Model information
3. Fallback to `monitor_{number}` naming

#### Per-Display Customization

You can customize margins for specific displays:

```json
{
  "DP-1": [250, 80],
  "HDMI-A-1": [400, 120]
}
```

### Theming System

The shell uses a comprehensive theming system with JSON-based configuration. Theme settings are stored in:

- **Theme File**: `~/.config/astal-shell/theme.json`

#### Default Theme Structure

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
