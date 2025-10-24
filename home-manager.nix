{
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.services.astal-shell;
in {
  options.services.astal-shell = {
    enable = lib.mkEnableOption "Astal Shell service";

    displays = lib.mkOption {
      type = lib.types.attrsOf (lib.types.listOf lib.types.int);
      default = {};
      description = "Display configuration mapping display names to [horizontal, vertical] margins.";
    };

    theme = lib.mkOption {
      type = lib.types.attrsOf lib.types.anything;
      default = {};
      description = "Theme configuration for Astal Shell.";
    };

    package = lib.mkOption {
      type = lib.types.package;
      default = pkgs.astal-shell;
      description = "The astal-shell package to use.";
    };
  };

  config = lib.mkIf cfg.enable {
    home.packages = [cfg.package];

    xdg.configFile = lib.mkMerge [
      (lib.mkIf (cfg.displays != {}) {
        "astal-shell/displays.json".text = builtins.toJSON cfg.displays;
      })
      (lib.mkIf (cfg.theme != {}) {
        "astal-shell/theme.json".text = builtins.toJSON cfg.theme;
      })
    ];

    systemd.user.services.astal-shell = {
      Unit = {
        Description = "Astal Shell";
        After = ["graphical-session.target"];
        Wants = ["graphical-session.target"];
      };
      Service = {
        Type = "simple";
        ExecStart = "${cfg.package}/bin/astal-shell";
        Restart = "on-failure";
        RestartSec = 3;
      };
      Install = {
        WantedBy = ["graphical-session.target"];
      };
    };
  };
}
