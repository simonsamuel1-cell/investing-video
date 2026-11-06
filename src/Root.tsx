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
import { MovingAverageFull, TA07_FULL_FRAMES } from "./episodes/019-moving-average/FullVideo";
import { VolumeFull, TA09_FULL_FRAMES } from "./episodes/020-volume/FullVideo";
import { TAMistakesFull, TA11_FULL_FRAMES } from "./episodes/022-ta-mistakes/FullVideo";
import { PassiveIncomeFull, FULL_FRAMES as IN01_FULL_FRAMES } from "./episodes/in01-passive-income/FullVideo";
import { MembeliSahamFull, VI02_FULL_FRAMES } from "./episodes/vi02-membeli-saham-berarti-membeli-perusahaan/FullVideo";
import { RizkyComps } from "./RizkyComps";
import { InvestasiYangCocokFull, IN04_FULL_FRAMES } from "./episodes/in04-investasi-yang-cocok/FullVideo";
import { TEMPLATE_MAP_FRAMES, TemplateMap } from "./episodes/in04-investasi-yang-cocok/TemplateMap";
import { IsoFactory } from "./episodes/vi02-membeli-saham-berarti-membeli-perusahaan/components/IsoFactory";
import { IsoPlant } from "./episodes/vi02-membeli-saham-berarti-membeli-perusahaan/components/IsoPlant";
import { CaraTuntunMembantuFull, IN07_FULL_FRAMES } from "./episodes/in07-cara-tuntun-membantu-investor/FullVideo";

