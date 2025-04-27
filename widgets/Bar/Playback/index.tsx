import Mpris from "gi://AstalMpris";
import { bind } from "astal";
import { Gtk } from "astal/gtk3";
import GhostButton from "./GhostButton";

// TODO: Automatically pause multiple playing things

const Player = (player) => (
  <box>
    <box
      valign={Gtk.Align.CENTER}
      css={bind(player, "coverArt").as(
        (cover) => `min-width: 24px;
          min-height: 24px;
          margin-right: 8px;
          background-image: url('${cover}');
          background-size: cover;
          border-radius: 2px;
          `
      )}
    />
    <label
    css={`margin-right: 8px`}
      label={bind(player, "metadata").as(() =>
        player.artist ? `${player.artist} - ${player.title}` : player.title
      )}
    />
    <GhostButton
      css={`padding:2`}
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
        ></icon>
      }
    />

    <GhostButton
      css={`padding:2`}
      on_clicked={() => player.next()}
      visible={bind(player, "can_go_next").as((c) => c)}
      child={<icon icon={"media-skip-forward-symbolic"} />}
    />
  </box>
);

export default () => {
  const mpris = Mpris.get_default();
  return <box>{bind(mpris, "players").as((x) => x.map(Player))}</box>;
};
