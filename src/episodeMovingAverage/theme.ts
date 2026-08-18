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
    /**
     * THE SHARED CHART BOX — identical in every scene, never overridden.
     *
     * One chart sits here for the whole episode and does not move. Between
     * scenes only the annotation changes. Its bottom edge is 850, which leaves
     * `captionY` clear of it and both clear of the 108px subtitle band.
     */
    chart: { x: 96, y: 170, w: 1728, h: 680 },
    /** The one optional caption line, under the chart. */
    captionY: 880,
    /** The TitleChip's anchor — always top-LEFT, because the logo owns the right. */
    titleChip: { x: 96, y: 92 },
  },

  color: {
    bg: "#F5F5F5",
    ink: "#000000",
    slate: "#626266",
    indigo: "#5F4DEE",
    cyan: "#5CC8E3",
    candleGreen: "#22B573",
    candleRed: "#E5475D",
    /**
     * The ONE red that is allowed outside a candle body, and only in words:
     * naming a mistake. It is the same red the candles use, so the episode
     * still has exactly one red — never put it on drawn chart content.
     */
    warn: "#E5475D",
    // hue-locked tints
    /**
     * The build prompt's tint ladder, hue-locked: indigo stays at 247 and cyan
     * at 192, and only saturation and lightness move. A scene that needs a
     * lighter indigo reaches for one of these, never for a new hex.
     */
    indigo90: "#7160F1",
    indigo40: "#CFC8FB",
    indigo12: "#EDEAFE",
    cyan70: "#8EDAEB",
    cyan40: "#C2ECF5",
    cyan12: "#E7F7FB",
    /** The explainer charts' price line — neutral, so the MAs carry the colour. */
    priceLine: "#3A3A3A",
    /**
     * The Bollinger middle band ON THE GGRM CHART ONLY.
     *
     * There the SMA100 (solid indigo) and the middle band (dashed) are on
     * screen together, and the VO calls the SMA100 "garis ungu". Same hue at
     * the same lightness would make that ambiguous, so the band steps back a
     * tint — still hue-locked to 247, just lighter.
     */
    indigo70: "#9A8EF5",
    /** Gridlines and panel borders. */
    gridline: "#DDE0E5",
    border: "#D8DBE0",
    textMuted: "#6B7076",
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

  /**
   * ═══ THE TYPE SCALE — FOUR SIZES, AND ONLY FOUR ═══
   *
   * Every size in the episode is one of these, and which one is decided by the
   * ROLE the type is playing, never by how it looks in a given frame.
   *
   *   96  display   A title that owns the frame. Use it only when the screen is
   *                 showing the title and nothing else — no chart under it, no
   *                 second statement beside it. Also the countdown numeral,
   *                 which owns the frame the same way.
   *
   *   48  title     The sub-title, one step down. A heading sitting ABOVE a
   *                 visual object — a chart's name, a section head — or a
   *                 CONCLUSION drawn from what is on screen.
   *
   *   36  body      A sentence, a quote, a phrase. Also the title-label of a
   *                 white card, where the card is the object and the words name
   *                 it rather than heading the frame.
   *
   *   30  tag       A label INSIDE a chart: a line's name, a marked point, a
   *                 price on the axis. Small because it sits among the data and
   *                 must not compete with it.
   *
   * A fifth size is a decision that has not been made yet. Pick the role first.
   */
  text: {
    family: "Plus Jakarta Sans",
    display: { size: 96, weight: 800 },
    title: { size: 48, weight: 700 },
    body: { size: 36, weight: 500 },
    /** 36 at chip weight — the same size, saying a phrase rather than prose. */
    chip: { size: 36, weight: 600 },
    tag: { size: 30, weight: 600 },
    /** The price axis is an in-chart label, so it takes the in-chart size. */
    axis: { size: 30, weight: 500 },
  },

  shape: {
    cardRadius: 24,
    panelRadius: 16,
    chipRadius: 16,
    hairline: 1,
    rule: 2,
    line: 3,
    /** The strokes v2 names: MA, band, price line, candle wick. */
    ma: 3,
    band: 2,
    price: 2.5,
    wick: 1.5,
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
    /** A Ping's whole lifetime — expand and fade, then gone. */
    pingF: 20,
  },
} as const;
