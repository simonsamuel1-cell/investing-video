/**
 * Scene08 — from 3657, duration 501 frames (16.7s).
 * Pattern-card grid: 12 cards fade into a 4×3 grid (0–3810). At 3811 the four
 * studied patterns (Hammer, Bullish Engulfing, Shooting Star, Bearish Engulfing)
 * sort out of the scattered grid into a single row at full size while the others
 * fade away. At 4022 the four names fade and each glyph re-centers vertically in
 * its card.
 * No price chart → NO IllustrationTag, NO Ticker.
 * Compliance: theme-only type/easing, frame-driven deterministic (no Math.random),
 * cards clear of the logo zone and the bottom 108px subtitle zone.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { sec, fadeIn, fadeOut, progress } from "../helpers";
import { SafeArea } from "../components/SafeArea";
import { PatternCard, GLYPH_TOP_DEFAULT, GLYPH_TOP_CENTER } from "../components/PatternCard";
import type { PatternName } from "../components/PatternGlyph";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
// Grid (6 cols × 3 rows), cards scaled down to fit.
const GRID_SCALE = 0.62;
const GRID_COL_X = [345, 591, 837, 1083, 1329, 1575]; // column centers (spacing 246, centered on 960)
const GRID_ROW_Y = [278, 539, 800]; // row centers
// Studied-pattern one-row targets (full size).
const ROW_CY = 480;
const TARGET_X: Partial<Record<PatternName, number>> = {
  hammer: 354,
  bullishEngulfing: 774,
  shootingStar: 1194,
  bearishEngulfing: 1614,
};
// Timings (seconds, scene-local). 3811 = 5.13s · 4022 = 12.17s · 4049 = 13.07s · 4126 = 15.63s.
const T = {
  gridIn: 0.0, // cards fade into the grid
  sort: 5.133, // studied → single row; others fade out (frame 3811)
  sortDur: 0.8,
  nameFade: 12.167, // studied names fade (frame 4022)
  glyphCenter: 12.167, // glyphs re-center vertically
  glyphCenterDur: 0.6,
  pathIn: 13.067, // thin indigo path lines fade in on the 4 studied glyphs (frame 4049)
  pathOut: 15.633, // path lines fade out (frame 4126)
};
// ═══════════════════════════════════════════════════════════════════════════

type Card = { pattern: PatternName; name: string; row: number; col: number };

// Grid placement — the four studied patterns are scattered across the grid.
// Cols 0–3 keep the original 12 cards; cols 4–5 add six more (cheat-sheet
// patterns + two common singles).
const CARDS: Card[] = [
  { pattern: "hammer", name: "Hammer", row: 0, col: 0 },
  { pattern: "doji", name: "Doji", row: 0, col: 1 },
  { pattern: "shootingStar", name: "Shooting Star", row: 0, col: 2 },
  { pattern: "morningStar", name: "Morning Star", row: 0, col: 3 },
  { pattern: "invertedHammer", name: "Inverted Hammer", row: 0, col: 4 },
  { pattern: "threeWhiteSoldiers", name: "Three White Soldiers", row: 0, col: 5 },
  { pattern: "eveningStar", name: "Evening Star", row: 1, col: 0 },
  { pattern: "bullishEngulfing", name: "Bullish Engulfing", row: 1, col: 1 },
  { pattern: "harami", name: "Harami", row: 1, col: 2 },
  { pattern: "marubozu", name: "Marubozu", row: 1, col: 3 },
  { pattern: "darkCloudCover", name: "Dark Cloud Cover", row: 1, col: 4 },
  { pattern: "threeBlackCrows", name: "Three Black Crows", row: 1, col: 5 },
  { pattern: "hangingMan", name: "Hanging Man", row: 2, col: 0 },
  { pattern: "piercingLine", name: "Piercing Line", row: 2, col: 1 },
  { pattern: "bearishEngulfing", name: "Bearish Engulfing", row: 2, col: 2 },
  { pattern: "tweezerTop", name: "Tweezer Top", row: 2, col: 3 },
  { pattern: "spinningTop", name: "Spinning Top", row: 2, col: 4 },
  { pattern: "gravestoneDoji", name: "Gravestone Doji", row: 2, col: 5 },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const Scene08 = () => {
  const f = useCurrentFrame();

  const gridOpacity = fadeIn(f, sec(T.gridIn));
  const sortQ = f >= sec(T.sort) ? progress(f, sec(T.sort), sec(T.sortDur)) : 0;
  const glyphTop = interpolate(
    f,
    [sec(T.glyphCenter), sec(T.glyphCenter) + sec(T.glyphCenterDur)],
    [GLYPH_TOP_DEFAULT, GLYPH_TOP_CENTER],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Thin indigo path line on the 4 studied glyphs: fade in 4049, fade out 4126.
  const pathOpacity = interpolate(
    f,
    [sec(T.pathIn), sec(T.pathIn) + 8, sec(T.pathOut) - 8, sec(T.pathOut)],
    [0, 0.42, 0.42, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <SafeArea>
      {CARDS.map((card) => {
        const gridX = GRID_COL_X[card.col];
        const gridY = GRID_ROW_Y[card.row];
        const target = TARGET_X[card.pattern];
        const studied = target !== undefined;

        if (studied) {
          // Grid slot → single row, scaling up to full size.
          const cx = lerp(gridX, target, sortQ);
          const cy = lerp(gridY, ROW_CY, sortQ);
          const scale = lerp(GRID_SCALE, 1, sortQ);
          return (
            <PatternCard
              key={card.pattern}
              pattern={card.pattern}
              name={card.name}
              cx={cx}
              cy={cy}
              scale={scale}
              opacity={gridOpacity}
              nameOpacity={fadeOut(f, sec(T.nameFade))}
              glyphTop={glyphTop}
              showPathLine={pathOpacity > 0.001}
              pathLineOpacity={pathOpacity}
            />
          );
        }
        // Non-studied — hold in the grid, then fade out during the sort.
        return (
          <PatternCard
            key={card.pattern}
            pattern={card.pattern}
            name={card.name}
            cx={gridX}
            cy={gridY}
            scale={GRID_SCALE}
            opacity={gridOpacity * fadeOut(f, sec(T.sort))}
          />
        );
      })}
    </SafeArea>
  );
};
