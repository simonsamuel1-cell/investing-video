/**
 * theme.ts — the only place this episode names a colour, a size, a curve or a
 * coordinate. Scenes and components read from here and nowhere else.
 *
 * COLOUR CONTRACT. Indigo is hue 247, cyan is hue 192, and every tint below is
 * one of those two with only saturation and lightness moved. candleGreen and
 * candleRed are for CANDLE BODIES ONLY — axes, gridlines, bands, reference
 * lines, annotations and chrome are never red or green anywhere.
 *
 * THREE LAYOUT MODES and nothing else:
 *   A  full chart, text as chips over it
 *   B  chart shrinks left, text panel on the right
 *   C  text over the chart, dimmed to a backdrop
 * A scene moves between them over 20 frames, eased. It never cuts.
 */
import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

loadFont("normal", { weights: ["400", "500", "600", "700", "800"] });

export const theme = {
  colors: {
    /* Flat white across the whole episode, root AND every scene's SafeArea —
       one token, so there is nowhere left it could still read as off-white. */
    bg: "#FFFFFF",
    text: "#000000",
    textMuted: "#6B7076",
    gridline: "#DDE0E5",
    surface: "#FFFFFF",
    border: "#D8DBE0",
    indigo: "#5F4DEE", // hue 247 — slow MA / middle band / primary
    cyan: "#5CC8E3", // hue 192 — fast MA / outer bands / accent
    /**
     * Hue-locked tints. Never invent a new hue.
     *
     * `indigo70` exists for the GGRM chart ALONE: there a solid indigo SMA100
     * and a dashed indigo middle band are on screen together, and the voice
     * calls the SMA100 "garis ungu". Same hue at the same lightness makes that
     * caption ambiguous, so the band steps back a tint — still 247.
     */
    indigo70: "#9A8EF5",
    indigo12: "#EDEAFE",
    cyan12: "#E7F7FB",
    price: "#3A3A3A",
    /**
     * The aside grey. Simon picked it for the quote box and it is now the ink
     * for anything that comments ON the chart rather than being part of it —
     * darker than textMuted, lighter than black, and never used for a heading.
     */
    ink: "#4D4D4D",
    candleGreen: "#22B573",
    candleRed: "#E5475D",
    /**
     * THE TWO INDICATOR LINES, and the only colours in the episode outside the
     * indigo/cyan pair and the candle bodies.
     *
     * They are here at Simon's explicit direction, and they earn the exception:
     * these lines are drawn ON a panel that is already indigo-tinted, over
     * green and red bodies, and an indigo average on an indigo wash is a line
     * you have to hunt for. Orange and tosca are the two hues that are not
     * already spoken for.
     *
     * They name INDICATORS, and ONE other thing: SC11's trendline, at Simon's
     * direction. That scene draws your own reading first and the indicators
     * after it, so orange there separates the two layers rather than blurring
     * them. Chrome, axes, every other annotation and all text stay
     * indigo / cyan / neutral.
     */
    maOrange: "#F59E0B",
    bbTosca: "#2EC4B6",
    /**
     * THE EPISODE'S ONE ANNOTATION RED. Simon asked for "merah sedikit muda" —
     * a shade up from `candleRed`, which is the only other red in drawn
     * content. It is a shade and not a wash: any lighter and 30px white on it
     * drops under 3:1, which is the floor for large text.
     *
     * Two places use it, both at Simon's direction: SC05's Death Cross pill,
     * and SC11's support and resistance lines. Nothing else may — a third red
     * would stop the first two meaning anything.
     */
    crossRed: "#E95D71",
  },

  layout: {
    width: 1920,
    height: 1080,
    fps: 30,
    safeLeft: 96,
    safeRight: 96,
    safeTop: 54,
    safeBottom: 108,
    logoZoneW: 360,
    logoZoneH: 150,
    /** Mode A — the default chart box. */
    chartA: { x: 96, y: 170, w: 1728, h: 680 },
    /** Mode B — chart shrinks left, text panel on the right. */
    chartB: { x: 96, y: 170, w: 984, h: 680 },
    panelB: { x: 1128, y: 200, w: 696, h: 620 },
    /** Mode C — text over the dimmed Mode-A chart. */
    textC: { x: 96, y: 280, w: 1400 },
    titleChip: { x: 96, y: 54 },
    /** Scene 01 only. */
    splitX: 960,
    modeTransitionF: 20,
    radius: { sm: 16, md: 20, lg: 24 },
    border: { thin: 1, thick: 2 },
    stroke: { ma: 3, band: 2, price: 2.5, wick: 1.5, strike: 2 },
  },

  type: {
    family: "Plus Jakarta Sans",
    display: { size: 88, weight: 800 },
    h1: { size: 64, weight: 700 },
    h2: { size: 48, weight: 700 },
    label: { size: 40, weight: 600 },
    /** The absolute minimum. Nothing in the episode is smaller. */
    labelSm: { size: 36, weight: 500 },
  },

  motion: {
    ease: Easing.bezier(0.22, 1, 0.36, 1),
    easeInOut: Easing.bezier(0.65, 0, 0.35, 1),
    revealF: 12,
    slidePx: 12,
    pingF: 20,
    strikeF: 10,
  },
} as const;

/** The band the burned-in subtitles own. Nothing else may enter it. */
export const CAPTION_BAND = {
  top: theme.layout.height - theme.layout.safeBottom,
  height: theme.layout.safeBottom,
};
