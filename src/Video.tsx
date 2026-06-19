/**
 * ConceptSectorVideo — the program. The VO is mounted ONCE at frame 0 as the
 * master clock; the 32 scenes are positioned by the frame-exact §6 timeline.
 * A persistent silver AbsoluteFill sits behind every Sequence so scene boundaries
 * never flash. (spec §2/§6/§8)
 */
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { TIMELINE, ASSETS } from "./timeline";
import { SCENES } from "./scenes";
import { COLORS, MOUNT_VO } from "./theme";

export const ConceptSectorVideo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.silver }}>
      {MOUNT_VO && <Audio src={staticFile(ASSETS.audio)} />}

      {TIMELINE.map((s, i) => {
        const Scene = SCENES[i];
        return (
          <Sequence
            key={s.n}
            from={s.from}
            durationInFrames={s.dur}
            name={`S${s.n} · ${s.gist}`}
          >
            <Scene />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
