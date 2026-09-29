# Astal Shell

Astal-based shell for my [NixOS configuration](https://github.com/knoopx/nix).

![Screenshot](https://github.com/knoopx/nix/blob/master/screenshot.png)

### Development

```bash
# Run the main shell
nix run path:.
```

### Using with Home Manager

```nix
{ inputs, pkgs, ... }: {
  imports = [ inputs.astal-shell.homeManagerModules.default ];

services.astal-shell = {
    enable = true;

    # Optional: configure theme
    theme = {
      iconTheme = "Adwaita";

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
}
```

## Module Options

### `services.astal-shell.enable`

Enable the Astal Shell service. Default: `false`.

```nix
services.astal-shell.enable = true;
```

### Bar layout

Bar margins are derived at runtime from the niri overview zoom and each monitor's logical size. Set the zoom in your niri config (`~/.config/niri/config.kdl`):

```kdl
overview {
  zoom 0.5
}
```

Bars match the overview card width and centre in the inter-workspace gap, so they track the overview at any zoom. No per-display configuration is needed.

### `services.astal-shell.theme`

Theme configuration. Supports the following options:

- `iconTheme` — GTK icon theme name. Default: `"Adwaita"`.

Additional theme keys (background colors, text colors, accent colors, etc.) are passed through to the shell's theme config.

```nix
services.astal-shell.theme = {
  iconTheme = "Yaru";

  background = {
    primary = "rgba(30, 30, 46, 1.0)";
    secondary = "rgba(24, 24, 37, 1.0)";
  };
  text = {
    primary = "rgba(205, 214, 244, 1.0)";
    secondary = "rgba(186, 194, 222, 0.7)";
  };
};
```

### `services.astal-shell.quickSettings`

List of quick settings buttons shown in the top bar. Includes built-in defaults for shutdown, reboot, and logout — override the list to customize.

Each entry supports:

- `id` — unique identifier
- `icon` — GTK icon name
- `label` — tooltip text
- `command` — command to execute (string or list of strings)
- `confirm` — show confirmation dialog before executing (default: `false`)

```nix
services.astal-shell.quickSettings = [
  {
    id = "lock";
    icon = "system-lock-screen-symbolic";
    label = "Lock";
    command = ["swaylock" "-c" "000000"];
    confirm = false;
  }
  {
    id = "shutdown";
    icon = "system-shutdown-symbolic";
    label = "Shutdown";
    command = ["systemctl" "poweroff"];
    confirm = true;
  }
];
```

### `services.astal-shell.package`

The astal-shell package to use. Default: `pkgs.astal-shell`.

```nix
services.astal-shell.package = pkgs.astal-shell;
```
