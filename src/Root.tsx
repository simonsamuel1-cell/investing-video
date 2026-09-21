/**
 * EVERY EPISODE, ONE BRANCH.
 *
 * Each video used to live on a branch of its own and could only be opened by
 * checking that branch out. They are all mounted here instead, and the rule
 * that makes that safe is ISOLATION: a video owns a folder, and nothing
 * outside that folder is allowed to change when it is edited.
 *
 * Three shapes of folder, because the videos were built in three eras:
 *
 *   1. `src/episodes/0NN-*`  — built on `src/core` (VIDEO 19, 20, 22).
 *   2. `src/episodeXxx/`     — self-contained older projects; they carry
 *                              their own theme, components and data.
 *   3. `src/Video.tsx` + `src/scenes` + `src/theme.ts` + `src/components`
 *                            — the ORIGINAL Concept Sector base, shared by
 *                              ConceptSectorTutorial, Bandarmology and
 *                              eventDriven, whose branches had it byte for
 *                              byte identical.
 *
 * ⚠ THE SHARED BASE IS SHARED. Editing `src/theme.ts`, `src/scenes/` or
 * `src/components/` changes those three videos at once. The two branches that
 * had FORKED that base — technical-tab and the Concept Sector revision — were
 * given private copies (`episodeTechnicalTab/`, `episodeConceptSectorRev/`)
 * precisely so their edits could not reach back into it.
 *
 * ⚠ COMPOSITION IDS MAY NOT CONTAIN UNDERSCORES, and they must be unique
 * across the whole file — which is why the revision's tutorial is registered
 * as "ConceptSectorTutorial-Rev" rather than under its original id.
 */
import "./index.css";
import { Composition } from "remotion";

// ── the shared Concept Sector base ──────────────────────────────────────────
import { ConceptSectorVideo } from "./Video";
import { DURATION, FPS, FRAME } from "./theme";

// ── built on src/core ───────────────────────────────────────────────────────
import { theme } from "./core";
import {
  MovingAverageComposition,
  TOTAL_FRAMES as MA_FRAMES,
} from "./episodes/019-moving-average/Composition";
import { VolumeComposition, TOTAL_FRAMES as V20_FRAMES } from "./episodes/020-volume/Composition";
import {
  TAMistakesComposition,
  TOTAL_FRAMES as V22_FRAMES,
} from "./episodes/022-ta-mistakes/Composition";

// ── migrated: videos that sit on the shared base ────────────────────────────
import { Bandarmology } from "./episodeBandarmology/Composition";
import {
  DURATION as BANDAR_DURATION,
  FPS as BANDAR_FPS,
  FRAME as BANDAR_FRAME,
} from "./episodeBandarmology/theme";
import { EventDrivenVideo } from "./episodeEventDriven/Composition";

// ── migrated: videos with a private copy of the base ────────────────────────
import { TechnicalTabEp } from "./episodeTechnicalTab/Video";
import {
  DURATION as TT_DURATION,
  FPS as TT_FPS,
  FRAME as TT_FRAME,
} from "./episodeTechnicalTab/theme";
import {
  ConceptSectorVideo as ConceptSectorVideoRev,
  PreviousCut,
} from "./episodeConceptSectorRev/Video";
import {
  DURATION as CSR_DURATION,
  FPS as CSR_FPS,
  FRAME as CSR_FRAME,
} from "./episodeConceptSectorRev/theme";

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
  ChartMemoryComposition as ChartMemory2Composition,
  TOTAL_FRAMES as CHART2_FRAMES,
} from "./episodeChartMemory2/Composition";
import {
  MarketStructureComposition,
  TOTAL_FRAMES as MS_FRAMES,
} from "./episode20marketstructure/Composition";
import { MyComposition as FairValueComposition } from "./episodeFairValue/Composition";
import { waitUntilDone as fairValueFontsReady } from "./episodeFairValue/fonts";

