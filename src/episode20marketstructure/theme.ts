/**
 * theme.ts — the only place this episode names a colour, a size, a curve or a
 * coordinate. Scenes and components read from here and nowhere else.
 *
 * COLOUR CONTRACT. Indigo is hue 247, cyan is hue 192, and every decorative
 * tint below is those two hues with only saturation and lightness moved.
 * candleGreen and candleRed exist for CANDLE BODIES AND WICKS ONLY — axes,
 * gridlines, bands, reference lines, annotations and chrome are never red or
 * green anywhere in the episode.
 *
 * LAYOUT is derived, not typed. The margins are the fixed Tuntun ones; every
 * box below is computed from them, so a margin change moves the whole episode
 * rather than leaving a scene behind.
 */
import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

loadFont("normal", { weights: ["400", "500", "600", "700", "800"] });

const W = 1920;
const H = 1080;

/** Fixed for every Tuntun video. Not overridable per episode. */
const MARGIN = { left: 96, right: 96, top: 54, bottom: 108 } as const;

/** The band the burned-in subtitles own. Nothing else may enter it. */
const CAPTION_BAND = { top: H - MARGIN.bottom, height: MARGIN.bottom } as const;

/**
 * The top-right zone the logo needs kept clear. Anything drawn in the first
 * `height` pixels of the canvas has to end before `maxX`.
 */
const LOGO_ZONE = { width: 360, height: 150, maxX: W - 360 - 192 } as const;

/**
 * The stage, derived: the full active area, then split into a title strip and
 * the card the charts live on, with a caption row between the card and the
 * subtitle band.
 */
const active = { x: MARGIN.left, y: MARGIN.top, w: W - MARGIN.left - MARGIN.right, h: H - MARGIN.top - MARGIN.bottom };
const TITLE_H = 136;
const CAPTION_H = 96;
const card = {
  x: active.x,
  y: active.y + TITLE_H,
  w: active.w,
  h: active.h - TITLE_H - CAPTION_H,
};

export const theme = {
  canvas: { width: W, height: H, fps: 30 },
  margin: MARGIN,
  captionBand: CAPTION_BAND,
  logoZone: LOGO_ZONE,

  stage: {
    active,
    /** The white card every chart is drawn on. */
    card,
    /** Where a chart may draw inside that card — right inset leaves room for prices. */
    plot: { x: card.x + 64, y: card.y + 64, w: card.w - 64 - 118, h: card.h - 128 },
    /** Scene titles: centred in the title strip, comfortably clear of the logo. */
    title: { x: W / 2, y: active.y + TITLE_H / 2 },
    /** The single row of chips between the card and the subtitle band. */
    caption: { y: card.y + card.h + CAPTION_H / 2 },
  },

  color: {
    bg: "#F5F5F5",
    ink: "#000000",
    slate: "#626266",
    indigo: "#5F4DEE",
    cyan: "#5CC8E3",
    candleGreen: "#22B573",
    candleRed: "#E5475D",
    // hue-locked tints
    indigoWash: "rgba(95, 77, 238, 0.09)",
    indigoWashStrong: "rgba(95, 77, 238, 0.16)",
    indigoPale: "#EFEDFE",
    indigoLight: "#8F82F4",
    cyanWash: "rgba(92, 200, 227, 0.12)",
    cyanPale: "#EAFAFE",
    surface: "#FFFFFF",
    hairline: "#DEDEE0",
    faint: "#B9B9BD",
    onIndigo: "#FFFFFF",
  },

  text: {
    family: "Plus Jakarta Sans",
    display: { size: 96, weight: 800 },
    title: { size: 48, weight: 700 },
    body: { size: 36, weight: 500 },
    chip: { size: 36, weight: 600 },
    tag: { size: 30, weight: 600 },
    axis: { size: 26, weight: 500 },
  },

  shape: {
    cardRadius: 24,
    panelRadius: 16,
    chipRadius: 16,
    hairline: 1,
    rule: 2,
    line: 3,
    heavy: 9,
    shadow: "0 10px 24px rgba(0, 0, 0, 0.05)",
  },

  motion: {
    /** The episode's only curves. `settle` never overshoots. */
    settle: Easing.bezier(0.22, 1, 0.36, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    /** How long a word takes to fade and rise into place. */
    reveal: 12,
    fade: 10,
    /** UI elements may pop over this many frames. Type never does. */
    pop: 10,
  },
} as const;
