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
      type = lib.types.submodule {
        options = {
          iconTheme = lib.mkOption {
            type = lib.types.str;
            default = "Adwaita";
            description = "GTK icon theme to use for icons.";
          };

          background = lib.mkOption {
            type = lib.types.submodule {
              options = {
                primary = lib.mkOption { type = lib.types.str; };
                secondary = lib.mkOption { type = lib.types.str; };
              };
            };
            default = {};
            description = "Background color overrides.";
          };

          text = lib.mkOption {
            type = lib.types.submodule {
              options = {
                primary = lib.mkOption { type = lib.types.str; };
                secondary = lib.mkOption { type = lib.types.str; };
                focused = lib.mkOption { type = lib.types.str; };
                unfocused = lib.mkOption { type = lib.types.str; };
              };
            };
            default = {};
            description = "Text color overrides.";
          };

          accent = lib.mkOption {
            type = lib.types.submodule {
              options = {
                primary = lib.mkOption { type = lib.types.str; };
                secondary = lib.mkOption { type = lib.types.str; };
                border = lib.mkOption { type = lib.types.str; };
                overlay = lib.mkOption { type = lib.types.str; };
              };
            };
            default = {};
            description = "Accent color overrides.";
          };

          status = lib.mkOption {
            type = lib.types.submodule {
              options = {
                success = lib.mkOption { type = lib.types.str; };
                warning = lib.mkOption { type = lib.types.str; };
                error = lib.mkOption { type = lib.types.str; };
              };
            };
            default = {};
            description = "Status color overrides.";
          };

          opacity = lib.mkOption {
            type = lib.types.submodule {
              options = {
                high = lib.mkOption { type = lib.types.float; };
                medium = lib.mkOption { type = lib.types.float; };
                low = lib.mkOption { type = lib.types.float; };
              };
            };
            default = {};
            description = "Opacity value overrides.";
          };

          font = lib.mkOption {
            type = lib.types.submodule {
              options = {
                size = lib.mkOption {
                  type = lib.types.submodule {
                    options = {
                      small = lib.mkOption { type = lib.types.str; };
                      normal = lib.mkOption { type = lib.types.str; };
                      large = lib.mkOption { type = lib.types.str; };
                    };
                  };
                  default = {};
                };
                weight = lib.mkOption {
                  type = lib.types.submodule {
                    options = {
                      normal = lib.mkOption { type = lib.types.str; };
                      bold = lib.mkOption { type = lib.types.str; };
                    };
                  };
                  default = {};
                };
              };
            };
            default = {};
            description = "Font style overrides.";
          };

          spacing = lib.mkOption {
            type = lib.types.submodule {
              options = {
                small = lib.mkOption { type = lib.types.str; };
                medium = lib.mkOption { type = lib.types.str; };
                large = lib.mkOption { type = lib.types.str; };
              };
            };
            default = {};
            description = "Spacing overrides.";
          };

          borderRadius = lib.mkOption {
            type = lib.types.submodule {
              options = {
                small = lib.mkOption { type = lib.types.str; };
                medium = lib.mkOption { type = lib.types.str; };
                large = lib.mkOption { type = lib.types.str; };
              };
            };
            default = {};
            description = "Border radius overrides.";
          };
        };
      };
      default = {};
      description = "Theme configuration for Astal Shell. Partial overrides are supported and merged with defaults at runtime.";
    };

    quickSettings = lib.mkOption {
      type = lib.types.listOf (
        lib.types.submodule {
          options = {
            id = lib.mkOption {
              type = lib.types.str;
              description = "Unique identifier for the button.";
            };
            icon = lib.mkOption {
              type = lib.types.str;
              description = "GTK icon name (e.g., system-shutdown-symbolic).";
            };
            label = lib.mkOption {
              type = lib.types.str;
              description = "Tooltip text shown on hover.";
            };
            command = lib.mkOption {
              type = lib.types.either (
                lib.types.str
              ) (
                lib.types.listOf lib.types.str
              );
              description = "Command to execute (array of strings or single string).";
            };
            confirm = lib.mkOption {
              type = lib.types.bool;
              default = false;
              description = "Whether to show a confirmation dialog before executing.";
            };
          };
        }
      );
      default = [
        {
          id = "shutdown";
          icon = "system-shutdown-symbolic";
          label = "Shutdown";
          command = ["systemctl" "poweroff"];
          confirm = true;
        }
        {
          id = "reboot";
          icon = "system-reboot-symbolic";
          label = "Reboot";
          command = ["systemctl" "reboot"];
          confirm = true;
        }
        {
          id = "logout";
          icon = "system-log-out-symbolic";
          label = "Logout";
          command = ["niri" "msg" "action" "quit" "-s"];
          confirm = true;
        }
      ];
      description = "Quick settings buttons shown in the top bar.";
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
      (lib.mkIf (cfg.quickSettings != []) {
        "astal-shell/quickSettings.json".text = builtins.toJSON (map (entry: {
          id = entry.id;
          icon = entry.icon;
          label = entry.label;
          command = entry.command;
          confirm = entry.confirm;
        }) cfg.quickSettings);
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
