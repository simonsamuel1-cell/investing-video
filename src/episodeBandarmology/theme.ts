/**
 * Bandarmology episode theme.
 *
 * Spreads the geometry/scale of the shared Tuntun system but overrides the
 * background to #F5F5F5 (BG1) for THIS episode, and adds episode-specific
 * indigo/cyan tints + Tuntun neutral greys as named keys.
 *
 * Hard color rules (see build spec §0.3):
 *  • Two chromatic anchors ONLY — indigo #5F4DEE (hue 247) and cyan #5CC8E3
 *    (hue 192). Decorative shades vary S/L only, hue stays locked.
 *  • Neutrals are achromatic Tuntun greys — never a third hue.
 *  • No red/green in any DRAWN element. danger / candleGreen / candleRed are
 *    declared (fixed brand constants) but are NOT used by drawn code in this
 *    episode — only real app captures may carry native colour.
 *
 * Scene files import `theme` and read everything from it — no raw hex anywhere
 * in a scene.
 */
import { Easing } from "remotion";
import { fontFamily } from "../fonts";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

export const theme = {
  colors: {
    // Fixed neutrals (untouchable).
    background: "#F5F5F5", // episode override (BG1); shared default #E8E8E8 not used here
    text: "#000000",
    white: "#FFFFFF", // BG T6 card
    card: "#FFFFFF",

    // Anchors.
    indigo: "#5F4DEE", // hue 247
    cyan: "#5CC8E3", // hue 192

    // Episode tints — hue-locked to the anchors, S/L varied only.
    indigoTint: "#E9E6FD", // light indigo fill (cards/bands)
    indigoSoft: "rgba(95,77,238,0.10)", // wash
    indigoDeep: "#4636B8", // darker indigo emphasis
    cyanTint: "#E4F6FB", // light cyan fill
    cyanSoft: "rgba(92,200,227,0.12)", // wash
    cyanDeep: "#3A9DB8", // darker cyan emphasis

    // Tuntun neutral greys (achromatic — allowed as neutrals).
    slate: "#626266", // T2 secondary text/ink
    slateMute: "#949499", // muted (a.k.a. neutral3)
    neutral3: "#949499",
    slateFaint: "#B9B9BD", // faint (a.k.a. neutral4)
    neutral4: "#B9B9BD",
    divider: "#EDEEF0", // hairline / card border
    cardWhite: "#FFFFFF",

    // Candlestick green/red — the ONE place red/green enters drawn content,
    // INSIDE candle bodies/wicks only (§0.4). Everything else stays brand/neutral.
    candleGreen: "#22B573",
    candleRed: "#E5475D",

    // Fixed brand constant — declared, NOT used by drawn elements this episode.
    danger: "#E53E3E",
  },

  font: {
    family: fontFamily,
    weights: { regular: 400, medium: 500, bold: 700, extrabold: 800 },
  },

  // Video-canvas type scale (NOT mobile UI scale) — §0.7.
  type: {
    display: 96,
    header: 48,
    subhead: 40,
    descriptor: 36,
    chip: 30,
  },

  radius: { sm: 8, md: 16, lg: 24, pill: 999 },
  border: { thin: 1, regular: 2 },

  motion: { ease },

  layout: {
    width: 1920,
    height: 1080,
    fps: 30,
    safeLeft: 96,
    safeRight: 96,
    safeTop: 54,
    safeBottom: 108,
    activeW: 1728,
    activeH: 918,
    // usable box edges (absolute px)
    left: 96,
    right: 1824,
    top: 54,
    bottom: 972,
    cx: 960,
    cy: 513,
    // top-right logo clear-zone (360×150). Content in the top 150px must end
    // at x ≤ 1368 (§0.5).
    logoZone: { x: 1464, y: 54, w: 360, h: 150, contentMaxX: 1368 },
  },
} as const;

export type Theme = typeof theme;

// Composition constants.
export const FPS = 30;
export const FRAME = { width: 1920, height: 1080 } as const;
export const DURATION = 9341; // last scene from(9035) + dur(306) — see Composition §4
