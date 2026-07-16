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
import type { FC, ReactNode } from "react";
import { AbsoluteFill, Audio, Freeze, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { TIMELINE, ASSETS } from "./timeline";
import { SCENES } from "./scenes";
import { Scene12to13 } from "./scenes/Scene12to13";
import { Scene14to16 } from "./scenes/Scene14to16";
import { Scene19to21 } from "./scenes/Scene19to21";
import { Scene23to27 } from "./scenes/Scene23to27";
import { Scene01Focus } from "./scenes/Scene01Focus";
import { SceneThemeGrid } from "./scenes/SceneThemeGrid";
import { SceneEntryPoints } from "./scenes/SceneEntryPoints";
import { SceneEntryPhones } from "./scenes/SceneEntryPhones";
import { SceneFramePhone } from "./scenes/SceneFramePhone";
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
  { src: [0, 352], dst: 0, label: "0" }, // PrC 0–351 → NV 0 (full S1 opening)
  // move "1" (PrC 339–450 → 583, the "NOISE" scene) disabled — the new Scene01Focus
  // sequence now owns 351→595. Re-enable if the NOISE beat is wanted elsewhere.
  // { src: [339, 450], dst: 583, label: "1" },
  { src: [2153, 2486], dst: 1353, label: "2" }, // 1:11.20–1:22.26 → 0:45; skips S10-tail flash 1350–1352
  // move "3" (S12–13 continuation) is custom-mounted below (tags removed + freeze at 1794).
  // moves "4"+"B" are custom-mounted below as ONE continuous S14–16 playback (no cut).
  { src: [4790, 5814], dst: 6004, label: "5" }, // 2:39.20–3:13.24 → 3:20.04
  { src: [6523, 6902], dst: 7047, label: "6" }, // 3:37.13–3:50.02 → 3:54.27
  // move "A" (PrC 2756–3131 S14–16 → 1820) is custom-mounted below with a 3-item Concept list.
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

// Fades its children out starting at scene-local frame `fadeOutAt` (for crossfades).
const FadeBox = ({ fadeOutAt, fadeOutDur = 14, children }: { fadeOutAt: number; fadeOutDur?: number; children: ReactNode }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [fadeOutAt, fadeOutAt + fadeOutDur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

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

    {/* New content — freeze S1 @351, isolate EXCL, buy, floating loss; dims to a 20%
        frozen bg + "NOISE" at 595, then fades out to end scene 1 at 693. */}
    <Sequence from={351} durationInFrames={342} name="Scene01Focus · EXCL freeze → buy → loss → NOISE (ends 693)">
      <Scene01Focus />
    </Sequence>

    {/* Theme grid → ABCD → "????" scan → ABCD highlight (700→1349). */}
    <Sequence from={700} durationInFrames={650} name="SceneThemeGrid · grid → ABCD → ???? scan → ABCD (ends 1349)">
      <SceneThemeGrid />
    </Sequence>

    {/* move 3 — S12–13 continuation (tags removed). Plays block-local 270→378 over
        1686→1794, then FREEZES at 378 (kills the page-scroll) and holds to 1819. */}
    <Sequence from={1686} durationInFrames={108} name="move 3 · S12–13 (no tags)">
      <Sequence from={-270} durationInFrames={540} layout="none">
        <Scene12to13 hideTags />
      </Sequence>
    </Sequence>
    <Sequence from={1794} durationInFrames={26} name="move 3 freeze · S12–13 @378 (no scroll)">
      <Freeze frame={378}>
        <Scene12to13 hideTags />
      </Freeze>
    </Sequence>

    {/* moves 4+B — ONE continuous S14–16 playback from block-local 424 (phone already
        CENTRED, so no entry slide). The video keeps rolling — no freeze, no cut — and
        flows straight into the "one screen, every angle" beat. NV 2137→2440, then the
        last S16 frame holds and fades out, ending at 2454. Revealed by move A's crossfade. */}
    <Sequence from={2137} durationInFrames={303} name="moves 4+B · One owner → every angle (continuous)">
      <Sequence from={-424} durationInFrames={728} layout="none">
        <Scene14to16 />
      </Sequence>
    </Sequence>
    <Sequence from={2440} durationInFrames={14} name="moves 4+B tail · hold + fade out (ends 2454)">
      <FadeBox fadeOutAt={0} fadeOutDur={14}>
        <Freeze frame={726}>
          <Scene14to16 />
        </Freeze>
      </FadeBox>
    </Sequence>

    {/* text beat — "Different entry points" (2467) → "Same tool" (2537); out by 2595. */}
    <Sequence from={2455} durationInFrames={140} name="SceneEntryPoints · different entry points → same tool">
      <SceneEntryPoints />
    </Sequence>

    {/* TikTok/X entry-point phones + five "????" stock labels (2608→2863). */}
    <Sequence from={2608} durationInFrames={255} name="SceneEntryPhones · TikTok/X + ???? labels">
      <SceneEntryPhones />
    </Sequence>

    {/* Four centred phone clips (same size/pos as the entry-point phones), each
        fading out at its end. Placed at the frame ranges in their filenames. */}
    <Sequence from={2868} durationInFrames={310} name="frame 2868–3178 (phone)">
      <SceneFramePhone video="frame-2868-3178.mp4" dur={310} />
    </Sequence>
    <Sequence from={3354} durationInFrames={785} name="frame 3354–4139 (phone)">
      <SceneFramePhone video="frame-3354-4139.mp4" dur={785} />
    </Sequence>
    <Sequence from={4139} durationInFrames={895} name="frame 4139–5034 (phone)">
      <SceneFramePhone video="frame-4139-5034.mp4" dur={895} />
    </Sequence>
    <Sequence from={5049} durationInFrames={951} name="frame 5049–6000 (phone)">
      <SceneFramePhone video="frame-5049-6000.mp4" dur={951} />
    </Sequence>

    {/* move A — S14–16 (3-item Concept list) at NV 1820; content ends 2136 then
        crossfades out over 2137→2151, revealing move 4 behind it. */}
    <Sequence from={1820} durationInFrames={331} name="move A · S14–16 (3 concepts) → crossfade @2137">
      <FadeBox fadeOutAt={317}>
        <Scene14to16 concepts={["Legendary investors", "Government-affiliated", "Special situations"]} />
      </FadeBox>
    </Sequence>
  </AbsoluteFill>
);
