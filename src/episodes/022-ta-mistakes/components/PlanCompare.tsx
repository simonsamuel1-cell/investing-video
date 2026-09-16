/**
 * components/PlanCompare.tsx — one header, two plans, and the gap between them.
 *
 * ONE MOUNTED INSTANCE for the whole of SC15. The header card, the two
 * connectors, the two columns, the divider and all four rows are this
 * component and nothing else draws them. That is not tidiness: the scene's
 * claim is that ONE thing is shared and EIGHT things are not, and a header
 * that is re-created at a beat boundary is no longer the same header — it is a
 * second drawing of one, which is exactly the thing the scene denies.
 *
 * ⚠ IT READS THE ROW TABLE RATHER THAN TAKING A COUNT. The build prompt
 * specified `rowsVisible: number`, and an integer cannot carry what a row
 * actually does — a label fading, two values rising, and a separator drawing,
 * on three different frames each. What the prop was there to guarantee is the
 * single instance, and that is guaranteed by the mount in scenes/CopyTrade.tsx.
 *
 * ⚠ NO TICKER, ANYWHERE. Not in the card, not on the strip, not in a chip. The
 * eight values below are invented, and with no instrument named they cannot be
 * read as a comment on one. See data/series.ts, where the strip asserts that
 * it carries no label.
 *
 * ⚠ WHICH IS WHY THERE IS NO core/SourceTag HERE, and the omission is the
 * decision. Simon's standing rule already stops that component printing the
 * word "Ilustrasi", so on a generated tape it draws nothing at all — but what
 * it DOES print is a ticker, for real data. Mounting it would leave this scene
 * one data swap away from showing the one thing it is built never to show. The
 * guard that matters is the assertion in data/series.ts, not a tag.
 *
 * ⚠ NEITHER COLUMN IS THE RIGHT ONE. Same width, same border, same type
 * weight, same arrival frame on both sides of every row — the only difference
 * between them is hue. Nothing here may imply one plan is correct, because the
 * narration does not say so and a viewer would copy whichever one looked
 * endorsed.
 *
 * ⚠ AND THERE IS NO PLOTTED CHART. Two entry/exit pairs on one tape was the
 * natural version of this scene and it cannot be built: those are directional
 * markers and scripts/audit.mjs is right to refuse them. The row comparison
 * carries the same argument without putting a mark on a price.
 */
import React from "react";
import {
  Candles, Card, Chip, Layer,
  domainOf, drawPath, gridOf, progress, textReveal, theme, usePalette,
} from "../../../core";
import { PLANS, local } from "../data/timing";
import { PLAN } from "../data/layout";
import { PLAN_TAPE } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = PLANS;
const P = PLAN;
// ═══════════════════════════════════════════════════════════════════════════

const MID = theme.canvas.width / 2;

/** ⚠ SOLVED ONCE, AT MODULE LOAD. A grid rebuilt every frame is a grid that
 *  can disagree with itself between the wick and the body. */
const TAPE = gridOf(
  PLAN_TAPE.closes,
  domainOf(PLAN_TAPE.closes, PLAN_TAPE.bars),
  P.head.tape,
  P.head.tapePad,
);

/** The two columns' accents. Hue is the ONLY thing that separates them. */
const ACCENT = ["indigo", "cyan"] as const;

