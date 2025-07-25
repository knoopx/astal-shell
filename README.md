# Astal Shell

Astal-based shell for my [NixOS configuration](https://github.com/knoopx/nix).

![Screenshot](https://github.com/knoopx/nix/blob/master/screenshot.png)

## Nix Flake Usage

This repository includes a Nix flake for easy packaging and development.

### Building

```bash
# Build the main shell
nix build .#default
```

### Running

```bash
# Run the main shell
nix run .#default
```

### Development

```bash
# Enter development shell with all AGS libraries
nix develop

# Or use direnv for automatic shell activation
echo "use flake" > .envrc
direnv allow
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
