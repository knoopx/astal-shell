{
  description = "AGS Shell Configuration";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    self,
    nixpkgs,
    ags,
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};

    astalPackages = with ags.packages.${system}; [
      io
      astal3
      battery
      apps
      mpris
      network
      tray
      wireplumber
    ];

    extraPackages =
      astalPackages
      ++ (with pkgs; [
        gnome-weather
        gnome-calendar
        mission-center
        curl
        systemd
        libgtop
        brightnessctl
        libadwaita
        libsoup_3
        gjs
        glib
      ]);

    agsCustom = (
      ags.packages.${system}.default
          .override
      {
        inherit extraPackages;
      }
    );
  in {
    packages.${system} = {
      ags = agsCustom;
      default = pkgs.stdenv.mkDerivation rec {
        name = "astal-shell";
        pname = "astal-shell";
        entry = "app.ts";

        src = ./.;
        nativeBuildInputs = with pkgs; [
          wrapGAppsHook
          gobject-introspection
          agsCustom
        ];
        buildInputs = extraPackages;
        installPhase = ''
          runHook preInstall

           mkdir -p $out/bin
           mkdir -p $out/share
           cp -r * $out/share
           ags bundle --gtk 3 ${entry} $out/bin/${pname} -d "SRC='$out/share'"

           runHook postInstall
        '';
      };

      apps.${system}.default = {
        type = "app";
        program = "${self.packages.${system}.default}/bin/astal-shell";
      };

      overlays.default = final: prev: {
        astal-shell = self.packages.${system}.default;
      };
    };
  };
}
