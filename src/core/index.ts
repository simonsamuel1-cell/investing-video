/**
 * core/index.ts — the single import surface for episodes.
 *
 *     import { Stage, Card, Layer, Chip, Title, theme } from "../../core";
 *
 * An episode should never deep-import a core file, and never redefine one of
 * these locally. If something here does not fit a scene, the fix is a prop or a
 * new core component — not a copy in the episode folder. Copying is exactly how
 * seven episodes ended up with five different SafeAreas.
 */
export { theme, frames, PALETTES, SHADOWS } from "./theme";
export type { Palette, PaletteName } from "./theme";

export { PaletteProvider, usePalette, useShadow, DEFAULT_SEGMENTS } from "./palette";
export type { Segment } from "./palette";

export { useMotion } from "./useMotion";

export * from "./helpers";

export { Stage, Card, Layer } from "./Stage";
export { Title, Line, Words } from "./Text";
export { Chip } from "./Chip";
export type { Tone } from "./Chip";
export { Ping } from "./Ping";
export { HighlightBox, HighlightCircle } from "./HighlightBox";
export type { HLRect } from "./HighlightBox";
export { Captions } from "./Captions";
export type { Cue } from "./Captions";
export { Watermark } from "./Watermark";
export { TuntunMark } from "./TuntunMark";
export { SourceTag } from "./SourceTag";

/* ── Tier 2 — the chart engine ─────────────────────────────────────────────
 * Series constructors, the shared grid, candles, indicators and annotations.
 * A scene imports what it draws; it never writes a chart primitive itself. */
export * from "./chart";

/* ── Tier 3 — recurring patterns ───────────────────────────────────────── */
export { Panel, StatCard, KeyPoint } from "./Panel";
export { StepRail, ChapterCard } from "./StepRail";
export type { Step } from "./StepRail";
export { Countdown } from "./Countdown";
export { ColorKey } from "./ColorKey";
export type { KeyEntry } from "./ColorKey";
export { StatStrip } from "./StatStrip";
export type { Stat } from "./StatStrip";
export { ComboTable } from "./ComboTable";
export type { ComboRow } from "./ComboTable";
export { TimeframeTabs } from "./TimeframeTabs";
export { DeviceFrame, ScreenClip } from "./Screen";
export { SplitDivider, SplitLabels, splitRects } from "./Split";
