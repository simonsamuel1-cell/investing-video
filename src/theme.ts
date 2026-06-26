/**
 * Brand tokens for the Tuntun Academy "How To Use — Technical Tab" episode.
 * Every scene/component reads colours, sizes, radii and easing from here — there
 * is NO hardcoded hex or magic font-size anywhere else (see QA §8).
 *
 * Decisions baked in (see build prompt §0):
 *  1. Background = #F5F5F5 ("bright silver", BG1) — episode override, confirmed.
 *  2. Native verdict/state words are rendered in ink (neutral), NOT green/red.
 *     candleGreen / candleRed exist but are ONLY for real candle captures /
 *     inside the app recordings — never in drawn native elements.
 */
import { Easing } from "remotion";

export const COLORS = {
  // Background system (never pure white, never dark).
  background: "#F5F5F5", // BG1 "bright silver" — episode canvas
  surface: "#FFFFFF", // card/panel fills when a lift is needed
  white: "#FFFFFF",

  // Accents — visuals only (lines, chips, borders, flow boxes).
  primary: "#5F4DEE", // indigo (247) — primary
  secondary: "#5CC8E3", // cyan (192) — secondary
  primaryDark: "#4636B8",
  primaryLight: "#8F82F3",

  // Soft fills derived from accents.
  primaryWash: "rgba(95,77,238,0.10)",
  secondaryWash: "rgba(92,200,227,0.12)",
  scrim: "rgba(95,77,238,0.06)",

  // Readable copy.
  text: "#1B1D22", // ink — all readable copy + neutral verdict words
  slate: "#626266", // descriptor / secondary copy (matches app T2)
  hairline: "#C9CCD2", // 1px rules, dividers
  placeholderTint: "rgba(95,77,238,0.08)", // ~8% indigo phone-screen fill

  // Device frame (black minimalist phone bezel).
  deviceFrame: "#16181B", // near-black bezel fill
  deviceEdge: "#0D0E10", // slightly darker bezel edge

  // Directional colours — candles + Appendix engine ONLY (never drawn native).
  candleGreen: "#22B573",
  candleRed: "#E5475D",

  // Status word colour — the app's "Sideways"/"Neutral" orange-yellow (S3 recap).
  amber: "#F5A623",
} as const;

/**
 * TradingView-style indicator palette — Scene 1's "$ABCD" chart only.
 * Intentionally OFF-brand (per Simon, 25 Jun): the chart should read as a
 * familiar real charting tool, so these mirror TradingView defaults rather than
 * the indigo/cyan brand. Never use TV.* outside the Scene 1 chart.
 */
export const TV = {
  candleUp: "#26A69A",
  candleDown: "#EF5350",
  ma5: "#2962FF", // blue
  ma20: "#FF9800", // orange
  rsi: "#7E57C2", // purple
  rsiSignal: "#FFB74D", // amber signal
  rsiBand: "rgba(126,87,194,0.07)",
  macdLine: "#2962FF",
  macdSignal: "#FF6D00",
  stochK: "#26A69A",
  stochD: "#EF5350",
  stochBand: "rgba(41,98,255,0.05)",
  psarUp: "#2962FF", // dots below price (uptrend)
  psarDown: "#FF9800", // dots above price (downtrend)
  buy: "#26A69A",
  sell: "#EF5350",
  axis: "#9598A1", // axis labels
  grid: "rgba(0,0,0,0.06)",
} as const;

// Named border tints (no inline hex in scenes).
export const STROKES = {
  chip: COLORS.secondary, // 1px cyan chip borders
  flow: COLORS.primary, // 2px indigo flow / framed-shot borders
  hairline: COLORS.hairline,
} as const;

export const FRAME = { width: 1920, height: 1080 } as const;
export const FPS = 30;
// VO "You found a.mp3" = 244.08s → 7322f, + a 20f silent pad inserted at frame
// 1594 (Simon, 25 Jun) = 7342. durationInFrames is frame-exact, do not round.
export const DURATION = 7885; // 7322 +20 (pad) +907 (insert) −443 (delete) +79 (S9 freeze-extend to 7387)
export const VO_CUT = 1594; // VO is cut here and 20f of silence inserted
export const VO_PAD = 20; // length of the inserted silence / video freeze

// Fixed safe-area margins (build prompt §0).
export const MARGIN = { left: 96, right: 96, top: 54, bottom: 108 } as const;

// Usable content box: x 96→1824, y 54→972 (1728×918). Bottom 108px = subtitle band.
export const USABLE = {
  x: MARGIN.left,
  y: MARGIN.top,
  w: FRAME.width - MARGIN.left - MARGIN.right, // 1728
  h: FRAME.height - MARGIN.top - MARGIN.bottom, // 918
  right: FRAME.width - MARGIN.right, // 1824
  bottom: FRAME.height - MARGIN.bottom, // 972
  cx: MARGIN.left + (FRAME.width - MARGIN.left - MARGIN.right) / 2, // 960
  cy: MARGIN.top + (FRAME.height - MARGIN.top - MARGIN.bottom) / 2, // 513
} as const;

// Logo clear-zone (revised, per project memory): any content in the top band
// (y < yMax) must end at x < xMin. Kept clear by POSITION — SafeArea does NOT
// paint a reserve mask. (Earlier v1 used a 360×150 painted reserve; superseded.)
export const LOGO_CLEAR = { xMin: 1560, yMax: 150 } as const;

// Corner radii by context.
export const RADII = {
  chip: 14, // chips 12–16
  md: 16,
  card: 22, // cards 20–24
  lg: 24,
  device: 40, // phone bezel
  panel: 40, // full panels
} as const;

export const BORDER = { thin: 1, regular: 2, bold: 3 } as const;

// Type scale — named so scenes never inline a magic font-size.
export const TYPE = {
  hero: 84, // S10 lockup
  display: 72, // S2 main question
  lead: 64, // S1 opening hero line ("You found a stock…")
  principle: 56, // S10 two-line principle
  title: 48, // scene titles
  headline: 40, // closing strips, callout headlines
  body: 34, // body / captions
  sub: 36, // sub-labels under a big heading (S3 recap "tells direction" etc.)
  chip: 30, // chip labels
  label: 26, // small labels
  micro: 22, // dated tags, fine print
} as const;

export const WEIGHT = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  heavy: 800,
} as const;

// Easing — calm, expressive ease-out used across the piece.
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);

// ─── Build flags ────────────────────────────────────────────────────────────
// Consolidated S3–9 doc mounts the VO at the root (it's the master clock the
// triggers were derived from), overriding the general "VO is external" default
// for this episode. Flip false to render silent for the Premiere mix.
export const MOUNT_VO = true;

// Overlay margin / logo-clear / subtitle-band guides in Studio. Off in output.
export const DEV_GUIDES = false;
