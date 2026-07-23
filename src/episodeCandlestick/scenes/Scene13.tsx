/**
 * Scene13 — from 7766, duration 601 frames.
 * 2×2 matrix of the four studied patterns (Bullish/Bearish × One/Two Candles):
 * cards fly in staggered, path lines pulse to full while outlines dim, then
 * restore; the matrix compresses to the left half and a 12-candle mini chart
 * contrasts a Weak (mid-range low) vs Strong (low on support) Hammer with
 * neutralMuted / indigo rings and chips.
 * Compliance: fictional SAHAM A, illustrative data only — no arrows, entry
 * markers, or price targets. Ticker skipped on the mini chart (the 1330
 * reference line crosses the only clean label band — it would crowd).
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { sec, fadeIn, progress, textReveal, mulberry32, priceScale, type OHLC } from "../helpers";
import { SafeArea } from "../components/SafeArea";
import { PatternGlyph, type PatternName } from "../components/PatternGlyph";
import { CandleSeries } from "../components/CandleSeries";
import { ReferenceLine } from "../components/ReferenceLine";
import { Chip } from "../components/Chip";
import { IllustrationTag } from "../components/IllustrationTag";

// ═══ EDIT ═══
const CELL_W = 500; // matrix card size, px (narrowed from spec's 560 to fit horizontal row labels)
const CELL_H = 300;
const GRID_GAP = 48;
const GRID_CX = 780; // matrix center x before compression
const GRID_TOP = 250;
const GLYPH_SIZE = 200;
const HEADER_Y = 190; // column headers, vertical center
const ROW_LABEL_X = 96; // row labels: horizontal two-line block, left edge
const CARD_FLY_PAD = 80; // extra off-frame travel, px
const COMPRESS_SCALE = 0.8;
const COMPRESS_CX = 480; // matrix center x after compression
const MINI_LEFT = 960; // mini chart box, px
const MINI_RIGHT = 1600;
const MINI_TOP = 280;
const MINI_BOTTOM = 720;
const N_MINI = 12;
const WEAK_IDX = 5; // mid-range Hammer
const STRONG_IDX = 11; // Hammer low on the 1205 line
const REF_LO = 1205; // dashed reference levels, Rp
const REF_HI = 1330;
const RING_PAD = 14; // ring radius beyond the candle half-span
const CHIP_Y = 830; // Weak / Strong chip tops (below the mini panel)
const T = {
  labels: 0.0, // axis labels reveal
  cards: 0.8, // first card flies in
  cardStagger: 0.3, // TL → TR → BL → BR
  cardDur: 0.7,
  emph: 5.0, // path lines 0.35→1, outlines 1→0.3
  emphDur: 1.0,
  restore: 9.0, // outlines restore
  restoreDur: 0.4,
  compress: 12.5, // matrix compresses to the left half
  compressDur: 0.8,
  mini: 13.4, // mini chart wipes in
  refs: 13.9, // reference lines draw
  refDur: 0.5,
  ringWeak: 15.6, // Weak ring + chip
  ringStrong: 16.0, // Strong ring + chip (+0.4s)
  hold: 20.0,
};
// ═══════════

const GRID_LEFT = GRID_CX - CELL_W - GRID_GAP / 2; // 116
const GRID_CY = GRID_TOP + CELL_H + GRID_GAP / 2; // 574
const COL_CX = [GRID_LEFT + CELL_W / 2, GRID_LEFT + CELL_W + GRID_GAP + CELL_W / 2]; // 396 / 1004
const ROW_CY = [GRID_TOP + CELL_H / 2, GRID_TOP + CELL_H + GRID_GAP + CELL_H / 2]; // 400 / 748

const CELLS: { pattern: PatternName; col: number; row: number }[] = [
  { pattern: "hammer", col: 0, row: 0 },
  { pattern: "shootingStar", col: 1, row: 0 },
  { pattern: "bullishEngulfing", col: 0, row: 1 },
  { pattern: "bearishEngulfing", col: 1, row: 1 },
];

const buildMini = (): OHLC[] => {
  const rng = mulberry32(13);
  const list: OHLC[] = [];
  for (let i = 0; i < N_MINI; i++) {
    const mid = 1255 + rng() * 40;
    const body = 10 + rng() * 18;
    const up = rng() > 0.5;
    const open = up ? mid - body / 2 : mid + body / 2;
    const close = up ? mid + body / 2 : mid - body / 2;
    const high = Math.max(open, close) + 3 + rng() * 9;
    const low = Math.min(open, close) - (3 + rng() * 9);
    list.push({ open, high, low, close });
  }
  list[WEAK_IDX] = { open: 1268, high: 1276, low: 1192, close: 1274 }; // low mid-range, NOT on a line
  list[STRONG_IDX] = { open: 1252, high: 1260, low: 1205, close: 1258 }; // low exactly ON the 1205 line
  return list;
};

const MINI = buildMini();
const MINI_MIN = Math.min(...MINI.map((c) => c.low));
const miniScale = priceScale(MINI_MIN, REF_HI, MINI_TOP, MINI_BOTTOM);
const MINI_SLOT = (MINI_RIGHT - MINI_LEFT) / N_MINI;
const mcx = (i: number) => MINI_LEFT + MINI_SLOT * (i + 0.5);
const ringCy = (i: number) => (miniScale(MINI[i].high) + miniScale(MINI[i].low)) / 2;
const ringR = (i: number) => (miniScale(MINI[i].low) - miniScale(MINI[i].high)) / 2 + RING_PAD;

export const Scene13 = () => {
  const f = useCurrentFrame();

  // Glyph emphasis: path lines up while outlines dim, then restore.
  const emphOn = progress(f, sec(T.emph), sec(T.emphDur));
  const emphOff = progress(f, sec(T.restore), sec(T.restoreDur));
  const emph = emphOn * (1 - emphOff);
  const pathOp = 0.35 + 0.65 * emph;
  const outlineOp = 1 - 0.7 * emph;

  // Matrix compression to the left half.
  const pc = progress(f, sec(T.compress), sec(T.compressDur));

  const labelReveal = textReveal(f, sec(T.labels));

  const header = (label: string, cx: number) => (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: HEADER_Y,
        transform: `translate(-50%, -50%) translateY(${labelReveal.y}px)`,
        opacity: labelReveal.opacity,
        fontSize: theme.type.header.size,
        fontWeight: theme.type.header.weight,
      }}
    >
      {label}
    </div>
  );

  // Horizontal two-line row labels (never rotated); they fade during the
  // compression so nothing travels off-canvas with the wrapper transform.
  const rowLabel = (label: string, cy: number) => (
    <div
      style={{
        position: "absolute",
        left: ROW_LABEL_X,
        top: cy,
        width: GRID_LEFT - ROW_LABEL_X - 12,
        transform: `translateY(-50%) translateY(${labelReveal.y}px)`,
        opacity: labelReveal.opacity * (1 - pc),
        fontSize: theme.type.label.size,
        fontWeight: theme.type.label.weight,
        lineHeight: 1.15,
        color: theme.colors.slate,
        textAlign: "right",
      }}
    >
      {label.split(" ").map((w) => (
        <div key={w}>{w}</div>
      ))}
    </div>
  );

  return (
    <SafeArea>
      {/* Matrix wrapper — cards + row/column labels compress together. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: theme.canvas.width,
          height: theme.canvas.height,
          transform: `translateX(${(COMPRESS_CX - GRID_CX) * pc}px) scale(${1 - (1 - COMPRESS_SCALE) * pc})`,
          transformOrigin: `${GRID_CX}px ${GRID_CY}px`,
        }}
      >
        {header("Bullish", COL_CX[0])}
        {header("Bearish", COL_CX[1])}
        {rowLabel("One Candle", ROW_CY[0])}
        {rowLabel("Two Candles", ROW_CY[1])}

        {CELLS.map((cell, i) => {
          const start = sec(T.cards + i * T.cardStagger);
          const p = progress(f, start, sec(T.cardDur));
          const cellX = GRID_LEFT + cell.col * (CELL_W + GRID_GAP);
          const cellY = GRID_TOP + cell.row * (CELL_H + GRID_GAP);
          const off =
            cell.col === 0
              ? -(cellX + CELL_W + CARD_FLY_PAD)
              : theme.canvas.width - cellX + CARD_FLY_PAD;
          return (
            <div
              key={cell.pattern}
              style={{
                position: "absolute",
                left: cellX,
                top: cellY,
                width: CELL_W,
                height: CELL_H,
                background: theme.colors.neutralFill,
                border: `${theme.stroke.hairline}px solid ${theme.colors.neutralLine}`,
                borderRadius: theme.radius.card,
                transform: `translateX(${off * (1 - p)}px)`,
              }}
            >
              <PatternGlyph
                pattern={cell.pattern}
                cx={CELL_W / 2}
                top={(CELL_H - GLYPH_SIZE) / 2}
                size={GLYPH_SIZE}
                showPathLine
                pathLineOpacity={pathOp}
                outlineOpacity={outlineOp}
              />
            </div>
          );
        })}
      </div>

      {/* Weak-vs-strong Hammer mini chart (right half). */}
      {f >= sec(T.mini) && (
        <div style={{ position: "absolute", left: 0, top: 0, opacity: fadeIn(f, sec(T.mini), 12) }}>
          <CandleSeries
            data={MINI}
            x={MINI_LEFT}
            y={MINI_TOP}
            width={MINI_RIGHT - MINI_LEFT}
            height={MINI_BOTTOM - MINI_TOP}
            revealFrom={sec(T.mini)}
            revealStagger={2}
            scaleOverride={miniScale}
          />
          {f >= sec(T.refs) && (
            <>
              <ReferenceLine
                y={miniScale(REF_LO)}
                x1={MINI_LEFT}
                x2={MINI_RIGHT}
                drawProgress={progress(f, sec(T.refs), sec(T.refDur))}
              />
              <ReferenceLine
                y={miniScale(REF_HI)}
                x1={MINI_LEFT}
                x2={MINI_RIGHT}
                drawProgress={progress(f, sec(T.refs), sec(T.refDur))}
              />
            </>
          )}
          {f >= sec(T.ringWeak) && (
            <svg
              style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
              width={theme.canvas.width}
              height={theme.canvas.height}
            >
              <circle
                cx={mcx(WEAK_IDX)}
                cy={ringCy(WEAK_IDX)}
                r={ringR(WEAK_IDX)}
                fill="none"
                stroke={theme.colors.neutralMuted}
                strokeWidth={theme.stroke.standard}
                opacity={fadeIn(f, sec(T.ringWeak), 8)}
              />
              {f >= sec(T.ringStrong) && (
                <circle
                  cx={mcx(STRONG_IDX)}
                  cy={ringCy(STRONG_IDX)}
                  r={ringR(STRONG_IDX)}
                  fill="none"
                  stroke={theme.colors.indigo}
                  strokeWidth={theme.stroke.standard}
                  opacity={fadeIn(f, sec(T.ringStrong), 8)}
                />
              )}
            </svg>
          )}
          <Chip label="Weak" variant="muted" x={mcx(WEAK_IDX)} y={CHIP_Y} startFrame={sec(T.ringWeak)} />
          <Chip label="Strong" variant="indigo" x={mcx(STRONG_IDX)} y={CHIP_Y} startFrame={sec(T.ringStrong)} />
        </div>
      )}

      <IllustrationTag />
    </SafeArea>
  );
};
