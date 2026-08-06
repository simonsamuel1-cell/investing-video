/**
 * theme.ts — SINGLE SOURCE OF TRUTH for the "Chart is the Market's Memory" episode.
 * No raw hex, font size/weight, easing curve, or layout number in scene files —
 * everything imports from here. Hues locked: indigo 247 / cyan 192.
 * candleGreen / candleRed appear ONLY inside candle bodies and their wicks.
 */
import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

loadFont("normal", { weights: ["400", "500", "600", "700", "800"] });

export const theme = {
  canvas: { width: 1920, height: 1080, fps: 30 },
  layout: {
    safeLeft: 96,
    safeRight: 96,
    safeTop: 54,
    safeBottom: 108, // subtitle zone — must remain visually empty
    activeW: 1728,
    activeH: 918,
    logoZoneW: 360,
    logoZoneH: 150,
    logoMaxContentX: 1368, // content in the top 150px must end at x <= this
  },
  colors: {
    bg: "#F5F5F5",
    ink: "#000000",
    slate: "#626266",
    indigo: "#5F4DEE",
    cyan: "#5CC8E3",
    // Candle bodies and their wicks ONLY.
    candleGreen: "#22B573",
    candleRed: "#E5475D",
    // Decorative tints — hue-locked to indigo 247.
    indigoTint8: "rgba(95, 77, 238, 0.08)", // Bollinger band fill
    indigoTint14: "rgba(95, 77, 238, 0.14)", // deepened zone-band fill
    indigoTintMA1: "#8F82F4", // MA20
    indigoTintMA2: "#BDB4F9", // MA50
    indigoSoft: "#EFEDFE",
    cyanSoft: "#EDFDFE",
    cardBg: "#FFFFFF",
    border: "#DEDEE0",
    muted: "#B9B9BD",
  },
  type: {
    family: "Plus Jakarta Sans",
    display: { size: 96, weight: 800 },
    header: { size: 48, weight: 700 },
    label: { size: 36, weight: 600 },
    chip: { size: 36, weight: 600 },
    numeral: { size: 48, weight: 700 },
    axis: { size: 26, weight: 500 },
  },
  radius: { card: 16, cardLg: 24, chip: 16 },
  stroke: { hair: 1, rule: 2 },
  // Two card elevations; scenes crossfade between them rather than authoring
  // shadow values inline.
  shadow: {
    rest: "0 10px 24px rgba(0, 0, 0, 0.05)",
    lift: "0 24px 42px rgba(0, 0, 0, 0.10)",
  },
  motion: {
    ease: Easing.bezier(0.22, 1, 0.36, 1), // no overshoot
    // Symmetric ease-in-out: slow, fast, slow. Its peak velocity sits exactly at
    // the midpoint, which is where a cut-on-action wants to land.
    easeInOut: Easing.bezier(0.65, 0, 0.35, 1),
    revealFrames: 12,
    fadeFrames: 10,
  },
} as const;
