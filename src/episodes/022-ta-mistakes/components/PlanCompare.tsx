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
  Card, Layer,
  drawPath, progress, textReveal, theme, useMotion, usePalette,
} from "../../../core";
import { PLANS } from "../data/timing";
import { PLAN } from "../data/layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = PLANS;
const P = PLAN;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ⚠ THE ONE SHARED OBJECT IS A TICKER NOW, AND IT IS A PLACEHOLDER ON PURPOSE.
 * `$ABCD` is not an instrument: no IDX board carries it, the dollar prefix is
 * not how Indonesian tickers are written, and nothing in this scene quotes a
 * price for it. The rule this file used to keep by naming NOTHING is kept now
 * by naming something that cannot be mistaken for a real company.
 */
const TICKER = { word: "Saham ", code: "$ABCD" } as const;

const WHO = ["Trader profesional", "Kamu"] as const;

/**
 * ⚠ LOCAL UNTIL A SECOND SCENE WANTS ONE. A profile picture is not a core
 * primitive the way Card and Chip are, and adding it to the library on the
 * strength of one use is how core fills up with things nobody else needs.
 *
 * ⚠ AND IT IS CLIPPED TO ITS OWN DISC. The shoulders are an ellipse that runs
 * off the bottom of the circle; without the clip it is a half-moon floating
 * inside a ring, which is what it looked like first.
 */
const Avatar = ({
  x, y, size, ink, opacity, id,
}: {
  x: number;
  y: number;
  size: number;
  ink: string;
  opacity: number;
  id: string;
}) => (
  <svg
    style={{ position: "absolute", left: x, top: y - size / 2, opacity }}
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <defs>
      <clipPath id={id}>
        <circle cx={12} cy={12} r={12} />
      </clipPath>
    </defs>
    <g clipPath={`url(#${id})`}>
      <circle cx={12} cy={12} r={12} fill={ink} opacity={0.16} />
      <circle cx={12} cy={9.4} r={3.9} fill={ink} />
      <ellipse cx={12} cy={21.4} rx={7.6} ry={6.6} fill={ink} />
    </g>
  </svg>
);

export const PlanCompare = ({ g }: { g: number }) => {
  const c = usePalette();
  const m = useMotion();
  const p = (q: { at: number; over: number }) => progress(g, q.at, q.over);

  const card = p(V.card);
  const wire = p(V.wires);
  const cols = p(V.cols);
  const who = progress(g, V.who, m.reveal);
  /** B3 — emphasis only. Nothing below changes position on it. */
  const edge = p(V.edge);

  const ink = [c.indigo, c.cyan];

  return (
    <>
      {/* ── the one shared object ───────────────────────────────────────
          A line of type, not a card. "window 'Same Stock' nya hapus, ganti
          dengan langsung text aja" — and the decorative candle strip went with
          it, which is a small relief: it was the one drawn thing in this scene
          that had to be held at 45% opacity to stop it reading as something
          analysable. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: P.ticker.y,
          width: theme.canvas.width,
          transform: `translateY(calc(-50% + ${(1 - card) * P.col.rise}px))`,
          textAlign: "center",
          fontFamily: theme.text.family,
          fontSize: P.ticker.size,
          fontWeight: theme.text.title.weight,
          color: c.ink,
          opacity: card,
        }}
      >
        {TICKER.word}
        {/* ⚠ THE CODE IS INDIGO AND THE WORD IS NOT. Simon's. It is also the
            one thing on this frame that both columns are about, so the accent
            reads as "this is the shared object" rather than as decoration. */}
        <span style={{ color: c.indigo }}>{TICKER.code}</span>
      </div>

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
      {/* ⚠ NO PILL, AND THE NAME IS THE PERSON. "Trader A"/"Trader B" were two
          labels on two boxes; "Trader profesional" and "Kamu" are two people,
          and a person gets a face rather than a badge. The hue is still the
          only thing that separates the columns — see the note at the top. */}
      {P.cols.map((r, i) => (
        <React.Fragment key={`who${i}`}>
          <Avatar
            id={`plan-avatar-${i}`}
            x={r.x + P.col.pad}
            y={P.col.nameY}
            size={P.name.avatar}
            ink={ink[i]}
            opacity={who}
          />
          <div
            style={{
              position: "absolute",
              left: r.x + P.col.pad + P.name.avatar + P.name.gap,
              top: P.col.nameY,
              width: r.w - P.col.pad * 2 - P.name.avatar - P.name.gap,
              transform: `translateY(calc(-50% + ${(1 - who) * P.row.rise}px))`,
              fontFamily: theme.text.family,
              fontSize: P.name.size,
              fontWeight: theme.text.display.weight,
              lineHeight: P.name.lead,
              color: ink[i],
              opacity: who,
            }}
          >
            {WHO[i]}
          </div>
        </React.Fragment>
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

          {/* ⚠ NO DIVIDER. "Remove garis vertikal di tengah" — it was a rule
              down the middle of the band and a second, heavier one laid over it
              at B3. What separates the two columns now is the gap and the hue,
              which is what was doing the work anyway. */}

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
