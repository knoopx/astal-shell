import Mpris from "gi://AstalMpris";
import { bind, Variable } from "astal";
import { Gtk } from "astal/gtk3";
import GhostButton from "./GhostButton";

// TODO: Automatically pause multiple playing things

function PlayPauseButton({ player }) {
  return (
    <GhostButton

    css={`
        background-color: transparent;
      `}
      on_clicked={() => player.play_pause()}
      visible={bind(player, "can_play").as((c) => c)}
      child={
        <icon
          icon={bind(player, "playbackStatus").as((s) => {
            switch (s) {
              case Mpris.PlaybackStatus.PLAYING:
                return "media-playback-pause-symbolic";
              case Mpris.PlaybackStatus.PAUSED:
              case Mpris.PlaybackStatus.STOPPED:
                return "media-playback-start-symbolic";
            }
          })}
        />
      }
    />
  );
}

const Player = (player) => {
  const isHovering = Variable(false);

  return (
    <box>
      <eventbox
        onHover={() => isHovering.set(true)}
        onHoverLost={() => isHovering.set(false)}
        child={
          <overlay>
            <box
              className="artwork"
              valign={Gtk.Align.CENTER}
              css={bind(player, "coverArt").as(
                (cover) => `min-width: 36px;
                  min-height: 36px;
                  background-image: url('${cover}');
                  background-size: cover;
                  border-radius: 4px;
                  `
              )}
            />
            <box
              className="artwork-overlay"
              valign={Gtk.Align.CENTER}
              css={bind(isHovering).as((hovering) => `
                min-width: 36px;
                min-height: 36px;
                background-color: rgba(0, 0, 0, ${hovering ? 0.6 : 0});
                border-radius: 4px;
              `)}
            />
            <box
              halign={Gtk.Align.CENTER}
              valign={Gtk.Align.CENTER}
              css={bind(isHovering).as((hovering) => `
                opacity: ${hovering ? 1 : 0};
              `)}
              visible={bind(isHovering)}
              child={<PlayPauseButton player={player} />}
            />
          </overlay>
        }
      />

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
          label={bind(player, "artist")}
          halign={Gtk.Align.START}
          visible={bind(player, "artist").as((artist) => !!artist)}
        />
        <label
          css={`
            font-size: 0.8em;
            opacity: 0.8;
          `}
          label={bind(player, "title")}
          halign={Gtk.Align.START}
        />
      </box>

      <GhostButton
        css={`
          padding: 0.5em;
        `}
        on_clicked={() => player.next()}
        visible={bind(player, "can_go_next").as((c) => c)}
        child={<icon icon={"media-skip-forward-symbolic"} />}
      />
    </box>
  );
};

export default () => {
  const mpris = Mpris.get_default();
  return <box>{bind(mpris, "players").as((x) => x.map(Player))}</box>;
};
