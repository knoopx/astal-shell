{
  description = "AGS Shell Configuration";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    ags.url = "github:aylur/ags";
  };

  outputs = {
    self,
    nixpkgs,
    ags,
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    packages.${system} = {
      # Main shell package
      default = ags.lib.bundle {
        inherit pkgs;
        src = ./.;
        name = "astal-shell";
        entry = "app.ts";
        gtk4 = false;

        # Additional libraries and executables for the shell functionality
        extraPackages = with pkgs; [
          # Astal libraries for specific functionality
          ags.packages.${system}.astal3
          ags.packages.${system}.astal4
          ags.packages.${system}.io
          ags.packages.${system}.apps
          ags.packages.${system}.mpris
          ags.packages.${system}.network
          ags.packages.${system}.tray
          ags.packages.${system}.wireplumber

          # System utilities used in the configuration
          gnome-weather
          gnome-calendar
          mission-center
          curl

          # System control utilities (for power management)
          systemd

          # System monitoring libraries
          libgtop
        ];
      };

      # Greeter package
      greeter = ags.lib.bundle {
        inherit pkgs;
        src = ./.;
        name = "ags-greeter";
        entry = "greeter.jsx";
        gtk4 = false;

        # Additional libraries for the greeter
        extraPackages = [
          ags.packages.${system}.astal3
          ags.packages.${system}.greet
        ];
      };
    };

    # Apps for easy running
    apps.${system} = {
      default = {
        type = "app";
        program = "${self.packages.${system}.default}/bin/astal-shell";
      };

      greeter = {
        type = "app";
        program = "${self.packages.${system}.greeter}/bin/ags-greeter";
      };
    };

    # Overlay for using in NixOS configurations
    overlays.default = final: prev: {
      astal-shell = self.packages.${system}.default;
      ags-greeter = self.packages.${system}.greeter;
    };
  };
}
