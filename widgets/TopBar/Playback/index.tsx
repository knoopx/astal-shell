import Mpris from "gi://AstalMpris";
import { createBinding, createState, With, For } from "ags";
import { Gtk } from "ags/gtk3";

// TODO: Automatically pause multiple playing things

function PlayPauseButton({ player }) {
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
        background-color: rgba(0, 0, 0, 0.6);
      `}
      onClicked={() => player.play_pause()}
      visible={canPlay}
    >
      <icon
        icon={playbackStatus((s) => {
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

const Player = (player) => {
  const [isHovering, setIsHovering] = createState(false);
  const coverArt = createBinding(player, "coverArt");
  const artist = createBinding(player, "artist");
  const title = createBinding(player, "title");
  const canGoNext = createBinding(player, "can_go_next");

  return (
    <box>
      <eventbox
        onHover={() => setIsHovering(true)}
        onHoverLost={() => setIsHovering(false)}
      >
        <overlay>
          <box
            class="artwork-container"
            valign={Gtk.Align.CENTER}
            css={`
              min-width: 36px;
              min-height: 36px;
              border-radius: 4px;
              border: 2px solid rgba(255, 255, 255, 0.2);
            `}
          >
            <box
              class="artwork"
              css={coverArt((cover) => `min-width: 36px;
                min-height: 36px;
                background-image: url('${cover}');
                background-size: cover;
                background-position: center;
                border-radius: 3px;
                `
              )}
            />
          </box>
          <box
            halign={Gtk.Align.CENTER}
            valign={Gtk.Align.CENTER}
            css={isHovering((hovering) => `
              opacity: ${hovering ? 1 : 0};
            `)}
            visible={isHovering}
          >
            <PlayPauseButton player={player} />
          </box>
        </overlay>
      </eventbox>

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
          visible={artist((artist) => !!artist)}
        />
        <label
          css={`
            font-size: 0.8em;
            opacity: 0.8;
          `}
          label={title}
          halign={Gtk.Align.START}
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
        <icon icon={"media-skip-forward-symbolic"} />
      </button>
    </box>
  );
};

export default () => {
  const mpris = Mpris.get_default();
  const players = createBinding(mpris, "players");

  return (
    <box>
      <box>
        <For each={players}>
          {(player: any) => Player(player)}
        </For>
      </box>
    </box>
  );
};
