/**
 * Scene13A — from 7773, duration 242 (8.07s).
 * Recreation of the Scene08 pattern-card layout (frame 3834), re-laid as a 4×2
 * grid: four family columns × two rows. Two columns are populated for now:
 *   col 1 "Engulfings"          → Bullish Engulfing (r1), Bearish Engulfing (r2)
 *   col 2 "Hammer/Shooting Star" → Hammer (r1), Shooting Star (r2)
 * The other two columns stay empty.
 * Timeline (scene-local frames): 0–70 the eight rectangles sit empty;
 * 71–159 the four glyphs fade in inside their cells.
 * No price chart → no IllustrationTag / Ticker (matches Scene08).
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { PatternCard } from "../components/PatternCard";
import type { PatternName } from "../components/PatternGlyph";
import { theme } from "../theme";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
// 4 columns × 2 rows. Centers mirror Scene08's studied-row spacing.
const COL_CX = [354, 774, 1194, 1614];
const ROW_CY = [410, 780];
const HEADER_TOP = 176;
// Pattern reveal window: 7844 = local 71, 7932 = local 159.
const PAT_FROM = 71;
const PAT_STAGGER = 16;
const PAT_DUR = 12;
// The four empty cells get a big grey "?" from 7936 (local 163).
const Q_FROM = 163;
const Q_DUR = 12;
// ═══════════════════════════════════════════════════════════════════════════

type Cell = { col: number; row: number; pattern?: PatternName; name?: string; order?: number };

const CELLS: Cell[] = [
  { col: 0, row: 0, pattern: "bullishEngulfing", name: "Bullish Engulfing", order: 0 },
  { col: 0, row: 1, pattern: "bearishEngulfing", name: "Bearish Engulfing", order: 1 },
  { col: 1, row: 0, pattern: "hammer", name: "Hammer", order: 2 },
  { col: 1, row: 1, pattern: "shootingStar", name: "Shooting Star", order: 3 },
  { col: 2, row: 0 },
  { col: 2, row: 1 },
  { col: 3, row: 0 },
  { col: 3, row: 1 },
];

// firstOrder = the reveal order of that column's first pattern; the header fades
// in together with it.
const COLUMN_TITLES: { col: number; label: string; firstOrder: number }[] = [
  { col: 0, label: "Engulfings", firstOrder: 0 },
  { col: 1, label: "Hammer/Shooting Star", firstOrder: 2 },
];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const Scene13A = () => {
  const f = useCurrentFrame();
  const rectOpacity = clamp01(f / 12); // rectangles fade in over the first ~0.4s

  return (
    <SafeArea>
      {COLUMN_TITLES.map(({ col, label, firstOrder }) => (
        <div
          key={col}
          style={{
            position: "absolute",
            left: COL_CX[col] - 200,
            width: 400,
            top: HEADER_TOP,
            textAlign: "center",
            fontFamily: theme.type.family,
            fontSize: 32,
            fontWeight: 600,
            color: theme.colors.indigo,
            opacity: clamp01((f - (PAT_FROM + firstOrder * PAT_STAGGER)) / PAT_DUR),
          }}
        >
          {label}
        </div>
      ))}

      {CELLS.map((cell) => {
        const contentOpacity =
          cell.order === undefined ? 0 : clamp01((f - (PAT_FROM + cell.order * PAT_STAGGER)) / PAT_DUR);
        return (
          <PatternCard
            key={`${cell.col}-${cell.row}`}
            pattern={cell.pattern}
            name={cell.name}
            cx={COL_CX[cell.col]}
            cy={ROW_CY[cell.row]}
            opacity={rectOpacity}
            contentOpacity={contentOpacity}
          />
        );
      })}

      {CELLS.filter((c) => c.order === undefined).map((cell) => (
        <div
          key={`q-${cell.col}-${cell.row}`}
          style={{
            position: "absolute",
            left: COL_CX[cell.col] - 100,
            width: 200,
            top: ROW_CY[cell.row] - 110,
            textAlign: "center",
            fontFamily: theme.type.family,
            fontSize: 150,
            fontWeight: 700,
            color: theme.colors.slate,
            opacity: clamp01((f - Q_FROM) / Q_DUR),
          }}
        >
          ?
        </div>
      ))}
    </SafeArea>
  );
};
