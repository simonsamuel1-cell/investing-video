/**
 * Composition — "Technical Analysis: The Chart is the Market's Memory".
 * 10 scenes, 5400 frames (03:00.00). SC02–SC05 do NOT sit in INDEPENDENT_SCENES:
 * they live inside the single spanning ChartContinuity Sequence (390–2490) so
 * the chart element transforms across them without ever remounting.
 *
 * NOTE: every from/duration here is a 160 wpm ESTIMATE. §8 recalibration will
 * retime these against the recorded VO and cascade the downstream values.
 */
import React from "react";
import { AbsoluteFill, Sequence, Audio, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { theme } from "./theme";
import { ChartContinuity } from "./continuity/ChartContinuity";
import { Scene01 } from "./scenes/Scene01";
import { Scene06 } from "./scenes/Scene06";
import { Scene07 } from "./scenes/Scene07";
import { Scene08 } from "./scenes/Scene08";
import { Scene09 } from "./scenes/Scene09";
import { Scene10 } from "./scenes/Scene10";
import { Subtitles } from "./components/Subtitles";
import { PaletteProvider, usePalette } from "./palette";
import { SUBTITLES, type SubtitleCue } from "./subtitles";
import { HighLowBars, RoadmapStop, type Preview, type Stop } from "./continuity/Roadmap";
import { SmoothLines, BullishRectangle, HollowProjection } from "./continuity/RoadmapCards";

/**
 * 04:21.90 @30fps — the VO-locked 7827 (five inserts included) plus a 30-frame
 * tail. Simon, at 7826: "Di akhir scene, extend durasi 30 frame." The voice
 * ends where it did; the last frame holds for another second before the film
 * closes. The subtitles are untouched — there is nothing spoken to caption.
 */
export const TOTAL_FRAMES = 7857;

// Recorded VO: public/vo/chart-memory.mp3 ("VIDEO 01 - Chart.MP3"), 259.08s =
// 7769 frames. Every from/duration below and every scene-local beat is now
// derived from VIDEO_01_-_Chart_fixed.srt (106 cues) — not a wpm estimate.
//
// ⚠ FOUR PASSAGES WERE CUT IN, and every number after each one moved. Simon
// first gave the cuts as timecodes on the finished film — 487, 2482, 3714,
// 5187 — and each landed two to six frames short of a scene change. He then
// asked for them ON the change, which is what they are now:
//
//   cut at 489  +244f  "Tapi sebenarnya, kita nggak perlu memahami semuanya…"
//   cut at 2486 +302f  "Ya, jadi kita sudah punya dasar untuk membaca chart…"
//   cut at 3720 +290f  "Sampai di sini, kita sudah melihat bahwa satu saham…"
//   cut at 5192 +327f  "Sekarang kita sudah melihat bagaimana chart merekam…"
//
// ⚠ AND THE SCENE TABLE BELOW DID NOT CHANGE WHEN THEY MOVED. Each cut stayed
// inside the same scene and each scene grows by the same amount, so every
// boundary lands on the frame it already had. Only the audio and the cues
// shifted, by those two to six frames. Nothing inside a scene was ever
// retimed — only the boundaries, the two SlideCut frames, and phase D.
//
// The outgoing scene HOLDS through each window: a cut on the boundary is the
// last frame of what you were watching, not the first of what comes next.
//
// The audio was rebuilt sample-exact: 44100/30 = 1470 samples per frame, so
// every cut falls on a whole frame and each passage is padded with a few
// milliseconds of silence to fill its window exactly. Verified by correlating
// each inserted passage and each resumption against its source — r > 0.9998,
// lag 0. The previous track is kept as vo/chart-memory.pre-extend.mp3.
const HAS_VO = true;

/**
 * Brand watermark — a full-frame transparent PNG whose mark sits at
 * x 1538–1853, y 45–142, i.e. inside the 360×150 top-right clear zone every
 * scene already keeps empty. Drawn at full strength, and faded at both ends so
 * it doesn't pop on the first frame.
 */
const WATERMARK = { fade: 12, opacity: 1 };

const INDEPENDENT_SCENES: { from: number; duration: number; Component: React.FC }[] = [
  { from: 0, duration: 791, Component: Scene01 }, // 489 + 244 (cut 1) + 58 (the pause)
  // SC02–SC05 → ChartContinuity (spanning Sequence below), 791–3612
  { from: 3612, duration: 1002, Component: Scene06 }, // 712 + 290 (cut 3)
  { from: 4614, duration: 752, Component: Scene07 },
  { from: 5366, duration: 1047, Component: Scene08 }, // 720 + 327 (cut 4)
  { from: 6413, duration: 754, Component: Scene09 },
  { from: 7167, duration: 690, Component: Scene10 }, // +30: the closing hold
];

/**
 * ═══ THE ROADMAP'S FOUR STOPS ═══ (see continuity/Roadmap.tsx)
 *
 * ⚠ `end` IS THE NEXT CHAPTER'S FIRST FRAME, not a length. Each push is timed
 * to land exactly as the scene underneath begins — 791 is ChartContinuity's
 * mount, 3090 is phase D, 4614 is SC07, 6413 is SC09 — so these four numbers
 * are the same four that appear in the table above and must move with it.
 *
 * ⚠ AND EACH STOP SITS INSIDE ONE OF THE FOUR WINDOWS THE NEW VOICE-OVER
 * BOUGHT, which is the whole reason it fits: 489-791, 2788-3090, 4324-4614,
 * 6086-6413. The roadmap is what those windows were being held open for.
 * Stop 2 starts at 2749, thirty-nine frames BEFORE its window, because that is
 * where ChartContinuity's camera used to begin backing out to hand the chart
 * to the next scene continuously. With a new passage spoken in between there
 * is nothing to hand it to, so it folds into its card instead.
 */
/**
 * What each box shows — the same frame that lands in it, so a fold settles
 * onto a picture identical to itself. The last box has nothing folded into it
 * (the film ends inside it), so it takes a frame from its own chapter.
 */
const PREVIEWS: Preview[] = [
  { freeze: 2028, Component: ChartContinuity }, // Memahami Basic — global 2819, the zoomed chart stop 2 folds
  { freeze: 710, Component: Scene06 }, // Alur Grafik
  { freeze: 719, Component: Scene08 }, // Perilaku Pasar
  { freeze: 545, Component: Scene09 }, // Ilusi Kepastian
];

const STOPS: Stop[] = [
  /* ⚠ STOP 1 OVERRIDES ITS FIRST CARD, and only stop 1. Nothing of chapter
     one has been seen yet when this roadmap appears, so Memahami Basic shows
     a drawn price series instead of a still from a scene the viewer is about
     to watch. From stop 2 on it carries the picture that folded into it. */
  {
    at: 620, land: null, push: 719, into: 0, end: 791, freeze: 619, Component: Scene01,
    /* ⚠ ALL FOUR BOXES ARE DRAWINGS AT THIS STOP — see RoadmapCards. */
    previews: [{ Draw: HighLowBars }, { Draw: SmoothLines }, { Draw: BullishRectangle }, { Draw: HollowProjection }],
    glow: 0,
  },
  /* ⚠ STOP 2 FOLDS AT 2820, NOT 2749 — Simon: "Preview mengecil/zoom out di
     2820 aja mulainya." The zoomed chart holds until then and the frame just
     before (continuity-local 2028) is what folds. Its boxes 2–4 are the first
     stop's drawings: "visual di kanan atas, kanan bawah, kiri bawah; pake yang
     dari Scene Transisi pertama". */
  {
    at: 2820, land: 0, push: 2991, into: 1, end: 3090, freeze: 2028, Component: ChartContinuity,
    previews: [PREVIEWS[0], { Draw: SmoothLines }, { Draw: BullishRectangle }, { Draw: HollowProjection }],
  },
  /* ⚠ STOP 3: Perilaku Pasar and Ilusi Kepastian carry the first stop's
     drawings — Simon: "isi kotak Perilaku Pasar dan Ilusi Kepastian ubah jadi
     seperti scene transisi yang pertama." The first two boxes keep what
     folded into them. */
  {
    at: 4323, land: 1, push: 4533, into: 2, end: 4614, freeze: 710, Component: Scene06,
    previews: [PREVIEWS[0], PREVIEWS[1], { Draw: BullishRectangle }, { Draw: HollowProjection }],
  },
  /* ⚠ STOP 4: Ilusi Kepastian carries the first stop's drawing — Simon:
     "buat kotak kanan bawah visualnya sama seperti yang di scene transisi
     pertama." The push goes into it and leaves on the roadmap's dissolve. */
  {
    at: 6086, land: 2, push: 6253, into: 3, end: 6413, freeze: 719, Component: Scene08,
    previews: [PREVIEWS[0], PREVIEWS[1], PREVIEWS[2], { Draw: HollowProjection }],
  },
];

/**
 * Props exist so a SECOND composition can reuse this same component with its
 * own subtitle track and voice-over. Every scene is shared — editing a visual
 * changes both compositions.
 */
export type ChartMemoryProps = {
  subtitles?: SubtitleCue[];
  audioSrc?: string;
  showSubtitles?: boolean;
  muted?: boolean;
};

/** Wraps the tree so every component can read the frame's palette. */
export const ChartMemoryComposition = (props: ChartMemoryProps) => (
  <PaletteProvider>
    <Episode {...props} />
  </PaletteProvider>
);

const Episode = ({
  subtitles = SUBTITLES,
  audioSrc = "vo/chart-memory.mp3",
  showSubtitles = true,
  muted = false,
}: ChartMemoryProps) => {
  const pal = usePalette();
  const f = useCurrentFrame();
  const watermarkOpacity =
    interpolate(
      f,
      [0, WATERMARK.fade, TOTAL_FRAMES - WATERMARK.fade, TOTAL_FRAMES],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.motion.ease },
    ) * WATERMARK.opacity;
  return (
  <AbsoluteFill style={{ backgroundColor: pal.bg, fontFamily: theme.type.family }}>
    {INDEPENDENT_SCENES.map(({ from, duration, Component }) => (
      <Sequence key={from} from={from} durationInFrames={duration}>
        <Component />
      </Sequence>
    ))}

    {/* SC02 → SC05: ONE chart element, four phases, zero remounts. */}
    <Sequence from={791} durationInFrames={2821}>
      <ChartContinuity />
    </Sequence>

    {/* ⚠ THE ROADMAP SITS OVER EVERY SCENE, and must: each stop covers the
        scene it is folding up, and the last frames of each push dissolve off
        the top of the scene that has already started underneath. */}
    {STOPS.map((s) => (
      /* ⚠ NO <Sequence> — the stop windows itself, and it must. See the note
         on RoadmapStop: a Sequence would shift what <Freeze> means. */
      <RoadmapStop key={s.at} stop={s} previews={PREVIEWS} />
    ))}

    {/* Burned-in subtitles live in the reserved bottom band. */}
    {showSubtitles && <Subtitles cues={subtitles} />}

    {/* Brand watermark — above everything, present for the whole episode. */}
    <AbsoluteFill style={{ opacity: watermarkOpacity, zIndex: 100 }}>
      <Img src={staticFile("watermark.png")} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>

    {HAS_VO && <Audio src={staticFile(audioSrc)} muted={muted} />}
  </AbsoluteFill>
  );
};
