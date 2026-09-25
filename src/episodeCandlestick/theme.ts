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
    /** After Effects' Easy Ease — symmetric; for camera moves (SC01's zoom). */
    easy: Easing.bezier(0.33, 0, 0.67, 1),
    revealFrames: 12,
    fadeFrames: 10,
  },
  /**
   * The broker-app chart panel of SC01 in the Indonesian cut — TA07's opening
   * frame (019 Scene01), adopted. Simon: "Ubah tampilan candlestick chart yang
   * di awal jadi seperti di TA07-MAdanBB frame 0". These are TA07's values.
   * `up`/`upTint`/`downTint` are the day-change readout's colours in the
   * header — the one place outside a candle this green and red appear, as in
   * the panel it copies.
   */
  appPanel: {
    surface: "#FFFFFF",
    border: "#D8DBE0",
    text: "#000000",
    textMuted: "#6B7076",
    gridline: "#DDE0E5",
    indigo12: "#EDEAFE",
    cyan12: "#E7F7FB",
    up: "#22B573",
    down: "#E5475D",
    upTint: "rgba(34, 181, 115, 0.12)",
    downTint: "rgba(229, 71, 93, 0.12)",
    radius: { sm: 16, lg: 24 },
    border1: 1,
    wick: 1.5,
    type: { size: 30, weight: 600, axis: 500, name: 36, price: 70 },
  },
  /** Candle body corners in the Indonesian cut: ratio of the body's width, and the cap (px). */
  candle: { round: 0.18, roundMax: 8 },
  /**
   * The roadmap — this video's "Scene Transisi" (continuity/Roadmap.tsx).
   * Simon: "Stylenya sama persis seperti TA01, scene transisi pertama." So these
   * are TA01's values, not this episode's: its 16px card radius (here cards are
   * 20), its resting shadow, its glow, and its easy ease (0.33, 0, 0.67, 1)
   * where this episode otherwise eases out.
   */
  roadmap: {
    paper: "#FFFFFF",
    rule: "#DEDEE0",
    cardRadius: 16,
    cardShadow: "0 10px 24px rgba(0, 0, 0, 0.05)",
    glowTint: "rgba(95, 77, 238, 0.14)",
    labelSize: 30,
    /**
     * ⚠ NOT TA01's EASY EASE ANY MORE. Simon, on the swap: "animasi gerakannya
     * kayak masih kurang easy ease nya, more like gerakan cepatnya gaada jadi
     * gerakan easy ease nya ga keliatan, apalagi pas uda nyampe". (0.33, 0,
     * 0.67, 1) is nearly straight through its middle, so a big move read as
     * constant speed. This one starts slow, runs FAST through the middle and
     * spends its last third settling — the landing is where the ease shows.
     */
    ease: Easing.bezier(0.7, 0, 0.2, 1),
  },
} as const;
