import Mpris from "gi://AstalMpris";
import Gio from "gi://Gio";
import Pango from "gi://Pango";
import { createBinding, createState, For } from "ags";
import { Gtk } from "ags/gtk4";
import { getCurrentTheme } from "../../../support/theme";

function PlayPauseButton({ player }: { player: Mpris.Player }) {
  const canPlay = createBinding(player, "can_play");
  const playbackStatus = createBinding(player, "playbackStatus");

  return (
    <button
      css={`
        padding: 0;
        margin: 0;
        min-width: 24px;
        min-height: 24px;
        border-radius: 100%;
        background-color: ${getCurrentTheme().accent.overlay};
      `}
      onClicked={() => player.play_pause()}
      visible={canPlay}
    >
      <image
        pixelSize={16}
        iconName={playbackStatus((s) => {
          switch (s) {
            case Mpris.PlaybackStatus.PLAYING:
              return "media-playback-pause-symbolic";
            case Mpris.PlaybackStatus.PAUSED:
            case Mpris.PlaybackStatus.STOPPED:
              return "media-playback-start-symbolic";
          }
        })}
      />
    </button>
  );
}

const Player = (player: Mpris.Player) => {
  const [isHovering, setIsHovering] = createState(false);
  const coverArt = createBinding(player, "coverArt");
  const artist = createBinding(player, "artist");
  const title = createBinding(player, "title");
  const canGoNext = createBinding(player, "can_go_next");

  return (
    <box>
      <box>
        <Gtk.EventControllerMotion
          onEnter={() => setIsHovering(true)}
          onLeave={() => setIsHovering(false)}
        />
        <overlay>
          <box
            cssClasses={["artwork-container"]}
            valign={Gtk.Align.CENTER}
            overflow={Gtk.Overflow.HIDDEN}
            widthRequest={36}
            heightRequest={36}
            css={coverArt(
              (cover) => {
                const uri = cover ? Gio.File.new_for_path(cover).get_uri() : null;
                return `
                  min-width: 36px;
                  min-height: 36px;
                  border-radius: 4px;
                  border: 2px solid ${getCurrentTheme().accent.border};
                  ${uri ? `background-image: url("${uri}");` : ""}
                  background-size: cover;
                  background-position: center;
                  background-repeat: no-repeat;
                `;
              },
            )}
          />
          <box
            $type="overlay"
            halign={Gtk.Align.CENTER}
            valign={Gtk.Align.CENTER}
            css={isHovering(
              (hovering) => `
                opacity: ${hovering ? 1 : 0};
              `,
            )}
            visible={isHovering}
          >
            <PlayPauseButton player={player} />
          </box>
        </overlay>
      </box>

      <box
        orientation={Gtk.Orientation.VERTICAL}
        css={`
          margin-left: 8px;
          margin-right: 8px;
        `}
        valign={Gtk.Align.CENTER}
      >
        <label
          css={`
            font-size: 0.9em;
            font-weight: bold;
          `}
          label={artist}
          halign={Gtk.Align.START}
          visible={artist((value) => !!value)}
          ellipsize={Pango.EllipsizeMode.END}
          maxWidthChars={20}
        />
        <label
          css={`
            font-size: 0.8em;
            opacity: 0.8;
          `}
          label={title}
          halign={Gtk.Align.START}
          ellipsize={Pango.EllipsizeMode.END}
          maxWidthChars={20}
        />
      </box>

      <button
        css={`
          padding: 0.5em;
          background-color: transparent;
        `}
        onClicked={() => player.next()}
        visible={canGoNext}
      >
        <image iconName="media-skip-forward-symbolic" pixelSize={16} />
      </button>
    </box>
  );
};

export default () => {
  const mpris = Mpris.get_default();
  const players = createBinding(mpris, "players");

  return (
    <box>
      <For each={players}>{(player: Mpris.Player) => Player(player)}</For>
    </box>
  );
};
