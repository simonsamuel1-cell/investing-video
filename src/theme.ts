/**
 * Brand tokens for the Tuntun "Concept Sector" explainer.
 * Every component reads colors/sizes from here — no hardcoded hex anywhere else.
 * (See the build spec §3 Brand System and §4 Layout & Safe-area.)
 */

export const COLORS = {
  // Bright silver background system (never pure white, never dark).
  silver: "#EDEEF0", // base
  silverLight: "#F2F3F5", // gradient stop (light)
  silverDark: "#E8E9EC", // gradient stop (dark)

  black: "#000000", // ALL readable copy
  white: "#FFFFFF",

  // Accent colors — visuals only (shapes, lines, chart series, chips).
  purple: "#5F4DEE", // primary
  cyan: "#5CC8E3", // secondary

  // Derived tint ramp — ONLY when a chart/diagram needs 3+ series.
  purpleLight: "#8F82F3",
  purpleDark: "#4636B8",
  cyanLight: "#8FDAED",
  cyanDark: "#3A9DB8",

  // Soft fills derived from accents (chips, highlight boxes) — still on-brand.
  purpleWash: "rgba(95,77,238,0.10)",
  cyanWash: "rgba(92,200,227,0.12)",

  // Neutral diagram ink (lines, leader strokes) — a desaturated silver-grey.
  ink: "#3A3D44",
  hairline: "#C9CCD2",
} as const;

export const FRAME = { width: 1920, height: 1080 } as const;
export const FPS = 30;
export const DURATION = 6902; // VO is exactly 230.064s — do not round.

// Margins kept clear of content (§4).
export const MARGIN = { left: 96, right: 96, top: 54, bottom: 108 } as const;

// Usable content area: x 96→1824, y 54→972 (1728×918).
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

// Top-right logo reserve (kept clear of all content except Scene 32).
export const LOGO_RESERVE = { x: 1464, y: 54, w: 360, h: 150 } as const;

// Corner radii by context.
export const RADII = {
  chip: 14, // chips ~12–16
  card: 22, // cards ~20–24
  device: 24, // phone frame
  panel: 40, // full panels
} as const;

export const BORDER = { thin: 1, regular: 2 } as const;

// ─── Build flags ────────────────────────────────────────────────────────────
// MOUNT_VO: VO is the master clock for previewing/timing. Set false to export a
// silent program when the voiceover is mixed in post (Premiere). Default true,
// matching the spec ("Audio is the master clock. Mount the VO once at frame 0").
export const MOUNT_VO = true;

// DEV_GUIDES: overlay margin / logo-reserve / right-zone outlines in Studio for
// tuning callout coordinates. Always render off in final output.
export const DEV_GUIDES = false;
