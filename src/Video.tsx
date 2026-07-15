/**
 * ConceptSectorVideo — 15 Jul revision (branch Concept-Sector-Revision).
 * Being re-timed to New_Voice_2. For now ONLY the reused chunks are re-slotted to
 * their new frame positions (MOVES below); every other frame is an intentional
 * empty silver gap, to be filled in later steps. The VO is the master clock at
 * frame 0 and is NOT touched.
 *
 * Each move re-mounts every OLD clip fragment that overlaps its source range at the
 * destination: the OUTER <Sequence> clips the visible window, the INNER one offsets
 * the clip's local frame so it renders exactly the frames it showed in the old cut
 * (continuous blocks therefore cut precisely at the pointed frames).
 */
import type { FC } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { TIMELINE, ASSETS } from "./timeline";
import { SCENES } from "./scenes";
import { Scene12to13 } from "./scenes/Scene12to13";
import { Scene14to16 } from "./scenes/Scene14to16";
import { Scene19to21 } from "./scenes/Scene19to21";
import { Scene23to27 } from "./scenes/Scene23to27";
import { COLORS, MOUNT_VO } from "./theme";

// The old cut expressed as clips (OLD from/dur + component). Merged scenes are
// represented by their continuity block, not individually.
const MERGED = new Set([12, 13, 14, 15, 16, 19, 20, 21, 23, 24, 25, 26, 27, 28]);
type Clip = { from: number; dur: number; Comp: FC; name: string };
const OLD_CLIPS: Clip[] = [
  ...TIMELINE.filter((s) => !MERGED.has(s.n)).map((s) => ({ from: s.from, dur: s.dur, Comp: SCENES[s.n - 1] as FC, name: `S${s.n}` })),
  { from: 2216, dur: 540, Comp: Scene12to13, name: "S12-13" },
  { from: 2756, dur: 728, Comp: Scene14to16, name: "S14-16" },
  { from: 3806, dur: 930, Comp: Scene19to21, name: "S19-21" },
  { from: 4826, dur: 1328, Comp: Scene23to27, name: "S23-28" },
];

// Reused chunks moved to new frame slots (timecodes mm.ss.ff @30fps from Simon;
// before-length == after-length, so each is a pure move). src = OLD [A,B); dst = NEW start.
const MOVES: { src: [number, number]; dst: number; label: string }[] = [
  { src: [339, 450], dst: 583, label: "1" }, // 0:11.09–0:15.00 → 0:19.13
  { src: [2150, 2486], dst: 1350, label: "2" }, // 1:11.20–1:22.26 → 0:45.00
  { src: [2486, 2620], dst: 1686, label: "3" }, // continues #2 (S12–13 block) → 0:56.06
  { src: [3147, 3345], dst: 2137, label: "4" }, // 1:44.27–1:51.15 → 1:11.07
  { src: [4790, 5814], dst: 6004, label: "5" }, // 2:39.20–3:13.24 → 3:20.04
  { src: [6523, 6902], dst: 7047, label: "6" }, // 3:37.13–3:50.02 → 3:54.27
];

// Reference-only: the FULL previous cut (all clips at their ORIGINAL frames + the
// OLD padded VO). Registered as its own composition so Simon can scrub it and read
// off timestamps to copy into MOVES. Old duration was 6928.
export const PreviousCut = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.silver }}>
    <Audio src={staticFile("Most_traders_start__1__padded.mp3")} />
    {OLD_CLIPS.map((c) => {
      const { Comp } = c;
      return (
        <Sequence key={c.name} from={c.from} durationInFrames={c.dur} name={c.name}>
          <Comp />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);

export const ConceptSectorVideo = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.silver }}>
    {MOUNT_VO && <Audio src={staticFile(ASSETS.audio)} />}

    {MOVES.flatMap((m) => {
      const [a, b] = m.src;
      const offset = m.dst - a;
      return OLD_CLIPS.flatMap((c) => {
        const start = Math.max(a, c.from);
        const end = Math.min(b, c.from + c.dur);
        if (end <= start) return [];
        const L0 = start - c.from; // clip-local frame at the fragment start
        const len = end - start;
        const { Comp } = c;
        return [
          <Sequence key={`m${m.label}-${c.name}`} from={start + offset} durationInFrames={len} name={`move ${m.label} · ${c.name}`}>
            <Sequence from={-L0} durationInFrames={c.dur}>
              <Comp />
            </Sequence>
          </Sequence>,
        ];
      });
    })}
  </AbsoluteFill>
);
