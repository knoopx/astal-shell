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
        (cover) => `min-width: 36px;
          min-height: 36px;
          margin-right: 8px;
          background-image: url('${cover}');
          background-size: cover;
          border-radius: 4px;
          `
      )}
    />
    <box
      orientation={Gtk.Orientation.VERTICAL}
      css={`margin-right: 8px`}
      valign={Gtk.Align.CENTER}
    >
      <label
        css={`font-size: 0.9em; font-weight: bold;`}
        label={bind(player, "artist")}
        halign={Gtk.Align.START}
        visible={bind(player, "artist").as((artist) => !!artist)}
      />
      <label
        css={`font-size: 0.8em; opacity: 0.8;`}
        label={bind(player, "title")}
        halign={Gtk.Align.START}
      />
    </box>
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