/** Fair Value waited on its own font load before rendering; it still does. */
fairValueFontsReady();

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ═══ Concept Sector ═══════════════════════════════════════════════ */}
      <Composition
        id="ConceptSectorTutorial"
        component={ConceptSectorVideo}
        durationInFrames={DURATION}
        fps={FPS}
        width={FRAME.width}
        height={FRAME.height}
      />
      {/* The LATER cut of the same video, from the Concept-Sector-Revision
          branch. Kept beside the original rather than replacing it: the two
          are different edits and only Simon can say which is current. */}
      <Composition
        id="ConceptSectorTutorial-Rev"
        component={ConceptSectorVideoRev}
        durationInFrames={CSR_DURATION}
        fps={CSR_FPS}
        width={CSR_FRAME.width}
        height={CSR_FRAME.height}
      />
      {/* Reference only — the full PREVIOUS cut, to scrub for timestamps. */}
      <Composition
        id="ConceptSector-PreviousCut"
        component={PreviousCut}
        durationInFrames={6928}
        fps={CSR_FPS}
        width={CSR_FRAME.width}
        height={CSR_FRAME.height}
      />

      {/* ═══ Bandarmology ═════════════════════════════════════════════════ */}
      <Composition
        id="Bandarmology"
        component={Bandarmology}
        durationInFrames={BANDAR_DURATION}
        fps={BANDAR_FPS}
        width={BANDAR_FRAME.width}
        height={BANDAR_FRAME.height}
      />

      {/* ═══ Event-Driven Trading ═════════════════════════════════════════ */}
      <Composition
        id="eventDriven"
        component={EventDrivenVideo}
        durationInFrames={6370}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ═══ Technical Tab ════════════════════════════════════════════════ */}
      <Composition
        id="TechnicalTabPreview"
        component={TechnicalTabEp}
        durationInFrames={TT_DURATION}
        fps={TT_FPS}
        width={TT_FRAME.width}
        height={TT_FRAME.height}
      />

      {/* ═══ Fair Value ═══════════════════════════════════════════════════ */}
      <Composition
        id="FairValue2"
        component={FairValueComposition}
        durationInFrames={6919}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ═══ The Chart is the Market's Memory ═════════════════════════════ */}
      <Composition
        id="ChartMemory"
        component={ChartMemoryComposition}
        durationInFrames={CHART_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* ⚠ ChartMemory2 is the FROZEN BACKUP, with its own copy of every
          scene and data file. Editing one never touches the other. */}
      <Composition
        id="ChartMemory2"
        component={ChartMemory2Composition}
        durationInFrames={CHART2_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ═══ Candlestick Intermediate ═════════════════════════════════════ */}
      <Composition
        id="candlestickControl"
        component={CandlestickComposition}
        durationInFrames={CANDLE_FRAMES}
        fps={candleTheme.canvas.fps}
        width={candleTheme.canvas.width}
        height={candleTheme.canvas.height}
        defaultProps={{ subtitles: CANDLE_SUBS, audioSrc: "vo.mp3" }}
      />
      <Composition
        id="Candlestick-Indo"
        component={CandlestickComposition}
        durationInFrames={CANDLE_FRAMES}
        fps={candleTheme.canvas.fps}
        width={candleTheme.canvas.width}
        height={candleTheme.canvas.height}
        defaultProps={{
          subtitles: CANDLE_SUBS_INDO,
          audioSrc: "vo-indo.mp3",
          showSubtitles: false,
          muted: true,
        }}
      />

      {/* ═══ Market Structure ═════════════════════════════════════════════ */}
      <Composition
        id="MarketStructure2"
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
        id="MovingAverage019"
        component={MovingAverageComposition}
        durationInFrames={MA_FRAMES}
        fps={30}
        width={theme.canvas.width}
        height={theme.canvas.height}
      />
      {/* VIDEO 20 — Volume. Built on src/core at 60fps; every frame number
          comes from the corrected SRT via docs/Video20_Volume_Script_SYNCED.md. */}
      <Composition
        id="Volume020"
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
        id="TAMistakes022"
        component={TAMistakesComposition}
        durationInFrames={V22_FRAMES}
        fps={60}
        width={theme.canvas.width}
        height={theme.canvas.height}
      />
    </>
  );
};
