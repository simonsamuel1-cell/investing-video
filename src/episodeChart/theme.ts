/**
 * theme.ts — SINGLE SOURCE OF TRUTH for the Candlestick episode.
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
    activeWidth: 1728,
    activeHeight: 918,
    logoZone: { width: 360, height: 150, maxContentX: 1368 },
  },
  colors: {
    bg: "#F5F5F5",
    ink: "#000000",
    slate: "#626266",
    indigo: "#5F4DEE",
    indigoTint: "#EFEDFE",
    indigoMid: "#A799FF",
    cyan: "#5CC8E3",
    cyanTint: "#EDFDFE",
    neutralLine: "#DEDEE0",
    neutralFill: "#FFFFFF",
    neutralMuted: "#B9B9BD",
    // Candle bodies and their wicks ONLY.
    candleGreen: "#22B573",
    candleRed: "#E5475D",
    // Scoped exception (like bookBid/bookOffer): the case-study active-tab rule
    // segment. Hue-locked to the candle tokens but named so tab code never
    // references candleGreen/candleRed directly.
    tabRuleBullish: "#22B573",
    tabRuleBearish: "#E5475D",
  },
  type: {
    family: "Plus Jakarta Sans",
    display: { size: 96, weight: 800 },
    headline: { size: 72, weight: 700 },
    header: { size: 48, weight: 700 },
    body: { size: 40, weight: 500 },
    label: { size: 36, weight: 600 },
  },
  radius: { card: 20, chip: 16, panel: 24 },
  stroke: { hairline: 1, standard: 2 },
  motion: {
    ease: Easing.bezier(0.22, 1, 0.36, 1), // no overshoot
    revealFrames: 12,
    fadeFrames: 10,
  },
} as const;
