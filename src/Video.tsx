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
import {
  AbsoluteFill,
  Audio,
  Freeze,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
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
import { SceneEntryTags } from "./scenes/SceneEntryTags";
import { SceneFramePhone } from "./scenes/SceneFramePhone";
import { SceneClipNotes } from "./scenes/SceneClipNotes";
import { SceneCatalyst } from "./scenes/SceneCatalyst";
import { SceneWhichSectors } from "./scenes/SceneWhichSectors";
import { SceneGoldHighlight } from "./scenes/SceneGoldHighlight";
import { SceneFilterNote } from "./scenes/SceneFilterNote";
import { SceneStocksHighlight } from "./scenes/SceneStocksHighlight";
import { SceneTopGainersHighlight } from "./scenes/SceneTopGainersHighlight";
import { SceneSectorsHighlight } from "./scenes/SceneSectorsHighlight";
import { SceneSisterNotes } from "./scenes/SceneSisterNotes";
import { SceneColumnHighlight } from "./scenes/SceneColumnHighlight";
import { SceneForeignFlowHighlight } from "./scenes/SceneForeignFlowHighlight";
import { SceneSpikeNotes } from "./scenes/SceneSpikeNotes";
import { SceneQuietNotes } from "./scenes/SceneQuietNotes";
import { SceneAskAI } from "./scenes/SceneAskAI";
import { SceneSortNotes } from "./scenes/SceneSortNotes";
import { SceneFindNotes } from "./scenes/SceneFindNotes";
import { SceneRecapText } from "./scenes/SceneRecapText";
import { SceneValidateNote } from "./scenes/SceneValidateNote";
import { Scene32 } from "./scenes/Scene32";
import { COLORS, MOUNT_VO } from "./theme";
import { fontFamily } from "./fonts";

// The old cut expressed as clips (OLD from/dur + component). Merged scenes are
// represented by their continuity block, not individually.
const MERGED = new Set([
  12, 13, 14, 15, 16, 19, 20, 21, 23, 24, 25, 26, 27, 28,
]);
type Clip = { from: number; dur: number; Comp: FC; name: string };
const OLD_CLIPS: Clip[] = [
  ...TIMELINE.filter((s) => !MERGED.has(s.n)).map((s) => ({
    from: s.from,
    dur: s.dur,
    Comp: SCENES[s.n - 1] as FC,
    name: `S${s.n}`,
  })),
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
  // src starts at 4826 (was 4790) so the short S22 fragment that used to sit at
  // 6004–6039 is dropped, and the S23–28 block now lands on 6004 instead of 6040.
  { src: [4826, 5814], dst: 6004, label: "5" }, // → NV 6004–6992
  // move "6" was src [6523,6902]→7047, which produced S30 at 7047–7274, S31 at
  // 7275–7387 and S32 at 7388–7425. S30 is now dropped (texts take 7047–7243) and the
  // other two are pulled forward, so it is split into two entries:
  { src: [6751, 6864], dst: 7244, label: "6a" }, // S31 → NV 7244–7357
  { src: [6864, 6902], dst: 7360, label: "6b" }, // S32 → NV 7360–7398 (then frozen)
  // move "A" (PrC 2756–3131 S14–16 → 1820) is custom-mounted below with a 3-item Concept list.
];

// Reference-only: the FULL previous cut (all clips at their ORIGINAL frames + the
// OLD padded VO). Registered as its own composition so Simon can scrub it and read
// off timestamps to copy into MOVES. Old duration was 6928.
export const PreviousCut = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.silver, fontFamily }}>
    <Audio src={staticFile("Most_traders_start__1__padded.mp3")} />
    {OLD_CLIPS.map((c) => {
      const { Comp } = c;
      return (
        <Sequence
          key={c.name}
          from={c.from}
          durationInFrames={c.dur}
          name={c.name}
        >
          <Comp />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);

// Fades its children out starting at scene-local frame `fadeOutAt` (for crossfades).
const FadeBox = ({
  fadeOutAt,
  fadeOutDur = 14,
  children,
}: {
  fadeOutAt: number;
  fadeOutDur?: number;
  children: ReactNode;
}) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [fadeOutAt, fadeOutAt + fadeOutDur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

export const ConceptSectorVideo = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.silver, fontFamily }}>
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
          <Sequence
            key={`m${m.label}-${c.name}`}
            from={start + offset}
            durationInFrames={len}
            name={`move ${m.label} · ${c.name}`}
          >
            <Sequence from={-L0} durationInFrames={c.dur}>
              <Comp />
            </Sequence>
          </Sequence>,
        ];
      });
    })}

    {/* New content — freeze S1 @351, isolate EXCL, buy, floating loss; dims to a 20%
        frozen bg + "NOISE" at 595, then fades out to end scene 1 at 693. */}
    <Sequence
      from={351}
      durationInFrames={342}
      name="Scene01Focus · EXCL freeze → buy → loss → NOISE (ends 693)"
    >
      <Scene01Focus />
    </Sequence>

    {/* Theme grid → ABCD → "????" scan → ABCD highlight (700→1349). */}
    <Sequence
      from={700}
      durationInFrames={650}
      name="SceneThemeGrid · grid → ABCD → ???? scan → ABCD (ends 1349)"
    >
      <SceneThemeGrid />
    </Sequence>

    {/* move 3 — S12–13 continuation (tags removed). Plays block-local 270→378 over
        1686→1794, then FREEZES at 378 (kills the page-scroll) and holds to 1819. */}
    <Sequence
      from={1686}
      durationInFrames={108}
      name="move 3 · S12–13 (no tags)"
    >
      <Sequence from={-270} durationInFrames={540} layout="none">
        <Scene12to13 hideTags />
      </Sequence>
    </Sequence>
    <Sequence
      from={1794}
      durationInFrames={26}
      name="move 3 freeze · S12–13 @378 (no scroll)"
    >
      <Freeze frame={378}>
        <Scene12to13 hideTags />
      </Freeze>
    </Sequence>

    {/* moves 4+B — ONE continuous S14–16 playback from block-local 424 (phone already
        CENTRED, so no entry slide). The video keeps rolling — no freeze, no cut — and
        flows straight into the "one screen, every angle" beat. NV 2137→2440, then the
        last S16 frame holds and fades out, ending at 2454. Revealed by move A's crossfade. */}
    <Sequence
      from={2137}
      durationInFrames={303}
      name="moves 4+B · One owner → every angle (continuous)"
    >
      <Sequence from={-424} durationInFrames={728} layout="none">
        <Scene14to16 />
      </Sequence>
    </Sequence>
    <Sequence
      from={2440}
      durationInFrames={14}
      name="moves 4+B tail · hold + fade out (ends 2454)"
    >
      <FadeBox fadeOutAt={0} fadeOutDur={14}>
        <Freeze frame={726}>
          <Scene14to16 />
        </Freeze>
      </FadeBox>
    </Sequence>

    {/* text beat — "Different entry points" (2467) → "Same tool" (2537); out by 2595. */}
    <Sequence
      from={2455}
      durationInFrames={140}
      name="SceneEntryPoints · different entry points → same tool"
    >
      <SceneEntryPoints />
    </Sequence>

    {/* TikTok/X entry-point phones + five "????" stock labels (2608→2863). */}
    <Sequence
      from={2608}
      durationInFrames={255}
      name="SceneEntryPhones · TikTok/X + ???? labels"
    >
      <SceneEntryPhones />
    </Sequence>

    {/* Four entry-point tags as a persistent step-highlight row above the phones
        (2598→6000). Highlights #1 @2598, #2 @3178, #3 @4139, #4 @5049 — one at a time. */}
    <Sequence
      from={2598}
      durationInFrames={3402}
      name="SceneEntryTags · 4 tags step-highlight (2598→6000)"
    >
      <SceneEntryTags total={3402} />
    </Sequence>

    {/* Four centred phone clips (same size/pos as the entry-point phones), each
        fading out at its end. Placed at the frame ranges in their filenames. */}
    <Sequence from={2868} durationInFrames={310} name="frame 2868–3178 (phone)">
      <SceneFramePhone video="frame-2868-3178.mp4" dur={310} />
    </Sequence>

    {/* Three text notes beside that phone: "Search at Concept Sector" @2876,
        "…worth checking" @2931, "…probably noise." @3088; all out with the clip @3178. */}
    <Sequence
      from={2876}
      durationInFrames={302}
      name="SceneClipNotes · worth checking / probably noise (2876→3178)"
    >
      <SceneClipNotes />
    </Sequence>

    {/* Between the phone clips: "A catalyst hits" @3183 → "US-Iran tensions escalate"
        @3232; both out by 3291 (the tag row above keeps running). */}
    <Sequence
      from={3183}
      durationInFrames={108}
      name="SceneCatalyst · A catalyst hits → US-Iran tensions escalate (3183→3291)"
    >
      <SceneCatalyst />
    </Sequence>

    {/* "Which sectors benefit?" — bridges the catalyst text to the chat clip. */}
    <Sequence
      from={3294}
      durationInFrames={60}
      name="SceneWhichSectors · Which sectors benefit? (3294→3354)"
    >
      <SceneWhichSectors />
    </Sequence>
    {/* fadeDur 1: this clip runs straight into frame-4139-5034 at 4139, so it must NOT
        dissolve early — it holds full opacity and hands over on 4138→4139. The other
        clips keep the 14f fade because each is followed by an empty silver gap. */}
    <Sequence from={3354} durationInFrames={785} name="frame 3354–4139 (phone)">
      <SceneFramePhone video="frame-3354-4139.mp4" dur={785} fadeDur={1} />
    </Sequence>

    {/* Overlays ON TOP of the chat clip (mounted after it so they sit above the
        phone): highlight the Gold block (3600→3690), then the "Filter by …" note. */}
    <Sequence
      from={3358}
      durationInFrames={369}
      name="SceneAskAI · Ask Tuntun AI (3358→3727)"
    >
      <SceneAskAI />
    </Sequence>
    <Sequence
      from={3600}
      durationInFrames={90}
      name="SceneGoldHighlight · Gold Ecosystem → Gold Sector (3600→3690)"
    >
      <SceneGoldHighlight />
    </Sequence>
    <Sequence
      from={3824}
      durationInFrames={296}
      name="SceneFilterNote · Filter by … (3824→4120)"
    >
      <SceneFilterNote />
    </Sequence>
    <Sequence
      from={3978}
      durationInFrames={142}
      name="SceneStocksHighlight · cyan box around stocks list (3978→4120)"
    >
      <SceneStocksHighlight />
    </Sequence>

    <Sequence from={4139} durationInFrames={895} name="frame 4139–5034 (phone)">
      <SceneFramePhone video="frame-4139-5034.mp4" dur={895} />
    </Sequence>

    {/* HL boxes over that clip (mounted after it so they sit on top). */}
    <Sequence
      from={4139}
      durationInFrames={92}
      name="SceneTopGainersHighlight · KBLV/PSDN/CTTH/RONY/AGAR rows (4139→4231)"
    >
      <SceneTopGainersHighlight />
    </Sequence>
    <Sequence
      from={4391}
      durationInFrames={71}
      name="SceneSectorsHighlight · IDX Sectors / Tuntun Sector / Group (4391→4462)"
    >
      <SceneSectorsHighlight />
    </Sequence>

    {/* Notes beside that clip: "Why does a stock spike?" @4140, "Find the reason at
        Concept Sector" @4259; both out by 4564. */}
    <Sequence
      from={4140}
      durationInFrames={424}
      name="SceneSpikeNotes · why does a stock spike / find the reason (4140→4564)"
    >
      <SceneSpikeNotes />
    </Sequence>

    {/* Notes beside that clip: "Look for sister stocks…" @4583, "Use the filter again"
        @4710; both out with the clip at 5034. */}
    <Sequence
      from={4583}
      durationInFrames={451}
      name="SceneSisterNotes · sister stocks / use the filter again (4583→5034)"
    >
      <SceneSisterNotes />
    </Sequence>
    {/* fadeInDur 12: this clip follows a 15-frame empty gap (clip 3 ends 5034), so it
        fades up instead of popping in. The others hard-start — they follow a clip. */}
    <Sequence from={5049} durationInFrames={951} name="frame 5049–6000 (phone)">
      <SceneFramePhone video="frame-5049-6000.mp4" dur={951} fadeInDur={12} />
    </Sequence>

    {/* Notes beside that clip: "Quiet accumulation" @5037, "Across sectors, …" @5127. */}
    <Sequence
      from={5037}
      durationInFrames={258}
      name="SceneQuietNotes · quiet accumulation / across sectors (5037→5295)"
    >
      <SceneQuietNotes />
    </Sequence>

    {/* Two separate HL boxes on the sector table: the Price/Chg%/5D Chg% columns
        (5301→5405, held still), then just the words "Foreign Flow" (5405→5552). */}
    <Sequence
      from={5301}
      durationInFrames={104}
      name="SceneColumnHighlight · Price/Chg%/5D Chg% columns (5301→5405)"
    >
      <SceneColumnHighlight />
    </Sequence>
    <Sequence
      from={5405}
      durationInFrames={147}
      name="SceneForeignFlowHighlight · the words Foreign Flow (5405→5552)"
    >
      <SceneForeignFlowHighlight />
    </Sequence>

    {/* Notes beside that clip: "Sort by Foreign Flow" @5301 + "Find theme that has…"
        @5563 (out 5739); then "Find accumulated stock" @5782 + "Check the technicals"
        @5853 (out 5995). */}
    <Sequence
      from={5301}
      durationInFrames={438}
      name="SceneSortNotes · sort by Foreign Flow / find theme (5301→5739)"
    >
      <SceneSortNotes />
    </Sequence>
    <Sequence
      from={5782}
      durationInFrames={213}
      name="SceneFindNotes · find accumulated stock / check the technicals (5782→5995)"
    >
      <SceneFindNotes />
    </Sequence>

    {/* S23–28 tail — the block's LAST frame (local 987) frozen from 6992 and fading
        out so it is GONE at 7029. "validate on / chart pro" is baked into that frozen
        frame, so it ends at 7029 with it. */}
    <Sequence
      from={6992}
      durationInFrames={37}
      name="S23–28 tail · freeze last frame @6992 → fade out, gone by 7029"
    >
      <FadeBox fadeOutAt={23} fadeOutDur={14}>
        <Freeze frame={987}>
          <Scene23to27 />
        </Freeze>
      </FadeBox>
    </Sequence>

    {/* "validate on / chart pro" — its own scene so it survives past the block's end
        (6991) and its frozen tail, ending exactly at 7029. */}
    <Sequence from={6960} durationInFrames={69} name="SceneValidateNote · validate on / chart pro (6960→7029)">
      <SceneValidateNote />
    </Sequence>

    {/* Replaces the old S30 recap scene (was 7047–7274) with two centred lines. */}
    <Sequence
      from={7047}
      durationInFrames={196}
      name="SceneRecapText · isn't luck → a different level (7047→7243)"
    >
      <SceneRecapText />
    </Sequence>

    {/* S32 tail — the end card's last frame (local 37) frozen from 7398 and held to
        the end of the composition (7470). */}
    <Sequence
      from={7398}
      durationInFrames={72}
      name="S32 tail · freeze last frame → end of composition (7398→7470)"
    >
      <Freeze frame={37}>
        <Scene32 />
      </Freeze>
    </Sequence>

    {/* move A — S14–16 (3-item Concept list) at NV 1820; content ends 2136 then
        crossfades out over 2137→2151, revealing move 4 behind it. */}
    <Sequence
      from={1820}
      durationInFrames={331}
      name="move A · S14–16 (3 concepts) → crossfade @2137"
    >
      <FadeBox fadeOutAt={317}>
        <Scene14to16
          concepts={[
            "Legendary investors",
            "Government-affiliated",
            "Special situations",
          ]}
        />
      </FadeBox>
    </Sequence>
  </AbsoluteFill>
);
