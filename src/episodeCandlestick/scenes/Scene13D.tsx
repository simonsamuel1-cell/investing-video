/**
 * Scene13D — from 8834, duration 210 (7.0s). Recap grid → chart.
 * The full 4×2 pattern grid (all eight studied patterns, no column titles,
 * vertically centered). Over 8834–8957 the pattern names disappear one by one;
 * then the grid clears and the combined price chart appears (8957+).
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { PatternCard } from "../components/PatternCard";
import type { PatternName } from "../components/PatternGlyph";
import { CandleSeries } from "../components/CandleSeries";
import { IllustrationTag } from "../components/IllustrationTag";
import { mulberry32, type OHLC } from "../helpers";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
// 4 family columns × 2 rows, vertically centered (no column titles).
const COL_CX = [354, 774, 1194, 1614];
const ROW_CY = [328, 698];
// Names disappear one by one over 8834–8957 (local 0–123).
const NAME_STAG = 15;
const NAME_DUR = 12;
// Grid clears, then the chart appears at 8957 (local 123).
const GRID_OUT = 118;
const GRID_OUT_DUR = 14;
const CHART_FROM = 123;
// ═══════════════════════════════════════════════════════════════════════════

type Cell = { col: number; row: number; pattern: PatternName; name: string; order: number };
const CELLS: Cell[] = [
  { col: 0, row: 0, pattern: "bullishEngulfing", name: "Bullish Engulfing", order: 0 },
  { col: 0, row: 1, pattern: "bearishEngulfing", name: "Bearish Engulfing", order: 1 },
  { col: 1, row: 0, pattern: "hammer", name: "Hammer", order: 2 },
  { col: 1, row: 1, pattern: "shootingStar", name: "Shooting Star", order: 3 },
  { col: 2, row: 0, pattern: "morningStar", name: "Morning Star", order: 4 },
  { col: 2, row: 1, pattern: "eveningStar", name: "Evening Star", order: 5 },
  { col: 3, row: 0, pattern: "threeWhiteSoldiers", name: "Three White Soldiers", order: 6 },
  { col: 3, row: 1, pattern: "threeBlackCrows", name: "Three Black Crows", order: 7 },
];

// Combined chronological series — the four families embedded in one price path.
const COMBINED: OHLC[] = (() => {
  const rnd = mulberry32(139);
  const out: OHLC[] = [];
  let prev = 1200;
  const pts = [1200, 1320, 1260, 1180, 1300, 1420, 1360, 1280, 1240, 1360, 1480, 1560, 1500, 1440, 1520, 1600, 1560];
  for (let i = 0; i < pts.length; i++) {
    for (let k = 0; k < 2; k++) {
      const target = i + 1 < pts.length ? pts[i] + (pts[i + 1] - pts[i]) * (k / 2) : pts[i];
      const open = prev;
      const close = Math.round(target + (rnd() - 0.5) * 26);
      out.push({ open, high: Math.round(Math.max(open, close) + 5 + rnd() * 12), low: Math.round(Math.min(open, close) - (5 + rnd() * 12)), close });
      prev = close;
    }
  }
  return out;
})();

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const Scene13D = () => {
  const f = useCurrentFrame();
  const gridOpacity = 1 - clamp01((f - GRID_OUT) / GRID_OUT_DUR);
  const chartOpacity = clamp01((f - CHART_FROM) / 12);

  return (
    <SafeArea>
      {gridOpacity > 0.001 &&
        CELLS.map((cell) => (
          <PatternCard
            key={`${cell.col}-${cell.row}`}
            pattern={cell.pattern}
            name={cell.name}
            cx={COL_CX[cell.col]}
            cy={ROW_CY[cell.row]}
            opacity={gridOpacity}
            nameOpacity={1 - clamp01((f - cell.order * NAME_STAG) / NAME_DUR)}
          />
        ))}

      {chartOpacity > 0.001 && (
        <CandleSeries data={COMBINED} x={194} y={220} width={1456} height={680} revealFrom={CHART_FROM} revealStagger={1} opacity={chartOpacity} />
      )}
      <IllustrationTag />
    </SafeArea>
  );
};
