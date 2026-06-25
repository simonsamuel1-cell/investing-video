/**
 * Frame-exact scene timeline (build prompt §2). DO NOT re-estimate any frame
 * value — these were calibrated to the real VO ("You found a.mp3", 244.08s).
 * All 10 scenes are INDEPENDENT (no continuity group). The last scene ends at
 * 6824 + 498 = 7322, which equals durationInFrames exactly.
 *
 * ⚠ The S7/S8 seam (frame 5812) is the lowest-confidence seam in the VO sync.
 * If recalibrated after a listen, adjust S7 dur and cascade S8/S9/S10 from.
 */
export interface SceneDef {
  n: number;
  from: number;
  dur: number;
  gist: string;
}

export const TIMELINE: SceneDef[] = [
  { n: 1, from: 0, dur: 875, gist: "problem setup — indicators bury you" },
  { n: 2, from: 875, dur: 657, gist: "the real question — condition first" },
  { n: 3, from: 1532, dur: 1051, gist: "the Technical Tab (real-UI walkthrough)" },
  { n: 4, from: 2583, dur: 889, gist: "market conditions — three dimensions" },
  { n: 5, from: 3472, dur: 562, gist: "indicators table — alignment" },
  { n: 6, from: 4034, dur: 810, gist: "support & resistance — execution layer" },
  { n: 7, from: 4844, dur: 968, gist: "how it fits your workflow" },
  { n: 8, from: 5812, dur: 594, gist: "confirm with Market Radar" },
  { n: 9, from: 6406, dur: 418, gist: "validate further — Chart Pro / TradingView" },
  { n: 10, from: 6844, dur: 498, gist: "closing principle — condition first" }, // +20 (VO pad @1594)
];

/** Asset filenames (verified in public/technicalTab/). Centralised so scenes
 * never typo a path. All names are space-free for staticFile(). */
export const ASSETS = {
  audio: "vo.mp3",

  // Device chrome SVG (frame only, no screen rect — recording is masked in).
  phoneSvg: "technicalTab/Phone.svg", // ≡ Untitled-2.svg, viewBox 461.6×933.4

  // Continuous screen recordings (980×1920, 30fps) — phone-screen only, no bezel.
  rec3to6: "technicalTab/Scene_3-6.mp4", // 110.85s → S3,S4,S5,S6
  rec7to8: "technicalTab/Scene_7-8.mp4", // 39.98s → S7,S8
  rec9: "technicalTab/Scene_9.mp4", // 13.37s → S9

  // S1 opening — three "where you heard about the stock" phone screenshots
  // (supplied by Simon; thin-bordered). Shown left→right at frames 65–230.
  s1HotSector: "technicalTab/s1-hot-sector.jpg", // Scene 01 - 1.jpg
  s1WordOfMouth: "technicalTab/s1-word-of-mouth.jpg", // Scene 01 - 2.jpg
  s1Watchlist: "technicalTab/s1-watchlist.jpg", // Scene 01 - 3.jpg

  // Raw phone screenshots (1080×2340) — bordered by <FramedShot>.
  shotEsip: "technicalTab/shot-esip.png", // ESIP — bullish example
  shotCeka: "technicalTab/shot-ceka.png", // CEKA — bearish example
  shotLaju: "technicalTab/shot-laju.png", // LAJU — S&R example
  shotRgas: "technicalTab/shot-rgas.png", // RGAS — S&R example
  shotRadar: "technicalTab/shot-radar.png", // Market Radar — S8

  // Pre-bordered gauge bubble cards (Overall Summary crops).
  gaugeBullish: "technicalTab/gauge-bullish.png", // 90% Bullish
  gaugeNeutral: "technicalTab/gauge-neutral.png", // 58% Neutral
  gaugeBearish: "technicalTab/gauge-bearish.png", // 30% Bearish

  // S3 v2 — supplied verbatim. BADGES = full flanking phone cards; HIGHLIGHTS =
  // magnified gauge-only cards that pop over to emphasise a verdict.
  s3BadgeBullish: "technicalTab/s3-badge-bullish.png", // ESIP full card, 90% Bullish
  s3BadgeBearish: "technicalTab/s3-badge-bearish.png", // CEKA full card, 30% Bearish
  s3HlBullish: "technicalTab/s3-hl-bullish.png", // zoomed gauge 90% Bullish
  s3HlBearish: "technicalTab/s3-hl-bearish.png", // zoomed gauge 30% Bearish
  s3HlNeutral: "technicalTab/s3-hl-neutral.png", // zoomed gauge 58% Neutral

  // S4 Market-Conditions row highlights (wide cards, aspect ≈4.41).
  s4Trend: "technicalTab/s4-trend.png", // Trend — Sideways
  s4Momentum: "technicalTab/s4-momentum.png", // Momentum — Bullish
  s4Strength: "technicalTab/s4-strength.png", // Market Strength — Neutral
  // S5 MA block highlight (MA5→MA200, aspect ≈1.55).
  s5Ma: "technicalTab/s5-ma.png",
  // S6 S&R example cards (full phone cards, aspect ≈0.535).
  s6Laju: "technicalTab/s6-laju.png", // near S1 + bullish
  s6Rgas: "technicalTab/s6-rgas.png", // near R2 + high RSI

  // S8 Market Radar screenshot + signal-tags highlight.
  shotRadar8: "technicalTab/shot-radar.png", // ≡ Scene 8.jpg (1080×2340)
  s8Highlight: "technicalTab/s8-highlight.png", // Quick Rebound / Intensive Buy tags (1034×1699)
} as const;

/**
 * In-recording seek offsets (seconds). Best-effort defaults — the recording
 * roughly follows VO narration. Tune in Studio if a scene opens on the wrong
 * frame; these are the only knobs (flagged TODO so they read as tunables).
 */
export const SEEK = {
  s3: 0, // BBCA Feeds/Technical open
  s4: 26, // Market Conditions block — TODO tune
  s5: 42, // Technical Indicators table — TODO tune
  s6: 70, // Support & Resistance — TODO tune
  s7: 0, // workflow capture (rec7to8)
  s8: 26, // Market Radar (rec7to8) — TODO tune
  s9: 0, // Chart Pro / TradingView (rec9)
} as const;
