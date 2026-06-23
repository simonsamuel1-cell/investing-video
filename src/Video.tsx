/**
 * ConceptSectorVideo — the program. The VO is mounted ONCE at frame 0 as the
 * master clock; the 32 scenes are positioned by the frame-exact §6 timeline.
 * A persistent silver AbsoluteFill sits behind every Sequence so scene boundaries
 * never flash. (spec §2/§6/§8)
 */
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { TIMELINE, ASSETS } from "./timeline";
import { SCENES } from "./scenes";
import { Scene12to13 } from "./scenes/Scene12to13";
import { Scene14to16 } from "./scenes/Scene14to16";
import { Scene23to27 } from "./scenes/Scene23to27";
import { COLORS, MOUNT_VO } from "./theme";

// Continuity blocks — the combo clip Scene_12__13__14__15.mp4 must play with NO
// scene-to-scene transition, so the phone is mounted ONCE across each group:
//   • S12+S13 (2216→2756) — combo continuous (S12→S13 no fade); S13 ends on a fade.
//   • S14–S16 (2756→3458) — combo continuous (S14→S15 phone moves to centre; S15→S16
//     phone moves to the right as the Group phone, no fade; left/middle tabs added).
//   • S23–27 (4800→5918) — combo23_27 continuous (existing).
const G1213 = { from: 2216, to: 2756 };
const G1416 = { from: 2756, to: 3484 }; // +26 hold-frames inserted in S14–16 (23 Jun)
const MERGE_FROM = 4826; // S23 from (shifted +26)
const MERGE_TO = 5944; // S28 from (shifted +26)

const MERGED = new Set([12, 13, 14, 15, 16, 23, 24, 25, 26, 27]);

export const ConceptSectorVideo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.silver }}>
      {MOUNT_VO && <Audio src={staticFile(ASSETS.audio)} />}

      {TIMELINE.filter((s) => !MERGED.has(s.n)).map((s) => {
        const Scene = SCENES[s.n - 1];
        return (
          <Sequence key={s.n} from={s.from} durationInFrames={s.dur} name={`S${s.n} · ${s.gist}`}>
            <Scene />
          </Sequence>
        );
      })}

      {/* S12+S13 continuous block */}
      <Sequence from={G1213.from} durationInFrames={G1213.to - G1213.from} name="S12–13 · three layers → sub-sectors (continuous)">
        <Scene12to13 />
      </Sequence>

      {/* S14–S16 continuous block */}
      <Sequence from={G1416.from} durationInFrames={G1416.to - G1416.from} name="S14–16 · Concepts → Groups → every angle (continuous)">
        <Scene14to16 />
      </Sequence>

      {/* S23–27 continuous block */}
      <Sequence from={MERGE_FROM} durationInFrames={MERGE_TO - MERGE_FROM} name="S23–27 · validation (continuous)">
        <Scene23to27 />
      </Sequence>
    </AbsoluteFill>
  );
};
