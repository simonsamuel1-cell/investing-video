/**
 * Frame-exact scene timeline (spec §6). DO NOT CHANGE any frame value.
 * `from`/`dur` are taken verbatim from the spec table — they were derived from
 * measured pauses in the real VO, not estimated. The last scene ends at
 * 6838 + 64 = 6902, which equals durationInFrames exactly.
 *
 * Note: a few adjacent rows in §6 differ by ±1 frame (e.g. S17→S18); these are
 * the spec's own measured values and are kept verbatim. Any sub-frame gap/overlap
 * is masked by the persistent silver background + per-scene fade-in.
 */
export type Layout = "A" | "B" | "C";

export interface SceneDef {
  n: number; // scene number (1-based)
  from: number;
  dur: number;
  layout: Layout;
  gist: string;
}

export const TIMELINE: SceneDef[] = [
  { n: 1, from: 0, dur: 352, layout: "A", gist: "traders chase individual tickers" },
  { n: 2, from: 352, dur: 117, layout: "A", gist: "that's noise, not analysis" },
  { n: 3, from: 469, dur: 340, layout: "A", gist: "market moves in themes" },
  { n: 4, from: 809, dur: 157, layout: "A", gist: "single stocks miss the picture" },
  { n: 5, from: 966, dur: 84, layout: "A", gist: "beneath the surface (bridge)" },
  { n: 6, from: 1050, dur: 286, layout: "A", gist: "poultry example" },
  { n: 7, from: 1336, dur: 164, layout: "A", gist: "govt policy → infra" },
  { n: 8, from: 1500, dur: 194, layout: "A", gist: "legendary-investor holdings" },
  { n: 9, from: 1694, dur: 187, layout: "A", gist: "themes drive groups, not reverse" },
  { n: 10, from: 1881, dur: 272, layout: "A", gist: "which theme / which stocks lead" },
  { n: 11, from: 2153, dur: 63, layout: "C", gist: "this is Concept Sector (Layout C: title + dual phones)" },
  { n: 12, from: 2216, dur: 198, layout: "B", gist: "three layers (B-top + lift-up popup; combo @00:00)" },
  { n: 13, from: 2414, dur: 342, layout: "B", gist: "Sectors → sub-sectors (B-side; S1 combo @00:07 → S2 Scene_13.mp4 @00:02 ~1:1)" },
  { n: 14, from: 2756, dur: 398, layout: "B", gist: "Concepts (B-side; combo @00:19)" },
  { n: 15, from: 3154, dur: 206, layout: "B", gist: "Groups (B-top centred phone; combo @00:31)" },
  { n: 16, from: 3360, dur: 98, layout: "B", gist: "one screen, every angle (B-top triple phone)" },
  { n: 17, from: 3458, dur: 203, layout: "B", gist: "Hot Themes (B-top centred; Hot_Themes.mp4 ~1:1 rate 0.988)" },
  { n: 18, from: 3662, dur: 119, layout: "A", gist: "don't start from a stock (text card, unchanged)" },
  { n: 19, from: 3780, dur: 334, layout: "B", gist: "open a theme: 4 reads (B-side; combo17_21 @00:00–11 ~1:1)" },
  { n: 20, from: 4114, dur: 271, layout: "B", gist: "Research: catalyst/narrative/risk (B-side; combo17_21 @00:11–19 slow ×1.13)" },
  { n: 21, from: 4384, dur: 325, layout: "B", gist: "Stock tab filters (B-side; combo17_21 @00:19, trimmed to 325f)" },
  { n: 22, from: 4710, dur: 90, layout: "C", gist: "Theme→Story→Stock (B-top 3 phones + cyan arrows)" },
  // S23–27 = ONE continuous take: combo23_27 played 1:1 from 0, fade=0 between them.
  { n: 23, from: 4800, dur: 107, layout: "B", gist: "candidate (B-top; continuous take @00:00, 1:1)" },
  { n: 24, from: 4906, dur: 373, layout: "B", gist: "Quality→Fair Value (B-top; continuous @00:03.5; traveling cyan box)" },
  { n: 25, from: 5280, dur: 150, layout: "B", gist: "Tuntun research (B-top; continuous @00:16)" },
  { n: 26, from: 5430, dur: 391, layout: "B", gist: "Technical/MA5 + disclaimer (B-top; continuous @00:21; box f75–275)" },
  { n: 27, from: 5821, dur: 97, layout: "B", gist: "Company tab Concept Sector (B-top; continuous @00:34)" },
  { n: 28, from: 5918, dur: 210, layout: "B", gist: "multiple themes = conviction (B-side; reuse @00:35)" },
  { n: 29, from: 6128, dur: 82, layout: "A", gist: "how many forces push one way" },
  { n: 30, from: 6210, dur: 515, layout: "A", gist: "they look at a different level (recap)" },
  { n: 31, from: 6725, dur: 113, layout: "A", gist: "start with the theme" },
  { n: 32, from: 6838, dur: 64, layout: "A", gist: "what Concept Sector is built for (end card)" },
];

// Asset filenames (verified, in public/). Centralised so scenes never typo a path.
export const ASSETS = {
  audio: "Most_traders_start__1_.mp3",
  // Video (all 980×1920, 30fps)
  hotThemes: "Scene_17_-_Hot_Themes.mp4",
  sectorScroll: "Scene_13.mp4",
  combo12_15: "Scene_12__13__14__15.mp4", // 37.7s
  combo17_21: "Scene_17__19__20__21.mp4", // 30.3s
  combo23_27: "Scene_23__24__25__26__27.mp4", // 44.3s
  // Stills
  concept1: "Scene_11_-_Concept_Sector_1.jpg", // screen-only (used by RecapMontage S30)
  concept2: "Scene_11_-_Concept_Sector_2.jpg", // screen-only
  // Pre-framed phone mockups (black device bodies, 1925×3890, RGBA/transparent
  // background so they sit cleanly on silver) — S11 Layout C.
  conceptFramed1: "Concept_Sector_1.png", // Trading / Concept Sector home → S11 LEFT
  conceptFramed2: "Concept_Sector_2.png", // IHSG / Investing home → S11 RIGHT
  // Device body for wrapping raw recordings/screenshots (S12–16, Layout B).
  deviceFrame: "Placeholder-02.png", // 1924×3890 RGBA, transparent screen cutout
  tabs3: "Scene_12_-_3_Tabs.png",
  tab1: "Scene_16_-_Tab_1.jpg",
  tab2: "Scene_16_-_Tab_2.jpg",
  tab3: "Scene_16_-_Tab_3.jpg",
  theme22: "Scene_22_-_1_Theme.jpg",
  story22: "Scene_22_-_2_Story.jpg",
  stock22: "Scene_22_-_3_Stock.jpg",
} as const;