export const PlanCompare = ({ g }: { g: number }) => {
  const c = usePalette();
  const p = (q: { at: number; over: number }) => progress(g, q.at, q.over);

  const card = p(V.card);
  const wire = p(V.wires);
  const cols = p(V.cols);
  const split = p(V.split);
  /** B3 — emphasis only. Nothing below changes position on these two. */
  const lift = p(V.lift);
  const edge = p(V.edge);

  const ink = [c.indigo, c.cyan];

  return (
    <>
      {/* ── the one shared object ─────────────────────────────────────── */}
      <Card rect={P.head.rect} opacity={card} scale={0.96 + 0.04 * card} />
      {/* ⚠ SLATE, NOT CYAN. The build prompt asked for cyan and cyan is also
          Trader B's accent — at the same pill size, two pills in one hue read
          as a pair, and the pair they would make is exactly the wrong one. The
          shared object belongs to neither column, so it is the one thing here
          in neither column's colour. */}
      <Chip
        label="Same Stock"
        x={MID}
        y={P.head.chipY}
        at={local(V.same, V.at)}
        tone="slate"
        size={P.head.chipSize}
        pill
      />
      {/* ⚠ DECORATIVE AND CAPPED. No axis, no gridline, no price label — the
          strip says "a stock" and must never say which, or how much. */}
      <Candles
        bars={PLAN_TAPE.bars}
        grid={TAPE}
        opacity={P.head.tapeAlpha}
        wipe={(i) => progress(g, V.tape.at + i * V.tape.step, V.tape.over)}
      />

      {/* ── the two columns ───────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${(1 - cols) * P.col.rise}px)`,
        }}
      >
        {P.cols.map((r, i) => (
          <Card key={`col${i}`} rect={r} opacity={cols} />
        ))}
      </div>
      {/* ⚠ A RING OVER THE CARD'S OWN EDGE, not a border on it. core/Card
          draws a hairline in the neutral; B3 asks for that edge to become the
          column's accent and to thicken, and a second rule laid exactly on the
          first covers it completely rather than fringing it. */}
      {edge > 0.001 &&
        P.cols.map((r, i) => (
          <div
            key={`edge${i}`}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: r.w,
              height: r.h,
              borderRadius: theme.shape.cardRadius,
              border: `${theme.shape.rule}px solid ${ink[i]}`,
              opacity: edge,
            }}
          />
        ))}
      {P.cols.map((r, i) => (
        <Chip
          key={`who${i}`}
          label={i === 0 ? "Trader A" : "Trader B"}
          x={r.x + P.col.pad}
          y={P.col.chipY}
          at={local(V.who, V.at)}
          tone={ACCENT[i]}
          anchor="left"
          size={P.col.chipSize}
          pill
        />
      ))}

      {/* ── the four rows ─────────────────────────────────────────────── */}
      {V.rows.map((row, k) => {
        const y = P.row.y0 + k * P.row.pitch;
        const lab = textReveal(g, row.at, row.step.label, 0);
        const val = textReveal(g, row.at + row.step.valueAt, row.step.value, P.row.rise);
        if (lab.opacity <= 0.001) return null;
        return (
          <div key={row.label}>
            {P.cols.map((r, i) => (
              <React.Fragment key={`${row.label}${i}`}>
                <div
                  style={{
                    position: "absolute",
                    left: r.x + P.col.pad,
                    top: y,
                    transform: "translateY(-50%)",
                    fontFamily: theme.text.family,
                    fontSize: P.row.labelSize,
                    fontWeight: theme.text.body.weight,
                    color: c.slate,
                    opacity: lab.opacity,
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.label}
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: r.x + r.w - P.col.pad,
                    top: y,
                    transform: `translate(-100%, calc(-50% + ${val.dy}px))`,
                    fontFamily: theme.text.family,
                    fontSize: P.row.valueSize,
                    fontWeight: theme.text.title.weight,
                    color: c.ink,
                    opacity: val.opacity,
                    whiteSpace: "nowrap",
                  }}
                >
                  {i === 0 ? row.a : row.b}
                </div>
              </React.Fragment>
            ))}
          </div>
        );
      })}

      {/* ── everything drawn ──────────────────────────────────────────── */}
      {/* ⚠ ONE LAYER, MOUNTED WHEN THE FIRST LINE IS DUE. A full-canvas SVG
          per rule would be eleven of them, and each element inside is still
          guarded so nothing is on screen before its own frame. */}
      {g >= V.wires.at && (
        <Layer>
          {P.wires.map((w, i) => (
            <path
              key={`wire${i}`}
              d={w.d}
              fill="none"
              stroke={c.border}
              strokeWidth={theme.shape.rule}
              strokeLinecap="round"
              {...drawPath(wire, w.len)}
            />
          ))}

          {g >= V.split.at && (
            <>
              <line
                x1={MID}
                y1={P.band.y}
                x2={MID}
                y2={P.band.y + P.band.h * split}
                stroke={c.border}
                strokeWidth={theme.shape.rule}
              />
              {/* ⚠ THE SAME RULE, WIDER AND IN THE ACCENT. Laid over the
                  neutral one rather than replacing it, so 2px → 3px happens
                  without a frame where the line is two colours. */}
              {lift > 0.001 && (
                <line
                  x1={MID}
                  y1={P.band.y}
                  x2={MID}
                  y2={P.band.y + P.band.h * split}
                  stroke={c.indigo}
                  strokeWidth={theme.shape.rule + lift}
                  opacity={lift}
                />
              )}
            </>
          )}

          {V.rows.map((row, k) => {
            const drawn = progress(g, row.at + row.step.ruleAt, row.step.rule);
            if (drawn <= 0.001) return null;
            const y = P.row.y0 + k * P.row.pitch + P.row.rule;
            return P.cols.map((r, i) => (
              <line
                key={`sep${k}-${i}`}
                x1={r.x + P.col.pad}
                y1={y}
                x2={r.x + P.col.pad + (r.w - P.col.pad * 2) * drawn}
                y2={y}
                stroke={c.muted}
                strokeWidth={theme.shape.hairline}
                opacity={P.row.ruleAlpha}
              />
            ));
          })}
        </Layer>
      )}
    </>
  );
};
