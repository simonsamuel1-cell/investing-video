/**
 * MODULE 01 — TECHNICAL ANALYSIS. Every TA video, one branch.
 *
 * The videos not yet approved (Concept Sector, Bandarmology, Event-Driven,
 * Technical Tab, Fair Value) moved to the `Unapproved_videos` branch on
 * 2026-09-24, checked out beside this one as `unapproved-videos/`. The two
 * branches share no source file: a video owns a folder, and nothing outside
 * that folder is allowed to change when it is edited.
 *
 * Two shapes of folder, because the videos were built in two eras:
 *
 *   1. `src/episodes/0NN-*`  — built on `src/core` (VIDEO 19, 20, 22).
 *   2. `src/episodeXxx/`     — self-contained older projects; they carry
 *                              their own theme, components and data.
 *
 * ⚠ COMPOSITION IDS MAY NOT CONTAIN UNDERSCORES, and they must be unique
 * across the whole file. Studio lists them in the order they appear here.
 */
import "./index.css";
import { Composition } from "remotion";

// ── built on src/core ───────────────────────────────────────────────────────
import { theme } from "./core";
import {
  MovingAverageComposition,
  TOTAL_FRAMES as MA_FRAMES,
} from "./episodes/019-moving-average/Composition";
import {
  VolumeComposition,
  TOTAL_FRAMES as V20_FRAMES,
} from "./episodes/020-volume/Composition";
import {
  TAMistakesComposition,
  TOTAL_FRAMES as V22_FRAMES,
} from "./episodes/022-ta-mistakes/Composition";

// ── migrated: self-contained projects ───────────────────────────────────────
import {
  CandlestickComposition,
  TOTAL_FRAMES as CANDLE_FRAMES,
} from "./episodeCandlestick/Composition";
import { theme as candleTheme } from "./episodeCandlestick/theme";
import { SUBTITLES as CANDLE_SUBS } from "./episodeCandlestick/subtitles";
import { SUBTITLES_INDO as CANDLE_SUBS_INDO } from "./episodeCandlestick/subtitlesIndo";
import {
  ChartMemoryComposition,
  TOTAL_FRAMES as CHART_FRAMES,
} from "./episodeChartMemory/Composition";
import {
  MarketStructureComposition,
  TOTAL_FRAMES as MS_FRAMES,
} from "./episode20marketstructure/Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Sorted by name: Studio lists compositions in the order they are
          registered here. Keep new ones in their place in that order. */}
      {/* ═══ TA01 — Memahami Pergerakan Pasar dari Grafik ════════════════ */}
      {/* Was "ChartMemory". The one hyphen separates the module code from the
          title; the title itself runs together because a Remotion id takes only
          a-z A-Z 0-9 and "-" — no spaces, no underscores, not even a full stop.
          The branch name spells it differently for the same reason in reverse:
          git allows "_" and Simon prefers it there. */}
      <Composition
        id="TA01-MemahamiPergerakanPasarDariGrafik"
        component={ChartMemoryComposition}
        durationInFrames={CHART_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* ═══ TA03 — Candlestick Intermediate (Indonesian cut) ═════════════ */}
      <Composition
        id="TA03-CandlestickIntermediate"
        component={CandlestickComposition}
        durationInFrames={CANDLE_FRAMES}
        fps={candleTheme.canvas.fps}
        width={candleTheme.canvas.width}
        height={candleTheme.canvas.height}
        defaultProps={{
          subtitles: CANDLE_SUBS_INDO,
          audioSrc: "vo-indo.mp3",
          showSubtitles: false,
          muted: false,
        }}
      />
      {/* ═══ TA03 — Candlestick Intermediate (English cut) ════════════════ */}
      <Composition
        id="TA03-CandlestickIntermediateEnglish"
        component={CandlestickComposition}
        durationInFrames={CANDLE_FRAMES}
        fps={candleTheme.canvas.fps}
        width={candleTheme.canvas.width}
        height={candleTheme.canvas.height}
        defaultProps={{ subtitles: CANDLE_SUBS, audioSrc: "vo.mp3" }}
      />
      {/* ═══ Market Structure ═════════════════════════════════════════════ */}
      <Composition
        id="TA05-MarketStructure"
        component={MarketStructureComposition}
        durationInFrames={MS_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* ═══ Built on src/core ════════════════════════════════════════════ */}
      {/* VIDEO 19 — Moving Averages & Bollinger Bands, migrated onto src/core.
          Still 30fps: the 60fps conversion is a separate pass, so a difference
          that shows up here can only have come from core. */}
      <Composition
        id="TA07-MAdanBB"
        component={MovingAverageComposition}
        durationInFrames={MA_FRAMES}
        fps={30}
        width={theme.canvas.width}
        height={theme.canvas.height}
      />
      {/* VIDEO 20 — Volume. Built on src/core at 60fps; every frame number
          comes from the corrected SRT via docs/Video20_Volume_Script_SYNCED.md. */}
      <Composition
        id="TA09-Volume"
        component={VolumeComposition}
        durationInFrames={V20_FRAMES}
        fps={60}
        width={theme.canvas.width}
        height={theme.canvas.height}
      />
      {/* VIDEO 22 — Common Mistakes in Technical Analysis. 60fps; every frame
          number comes from the corrected SRT via
          docs/Video22_TA_Mistakes_Script_SYNCED.md. The tail past 16620 is the
          closing card held for three seconds. */}
      <Composition
        id="TA11-TAMistakes"
        component={TAMistakesComposition}
        durationInFrames={V22_FRAMES}
        fps={60}
        width={theme.canvas.width}
        height={theme.canvas.height}
      />
    </>
  );
};
