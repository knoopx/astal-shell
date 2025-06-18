{
  description = "AGS Shell Configuration";

  inputs = {
    nixpkgs.url = "nixpkgs/nixpkgs-unstable";
    ags.url = "github:aylur/ags";
    ags.inputs.nixpkgs.follows = "nixpkgs";
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
          # Core Astal runtime
          ags.packages.${system}.gjs

          # Astal libraries for specific functionality
          ags.packages.${system}.astal3
          ags.packages.${system}.astal4
          ags.packages.${system}.io
          ags.packages.${system}.apps
          ags.packages.${system}.mpris
          ags.packages.${system}.network
          ags.packages.${system}.tray
          ags.packages.${system}.wireplumber
          ags.packages.${system}.battery

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
    };

    # Apps for easy running
    apps.${system} = {
      default = {
        type = "app";
        program = "${self.packages.${system}.default}/bin/astal-shell";
      };
    };

    # Overlay for using in NixOS configurations
    overlays.default = final: prev: {
      astal-shell = self.packages.${system}.default;
    };
  };
}
