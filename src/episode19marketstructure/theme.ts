/**
 * theme.ts — SINGLE SOURCE OF TRUTH for the "Market Structure" episode.
 *
 * No raw hex, font size, weight, easing curve, radius or layout number may
 * appear in a scene or a component. Everything is read from here. New tints are
 * added as NAMED keys and stay hue-locked to the brand: indigo 247°, cyan 192°.
 *
 * The colour contract, verbatim from the build spec:
 *   bg #F5F5F5 · ink #000000 · indigo #5F4DEE · cyan #5CC8E3 · slate #626266
 *   candleGreen #22B573 / candleRed #E5475D — CANDLE BODIES AND WICKS ONLY.
 * Axes, gridlines, bands, reference lines, annotations and chrome are
 * indigo / cyan / neutral. Nothing else in the episode is ever red or green.
 */
import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

loadFont("normal", { weights: ["400", "500", "600", "700", "800"] });

const CANVAS = { width: 1920, height: 1080, fps: 30 } as const;

/**
 * Margins are FIXED for every Tuntun video and are not overridable per episode.
 * The bottom 108px is the subtitle zone and stays visually clear; anything in
 * the top 150px must end at x ≤ 1368 so it never crowds the logo zone.
 */
const LAYOUT = {
  safeLeft: 96,
  safeRight: 96,
  safeTop: 54,
  safeBottom: 108,
  activeW: 1728,
  activeH: 918,
  logoZoneW: 360,
  logoZoneH: 150,
  logoMaxContentX: 1368,
} as const;

/**
 * The chart frame every scene draws inside. It lives in the theme rather than
 * in a scene because SC05 has to hand its staircase to SC06, and SC14 its line
 * to SC15, without the picture shifting on the boundary frame.
 *
 *   card.y 168 clears the 150px logo band outright
 *   card bottom 852, subtitle band starts 972 → captionY 900 sits between them
 *   plot insets the card by 56, plus 96 on the right for price labels
 */
const CARD = { x: 96, y: 168, w: 1728, h: 684 } as const;
const FRAME = {
  card: CARD,
  plot: { x: CARD.x + 56, y: CARD.y + 56, w: CARD.w - 56 - 96 - 56, h: CARD.h - 112 },
  headerX: 96,
  headerY: 100,
  captionY: 900,
} as const;

export const theme = {
  canvas: CANVAS,
  layout: LAYOUT,
  frame: FRAME,
  colors: {
    bg: "#F5F5F5",
    ink: "#000000",
    slate: "#626266",
    indigo: "#5F4DEE",
    cyan: "#5CC8E3",
    candleGreen: "#22B573",
    candleRed: "#E5475D",
    // Decorative tints — hue locked, saturation/lightness only.
    indigoTint8: "rgba(95, 77, 238, 0.08)",
    indigoTint14: "rgba(95, 77, 238, 0.14)",
    indigoMA1: "#8F82F4",
    indigoMA2: "#BDB4F9",
    indigoSoft: "#EFEDFE",
    cyanSoft: "#EDFDFE",
    cyanTint10: "rgba(92, 200, 227, 0.10)",
    cardBg: "#FFFFFF",
    border: "#DEDEE0",
    muted: "#B9B9BD",
    onIndigo: "#FFFFFF",
  },
  type: {
    family: "Plus Jakarta Sans",
    display: { size: 96, weight: 800 },
    header: { size: 48, weight: 700 },
    label: { size: 36, weight: 600 },
    chip: { size: 36, weight: 600 },
    small: { size: 30, weight: 600 },
    axis: { size: 26, weight: 500 },
  },
  radius: { card: 16, cardLg: 24, chip: 16, pill: 999 },
  stroke: { hair: 1, rule: 2, line: 3, thick: 9 },
  shadow: {
    rest: "0 10px 24px rgba(0, 0, 0, 0.05)",
    lift: "0 24px 42px rgba(0, 0, 0, 0.10)",
  },
  motion: {
    /** No overshoot. The only curve type in the episode. */
    ease: Easing.bezier(0.22, 1, 0.36, 1),
    /** Symmetric ease-in-out — fastest at its midpoint. */
    easeInOut: Easing.bezier(0.65, 0, 0.35, 1),
    revealFrames: 12,
    fadeFrames: 10,
    /** How long a chip's pop-in takes. UI elements only, never text. */
    popFrames: 10,
  },
} as const;

export type Palette = typeof theme.colors;
