{
  description = "Quickshell-based Astal Shell Configuration";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    quickshell.url = "git+https://git.outfoxxed.me/outfoxxed/quickshell";
     quickshell.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, quickshell }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
    quickshellPkg = quickshell.packages.${system}.default;
  in {
     packages.${system} = {
      astal-shell-launcher = pkgs.writeShellScriptBin "astal-shell-launcher" ''
        export QML_IMPORT_PATH=${quickshellPkg}/lib/qt-6/qml
        exec ${quickshellPkg}/bin/quickshell -p ${self.packages.${system}.default}/share/quickshell/shell.qml
      '';

    # Use official quickshell package from flake
    quickshell = quickshellPkg;

  default = pkgs.stdenv.mkDerivation {
    name = "astal-shell-quickshell";
    src = ./.;
    installPhase = ''
      mkdir -p $out/share/quickshell
      cp -r $src/quickshell/* $out/share/quickshell/
    '';
  };
};

    apps.${system}.default = {
      type = "app";
        program = "${self.packages.${system}.astal-shell-launcher}/bin/astal-shell-launcher";


    };

    overlays.default = final: prev: {
      astal-shell-quickshell = self.packages.${system}.default;
    };
  };
}
