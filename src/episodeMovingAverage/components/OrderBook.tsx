/**
 * OrderBook.tsx — five bids, five asks, quantities NEARLY BALANCED.
 *
 * The one thing this graphic has to say is that nobody is in a hurry: buyers
 * and sellers are both waiting. Its quantities are therefore generated from one
 * seed and mirrored, so neither side can accidentally look heavier and turn a
 * volatility explainer into a directional call.
 *
 * Green and red are permitted on these rows — this and candle bodies are the
 * only two places in the episode where they appear.
 */
import React from "react";
import { theme } from "../theme";
import { progress, seeded, price, type Rect } from "../helpers";
import { Panel } from "./Panels";

const LEVELS = 5;
const MID = 5_000;
const TICK = 25;

/** One seed, both sides — symmetry by construction, not by eye. */
const QTY = (() => {
  const rnd = seeded(909);
  return Array.from({ length: LEVELS }, () => 40 + Math.round(rnd() * 30));
})();

export const OrderBook = ({
  rect,
  f,
  at,
  opacity = 1,
}: {
  rect: Rect;
  f: number;
  at: number;
  opacity?: number;
}) => {
  if (f < at || opacity <= 0.001) return null;
  const rowH = (rect.h - 84) / (LEVELS * 2);
  const maxQty = Math.max(...QTY);
  const row = (i: number, side: "bid" | "ask") => {
    const k = side === "ask" ? LEVELS - 1 - i : i;
    const y = rect.y + 72 + (side === "ask" ? i : LEVELS + i) * rowH;
    const qty = QTY[k];
    const on = progress(f, at + 6 + i * 2 + (side === "ask" ? 0 : 10), 12);
    const p = side === "ask" ? MID + TICK * (LEVELS - i) : MID - TICK * (i + 1);
    const tone = side === "ask" ? theme.color.candleRed : theme.color.candleGreen;
    return (
      <React.Fragment key={`${side}${i}`}>
        <div
          style={{
            position: "absolute",
            left: side === "ask" ? rect.x + rect.w - 24 - (rect.w - 48) * 0.42 * (qty / maxQty) * on : rect.x + 24,
            top: y + 6,
            width: (rect.w - 48) * 0.42 * (qty / maxQty) * on,
            height: rowH - 12,
            background: tone,
            opacity: 0.16,
            borderRadius: 6,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: rect.x + 24,
            top: y + rowH / 2,
            transform: "translateY(-50%)",
            fontFamily: theme.text.family,
            fontSize: theme.text.tag.size,
            fontWeight: theme.text.tag.weight,
            fontVariantNumeric: "tabular-nums",
            color: tone,
            opacity: on,
          }}
        >
          {price(p)}
        </div>
        <div
          style={{
            position: "absolute",
            left: rect.x + rect.w - 24,
            top: y + rowH / 2,
            transform: "translate(-100%, -50%)",
            fontFamily: theme.text.family,
            fontSize: theme.text.tag.size,
            fontWeight: theme.text.tag.weight,
            fontVariantNumeric: "tabular-nums",
            color: theme.color.slate,
            opacity: on,
          }}
        >
          {qty}
        </div>
      </React.Fragment>
    );
  };
  return (
    <Panel rect={rect} opacity={opacity}>
      <div
        style={{
          position: "absolute",
          left: rect.x + 24,
          top: rect.y + 22,
          fontFamily: theme.text.family,
          fontSize: theme.text.tag.size,
          fontWeight: theme.text.chip.weight,
          color: theme.color.slate,
        }}
      >
        Order book
      </div>
      {Array.from({ length: LEVELS }, (_, i) => row(i, "ask"))}
      {Array.from({ length: LEVELS }, (_, i) => row(i, "bid"))}
    </Panel>
  );
};
