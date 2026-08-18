/**
 * ScreenerTable.tsx — Scene 01's list of stocks, with a candlestick sparkline
 * in the last column.
 *
 * REAL TICKERS, SHOWN PLAINLY. No "Illustration" tag and no disclaimer — the
 * episode's compliance line is that a NUMBER presented as real must be real,
 * and the numbers here are deliberately not presented as real: they render in
 * muted grey at low contrast and none of them is a precise live quote.
 *
 * The counter chip sits top-LEFT of the table. The top-right 360 x 150 is the
 * logo's, and nothing may enter it.
 */
import React from "react";
import { theme } from "../theme";
import { progress, textReveal, seeded, type Rect } from "../helpers";
import { CandleChart } from "./CandleChart";
import { toBars, walk } from "../data/series";

export type ScreenerRow = { ticker: string; last: string; chg: string; vol: string };

/**
 * [NEEDS DATA] Last / Chg% / Volume are DECORATIVE and drawn at reduced
 * contrast. They are shaped like quotes but are not quotes; if Simon wants real
 * figures here they must come from a supplied export, not from this file.
 */
export const SCREENER_ROWS: ScreenerRow[] = [
  { ticker: "BBCA", last: "—", chg: "—", vol: "—" },
  { ticker: "BBRI", last: "—", chg: "—", vol: "—" },
  { ticker: "TLKM", last: "—", chg: "—", vol: "—" },
  { ticker: "ASII", last: "—", chg: "—", vol: "—" },
  { ticker: "GGRM", last: "—", chg: "—", vol: "—" },
  { ticker: "ANTM", last: "—", chg: "—", vol: "—" },
  { ticker: "ADRO", last: "—", chg: "—", vol: "—" },
  { ticker: "ICBP", last: "—", chg: "—", vol: "—" },
];

/** One seeded 12-candle sparkline per row — same array on every frame. */
const SPARKS = SCREENER_ROWS.map((_, i) =>
  toBars(walk({ n: 12, from: 1000, drift: (seeded(101 + i)() - 0.45) * 0.02, noise: 0.02, seed: 101 + i }), 201 + i),
);

export const ROW_H = 88;
export const HEAD_H = 64;

export const ScreenerTable = ({
  rect,
  f,
  cursorRow,
  dimRows = [],
  keepRows,
  extraColumns = false,
  extraAt = 0,
  opacity = 1,
}: {
  rect: Rect;
  f: number;
  /** Which row the inspection cursor is on, or null. */
  cursorRow: number | null;
  /** Rows that have been filtered out — they dim, slide right and go. */
  dimRows?: number[];
  /** Rows that survive the filter and gain an indigo left border. */
  keepRows?: number[];
  extraColumns?: boolean;
  extraAt?: number;
  opacity?: number;
}) => {
  if (opacity <= 0.001) return null;
  const cols = extraColumns
    ? [0.16, 0.3, 0.42, 0.56, 0.7, 0.83, 0.95]
    : [0.2, 0.38, 0.52, 0.68, 0.9];
  const at = (k: number) => rect.x + rect.w * cols[k];
  const headings = extraColumns
    ? ["Ticker", "Last", "Chg%", "Volume", "Chart", "MA20 >", "BB Width"]
    : ["Ticker", "Last", "Chg%", "Volume", "Chart"];

  return (
    <div style={{ opacity }}>
      {/* header rule */}
      <div
        style={{
          position: "absolute",
          left: rect.x,
          top: rect.y + HEAD_H,
          width: rect.w,
          height: theme.shape.hairline,
          background: theme.color.hairline,
        }}
      />
      {headings.map((h, k) => (
        <div
          key={h}
          style={{
            position: "absolute",
            left: at(k),
            top: rect.y + HEAD_H / 2,
            transform: "translate(-50%, -50%)",
            fontFamily: theme.text.family,
            fontSize: theme.text.tag.size,
            fontWeight: theme.text.chip.weight,
            color: k >= 5 ? theme.color.indigo : theme.color.slate,
            opacity: k >= 5 ? progress(f, extraAt, 12) : 1,
            whiteSpace: "nowrap",
          }}
        >
          {h}
        </div>
      ))}

      {SCREENER_ROWS.map((r, i) => {
        const y = rect.y + HEAD_H + i * ROW_H;
        const dimmed = dimRows.includes(i);
        const gone = dimmed ? progress(f, extraAt + 40, 18) : 0;
        const kept = (keepRows ?? []).includes(i);
        const rowOpacity = dimmed ? 1 - gone * 0.8 : 1;
        return (
          <React.Fragment key={r.ticker}>
            {cursorRow === i && (
              <div
                style={{
                  position: "absolute",
                  left: rect.x,
                  top: y,
                  width: rect.w,
                  height: ROW_H,
                  background: theme.color.indigo12,
                  borderRadius: theme.shape.chipRadius,
                }}
              />
            )}
            {kept && (
              <div
                style={{
                  position: "absolute",
                  left: rect.x,
                  top: y + 10,
                  width: theme.shape.rule,
                  height: ROW_H - 20,
                  background: theme.color.indigo,
                }}
              />
            )}
            <div style={{ opacity: rowOpacity, transform: `translateX(${gone * 40}px)` }}>
              <div
                style={{
                  position: "absolute",
                  left: at(0),
                  top: y + ROW_H / 2,
                  transform: "translate(-50%, -50%)",
                  fontFamily: theme.text.family,
                  fontSize: theme.text.chip.size,
                  fontWeight: theme.text.chip.weight,
                  color: theme.color.ink,
                }}
              >
                {r.ticker}
              </div>
              {[r.last, r.chg, r.vol].map((v, k) => (
                <div
                  key={k}
                  style={{
                    position: "absolute",
                    left: at(k + 1),
                    top: y + ROW_H / 2,
                    transform: "translate(-50%, -50%)",
                    fontFamily: theme.text.family,
                    fontSize: theme.text.tag.size,
                    fontWeight: theme.text.body.weight,
                    fontVariantNumeric: "tabular-nums",
                    color: theme.color.faint,
                  }}
                >
                  {v}
                </div>
              ))}
              <CandleChart
                bars={SPARKS[i]}
                box={{ x: at(4) - 60, y: y + 22, w: 120, h: ROW_H - 44 }}
                axis={false}
                pad={0.12}
              />
              {extraColumns &&
                [5, 6].map((k) => {
                  const rv = textReveal(f, extraAt + 8 + i * 2 + (k - 5) * 2);
                  return (
                    <div
                      key={k}
                      style={{
                        position: "absolute",
                        left: at(k),
                        top: y + ROW_H / 2 + rv.dy,
                        transform: "translate(-50%, -50%)",
                        fontFamily: theme.text.family,
                        fontSize: theme.text.tag.size,
                        fontWeight: theme.text.tag.weight,
                        fontVariantNumeric: "tabular-nums",
                        color: theme.color.slate,
                        opacity: rv.opacity,
                      }}
                    >
                      {k === 5 ? (i % 3 === 0 ? "Ya" : "—") : i % 3 === 0 ? "Sempit" : "—"}
                    </div>
                  );
                })}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
