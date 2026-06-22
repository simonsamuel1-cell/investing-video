/**
 * ConceptSectorVideo — the program. The VO is mounted ONCE at frame 0 as the
 * master clock; the 32 scenes are positioned by the frame-exact §6 timeline.
 * A persistent silver AbsoluteFill sits behind every Sequence so scene boundaries
 * never flash. (spec §2/§6/§8)
 */
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { TIMELINE, ASSETS } from "./timeline";
import { SCENES } from "./scenes";
import { Scene23to27 } from "./scenes/Scene23to27";
import { COLORS, MOUNT_VO } from "./theme";

// S23–27 are merged into ONE continuous Sequence (see Scene23to27).
const MERGE_FROM = 4800; // S23 from
const MERGE_TO = 5918; // S28 from

export const ConceptSectorVideo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.silver }}>
      {MOUNT_VO && <Audio src={staticFile(ASSETS.audio)} />}

      {TIMELINE.filter((s) => s.n < 23 || s.n > 27).map((s) => {
        const Scene = SCENES[s.n - 1];
        return (
          <Sequence key={s.n} from={s.from} durationInFrames={s.dur} name={`S${s.n} · ${s.gist}`}>
            <Scene />
          </Sequence>
        );
      })}

      {/* S23–27 continuous block */}
      <Sequence from={MERGE_FROM} durationInFrames={MERGE_TO - MERGE_FROM} name="S23–27 · validation (continuous)">
        <Scene23to27 />
      </Sequence>
    </AbsoluteFill>
  );
};