// ── migrated: self-contained projects ───────────────────────────────────────
import {
  CandlestickComposition,
  TOTAL_FRAMES as CANDLE_FRAMES,
} from "./episodeCandlestick/Composition";
import { theme as candleTheme } from "./episodeCandlestick/theme";
import { SUBTITLES as CANDLE_SUBS } from "./episodeCandlestick/subtitles";
import { CandlestickIndoFull, TA03_FULL_FRAMES } from "./episodeCandlestick/FullVideo";
import { ChartMemoryFull, TA01_FULL_FRAMES } from "./episodeChartMemory/FullVideo";
import { MarketStructureFull, TA05_FULL_FRAMES } from "./episode20marketstructure/FullVideo";
import { VisualLab, LAB_FRAMES } from "./lab/Lab";

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
      {/* Since 20 Oct 2026 the full video: Intro + episode + next-video ending + Outro + BGM (FullVideo.tsx), so a
          Studio frame here is the episode frame + 120. */}
      <Composition
        id="TA01-MemahamiPergerakanPasarDariGrafik"
        component={ChartMemoryFull}
        durationInFrames={TA01_FULL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* ═══ TA03 — Candlestick Intermediate (Indonesian cut) ═════════════ */}
      {/* Since 20 Oct 2026 the full video (FullVideo.tsx passes the Indonesian props itself): Studio frame = episode
          frame + 120. */}
      <Composition
        id="TA03-CandlestickIntermediate"
        component={CandlestickIndoFull}
        durationInFrames={TA03_FULL_FRAMES}
        fps={candleTheme.canvas.fps}
        width={candleTheme.canvas.width}
        height={candleTheme.canvas.height}
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
      {/* Since 20 Oct 2026 the full video (FullVideo.tsx): Studio frame = episode frame + 120. */}
      <Composition
        id="TA05-MarketStructure"
        component={MarketStructureFull}
        durationInFrames={TA05_FULL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* ═══ Built on src/core ════════════════════════════════════════════ */}
      {/* VIDEO 19 — Moving Averages & Bollinger Bands, migrated onto src/core.
          Still 30fps: the 60fps conversion is a separate pass, so a difference
          that shows up here can only have come from core. */}
      {/* Since 20 Oct 2026 the full video (FullVideo.tsx): Studio frame = episode frame + 120. */}
      <Composition
        id="TA07-MAdanBB"
        component={MovingAverageFull}
        durationInFrames={TA07_FULL_FRAMES}
        fps={30}
        width={theme.canvas.width}
        height={theme.canvas.height}
      />
      {/* VIDEO 20 — Volume. Built on src/core at 60fps; every frame number
          comes from the corrected SRT via docs/Video20_Volume_Script_SYNCED.md.
          Since 20 Oct 2026 the full video: Intro + episode (+ SC21 over TA09-Outro.mp3) + Outro, so a Studio
          frame here is the episode frame + 240. */}
      <Composition
        id="TA09-Volume"
        component={VolumeFull}
        durationInFrames={TA09_FULL_FRAMES}
        fps={60}
        width={theme.canvas.width}
        height={theme.canvas.height}
      />
      {/* VIDEO 22 — Common Mistakes in Technical Analysis. 60fps; every frame
          number comes from the corrected SRT via
          docs/Video22_TA_Mistakes_Script_SYNCED.md. The tail past 16620 is the
          closing card held for three seconds. Since 20 Oct 2026 the closing card fades out
          into CTA.mp4 (FullVideo.tsx); no intro, so the frame numbers are unchanged. */}
      <Composition
        id="TA11-TAMistakes"
        component={TAMistakesFull}
        durationInFrames={TA11_FULL_FRAMES}
        fps={60}
        width={theme.canvas.width}
        height={theme.canvas.height}
      />
      {/* IN01 — Passive Income, finished: Intro + the episode + Outro, the BGM underneath (FullVideo.tsx). Not a TA video:
          built on src/core at 60fps; the episode's frame numbers sit INTRO_FRAMES (240) later in this timeline. */}
      <Composition
        id="IN01-PassiveIncome"
        component={PassiveIncomeFull}
        durationInFrames={IN01_FULL_FRAMES}
        fps={60}
        width={theme.canvas.width}
        height={theme.canvas.height}
      />
      {/* IN04 — Investasi yang Cocok: Intro + episode + Outro + BGM. VO + subtitles only for now (no visuals). */}
      <Composition
        id="IN04-InvestasiYangCocok"
        component={InvestasiYangCocokFull}
        durationInFrames={IN04_FULL_FRAMES}
        fps={60}
        width={theme.canvas.width}
        height={theme.canvas.height}
      />
      {/* IN04 before the 2 Nov route-map revision — the switch's "before" side (components/PetaSwitch.tsx). */}
      <Composition
        id="IN04-InvestasiYangCocok-Sebelum"
        component={InvestasiYangCocokFull}
        durationInFrames={IN04_FULL_FRAMES}
        fps={60}
        width={theme.canvas.width}
        height={theme.canvas.height}
        defaultProps={{ petaBaru: false }}
      />
      {/* IN07 — Cara Tuntun Membantu Investor Mengurangi Kesalahan: Intro + episode + Outro + BGM. Visuals, VO + subtitles. */}
      <Composition
        id="IN07-CaraTuntunMembantuInvestorMengurangiKesalahan"
        component={CaraTuntunMembantuFull}
        durationInFrames={IN07_FULL_FRAMES}
        fps={60}
        width={theme.canvas.width}
        height={theme.canvas.height}
      />
      {/* VI02 — Membeli Saham Berarti Membeli Perusahaan: Intro + episode + Outro + BGM. */}
      <Composition
        id="VI02-MembeliSahamBerartiMembeliPerusahaan"
        component={MembeliSahamFull}
        durationInFrames={VI02_FULL_FRAMES}
        fps={60}
        width={theme.canvas.width}
        height={theme.canvas.height}
      />
      {/* The IN04 template map (the harbour map, its three routes and the house); its SHOW lever still has the
          stickman walk test (front and profile). Was "Stickman-Walk" until 3 Nov. */}
      {/* The isometric plant Simon asked to recreate (6 Nov), on its own until he says where it goes. */}
      <Composition
        id="Template-iso-plant"
        component={IsoPlant}
        durationInFrames={300}
        fps={60}
        width={theme.canvas.width}
        height={theme.canvas.height}
      />
      {/* Simon's factory.svg in the plant's style (6 Nov). */}
      <Composition
        id="Template-iso-factory"
        component={IsoFactory}
        durationInFrames={300}
        fps={60}
        width={theme.canvas.width}
        height={theme.canvas.height}
      />
      <Composition
        id="Template-map"
        component={TemplateMap}
        durationInFrames={TEMPLATE_MAP_FRAMES}
        fps={60}
        width={theme.canvas.width}
        height={theme.canvas.height}
      />
      {/* ⚠ A BENCH, NOT AN EPISODE — src/lab/Lab.tsx. One visual language at a
          time, judged on its own before anything is built with it. Nothing
          here ships; the lever is `TEST` in that file. */}
      <Composition
        id="AI-Motion-Experiment"
        component={VisualLab}
        durationInFrames={LAB_FRAMES}
        fps={60}
        width={theme.canvas.width}
        height={theme.canvas.height}
      />
      <RizkyComps />
    </>
  );
};
