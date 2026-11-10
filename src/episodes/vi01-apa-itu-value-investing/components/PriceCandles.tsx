/**
 * The investor's price card in SC01 as candlesticks (Simon 10 Nov: "remake gambar chartnya jadi candlestick yang turun 3%",
 * from the earlier candle videos): core <Candles> on a core grid, as VI02 SC05's ABCD card draws them. A made-up stock with
 * no code — six bars from 100 down to exactly 97, so the card's −3% is the tape's own move.
 * SourceTag prints nothing for it (synthetic).
 */
import { Candles, SourceTag, gridOf, theme, typeStyle, usePalette, type Bar } from "../../../core";
import { Glyph } from "./kit";

/** Six bars (Simon 10 Nov), open 100 → close exactly 97: down, a green breath, down twice, a green breath, a last red bar. */
export const FALL_BARS: Bar[] = [
  { o: 100, h: 100.25, l: 99.35, c: 99.5 },
  { o: 99.5, h: 99.95, l: 99.3, c: 99.8 },
  { o: 99.8, h: 99.9, l: 98.75, c: 98.9 },
  { o: 98.9, h: 99.05, l: 98.1, c: 98.25 },
  { o: 98.25, h: 98.75, l: 98.1, c: 98.6 },
  { o: 98.6, h: 98.7, l: 96.8, c: 97 },
];
const LO = Math.min(...FALL_BARS.map((b) => b.l));
const HI = Math.max(...FALL_BARS.map((b) => b.h));

/**
 * The card's content at scale `s`, for a card `w` × `h`: a candlestick icon (black outline), the title and −3% beside it
 * (Simon 10 Nov), the tape under them. `draw` 0..1 lays the bars down; `change` shows −3%.
 */
export const PriceCandles = ({ title, w, h, s = 1, draw = 1, change = 1 }: { title: string; w: number; h: number; s?: number; draw?: number; change?: number }) => {
  const c = usePalette();
  const pad = 44 * s;
  const head = 40 * s + 72 * s + 30 * s;
  const grid = gridOf(FALL_BARS.map((b) => b.c), [LO, HI], { x: pad, y: head, w: w - 2 * pad, h: Math.max(10, h - head - 44 * s) }, 0.06);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: pad, top: 40 * s, height: 72 * s, display: "flex", alignItems: "center", gap: 20 * s }}>
        <Glyph icon="candlestick" size={60 * s} tone={c.ink} />
        <div style={{ ...typeStyle("title"), fontSize: 50 * s, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{title}</div>
        <div style={{ ...typeStyle("title"), fontSize: 50 * s, fontWeight: 600, color: theme.color.crossRed, opacity: change, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", marginLeft: 6 * s }}>−3%</div>
      </div>
      {/* where the day opened, so the fall below it reads at a glance */}
      <div style={{ position: "absolute", left: pad, right: pad, top: grid.y(100), height: 0, borderTop: `${Math.max(1, 2 * s)}px dashed ${theme.color.skeleton}`, opacity: draw > 0.001 ? 1 : 0 }} />
      {draw > 0.001 ? <Candles bars={FALL_BARS} grid={grid} shown={draw} /> : null}
      <SourceTag kind="synthetic" />
    </div>
  );
};
