/**
 * Panels.tsx — the episode's tabular and bar-chart furniture.
 *
 * Every one of these takes `f` as a prop rather than reading the frame itself,
 * so a continuity group can drive it across an internal boundary.
 *
 * Colour discipline: the only red and green in this file are inside
 * `OrderBook`'s rows, which is the documented exception alongside candle
 * bodies. Everything else is indigo, cyan or neutral.
 */
import React from "react";
import { theme } from "../theme";
import { progress, textReveal, clamp01, type Rect } from "../helpers";
import { Layer } from "./Stage";
import { seriesGrid, pathOf } from "./plot";

/** A surface with a hairline border — the base every panel below sits on. */
export const Panel = ({
  rect,
  children,
  opacity = 1,
  radius = theme.shape.panelRadius,
  fill = theme.color.surface,
}: {
  rect: Rect;
  children?: React.ReactNode;
  opacity?: number;
  radius?: number;
  fill?: string;
}) => {
  if (opacity <= 0.001) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: rect.x,
          top: rect.y,
          width: rect.w,
          height: rect.h,
          borderRadius: radius,
          background: fill,
          border: `${theme.shape.hairline}px solid ${theme.color.hairline}`,
          opacity,
        }}
      />
      {children}
    </>
  );
};

/**
 * WeightBars — ten bars under a price series, one per day of the window.
 *
 * This ONE graphic carries the whole SMA/EMA distinction, so nothing is layered
 * on top of it: flat identical bars mean every day counts the same, a ramp
 * means the recent days count more. There is no metaphor to add.
 */
export const WeightBars = ({
  rect,
  ramp,
  f,
  at,
  stagger = 2,
  over = 14,
}: {
  rect: Rect;
  /** false = every bar identical (SMA); true = heights and tint climb (EMA). */
  ramp: boolean;
  f: number;
  at: number;
  stagger?: number;
  over?: number;
}) => {
  const n = 10;
  const gap = 10;
  const w = (rect.w - gap * (n - 1)) / n;
  const tints = [theme.color.indigo40, theme.color.indigo70, theme.color.indigo90, theme.color.indigo];
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const grow = progress(f, at + i * stagger, over);
        if (grow <= 0.001) return null;
        const full = ramp ? rect.h * (0.22 + (0.78 * i) / (n - 1)) : rect.h * 0.66;
        const h = full * grow;
        const fill = ramp ? tints[Math.min(tints.length - 1, Math.floor((i / (n - 1)) * tints.length))] : theme.color.neutralBar;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: rect.x + i * (w + gap),
              top: rect.y + rect.h - h,
              width: w,
              height: h,
              borderRadius: 6,
              background: fill,
            }}
          />
        );
      })}
    </>
  );
};

/** Four blocks. How many are filled is how strong the slope reads. */
export const StrengthMeter = ({
  rect,
  filled,
  f,
  at,
  tone = theme.color.indigo,
}: {
  rect: Rect;
  filled: 0 | 1 | 2 | 3 | 4;
  f: number;
  at: number;
  tone?: string;
}) => {
  const gap = 8;
  const w = (rect.w - gap * 3) / 4;
  return (
    <>
      {Array.from({ length: 4 }, (_, i) => {
        const on = i < filled ? progress(f, at + i * 3, 10) : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: rect.x + i * (w + gap),
              top: rect.y,
              width: w,
              height: rect.h,
              borderRadius: 6,
              background: on > 0.001 ? tone : theme.color.hairline,
              opacity: on > 0.001 ? on : 1,
            }}
          />
        );
      })}
    </>
  );
};

/**
 * A label over a value. `value` accepts "—", which is what it renders while a
 * figure is still waiting on real data — a dash is honest, a zero is not.
 */
export const StatCard = ({
  rect,
  label,
  value,
  f,
  at,
}: {
  rect: Rect;
  label: string;
  value: string;
  f: number;
  at: number;
}) => {
  const r = textReveal(f, at);
  if (f < at) return null;
  return (
    <Panel rect={rect} opacity={r.opacity}>
      <div
        style={{
          position: "absolute",
          left: rect.x + 24,
          top: rect.y + 20 + r.dy,
          fontFamily: theme.text.family,
          fontSize: theme.text.tag.size,
          fontWeight: theme.text.tag.weight,
          color: theme.color.slate,
          opacity: r.opacity,
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: "absolute",
          left: rect.x + 24,
          top: rect.y + 20 + theme.text.tag.size + 12 + r.dy,
          fontFamily: theme.text.family,
          fontSize: theme.text.mono.size,
          fontWeight: theme.text.mono.weight,
          fontVariantNumeric: "tabular-nums",
          color: theme.color.ink,
          opacity: r.opacity,
        }}
      >
        {value}
      </div>
    </Panel>
  );
};

/** A two-column comparison, each column bound to its line by header colour. */
export const ComparisonTable = ({
  rect,
  headers,
  headerTones,
  rows,
  f,
  at,
  stagger = 8,
  opacity = 1,
}: {
  rect: Rect;
  headers: [string, string];
  headerTones: [string, string];
  rows: [string, string, string][];
  f: number;
  at: number;
  stagger?: number;
  opacity?: number;
}) => {
  if (f < at || opacity <= 0.001) return null;
  const rowH = rect.h / (rows.length + 1);
  const col = [rect.x + 24, rect.x + rect.w * 0.42, rect.x + rect.w * 0.72];
  const cell = (text: string, x: number, y: number, tone: string, weight: number, o: number, dy: number) => (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + dy,
        transform: "translateY(-50%)",
        fontFamily: theme.text.family,
        fontSize: theme.text.tag.size,
        fontWeight: weight,
        color: tone,
        whiteSpace: "nowrap",
        opacity: o,
      }}
    >
      {text}
    </div>
  );
  const head = textReveal(f, at);
  return (
    <Panel rect={rect} opacity={opacity}>
      {cell(headers[0], col[1], rect.y + rowH / 2, headerTones[0], theme.text.chip.weight, head.opacity, head.dy)}
      {cell(headers[1], col[2], rect.y + rowH / 2, headerTones[1], theme.text.chip.weight, head.opacity, head.dy)}
      {rows.map((r, i) => {
        const rv = textReveal(f, at + (i + 1) * stagger);
        return (
          <React.Fragment key={r[0]}>
            {cell(r[0], col[0], rect.y + rowH * (i + 1.5), theme.color.slate, theme.text.body.weight, rv.opacity, rv.dy)}
            {cell(r[1], col[1], rect.y + rowH * (i + 1.5), theme.color.ink, theme.text.body.weight, rv.opacity, rv.dy)}
            {cell(r[2], col[2], rect.y + rowH * (i + 1.5), theme.color.ink, theme.text.body.weight, rv.opacity, rv.dy)}
          </React.Fragment>
        );
      })}
    </Panel>
  );
};

/**
 * TwoOutcomeBar — the honesty beat.
 *
 * ⚠ COMPLIANCE. It takes NO numeric prop, by design, and it never will. The
 * voice-over says the probability leans upward; a bar with a percentage on it
 * turns that into a forecast. The losing bar is also floored at 55% of the
 * winning one — see `LOSE_FLOOR` — so "leans" can never render as "certain".
 */
const LOSE_FLOOR = 0.55;

export const TwoOutcomeBar = ({
  rect,
  winLabel,
  loseLabel,
  f,
  at,
  opacity = 1,
}: {
  rect: Rect;
  winLabel: string;
  loseLabel: string;
  f: number;
  at: number;
  opacity?: number;
}) => {
  if (f < at || opacity <= 0.001) return null;
  const grow = progress(f, at, 22);
  const w = (rect.w - 32) / 2;
  const bars: { label: string; h: number; fill: string; tone: string }[] = [
    { label: winLabel, h: rect.h * 0.72, fill: theme.color.indigo, tone: theme.color.indigo },
    { label: loseLabel, h: rect.h * 0.72 * LOSE_FLOOR, fill: theme.color.hairline, tone: theme.color.slate },
  ];
  return (
    <>
      {bars.map((b, i) => {
        const r = textReveal(f, at + 8 + i * 6);
        return (
          <React.Fragment key={b.label}>
            <div
              style={{
                position: "absolute",
                left: rect.x + i * (w + 32),
                top: rect.y + rect.h - b.h * grow,
                width: w,
                height: b.h * grow,
                borderRadius: 10,
                background: b.fill,
                opacity,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: rect.x + i * (w + 32),
                top: rect.y + rect.h + 18 + r.dy,
                width: w,
                textAlign: "center",
                fontFamily: theme.text.family,
                fontSize: theme.text.tag.size,
                fontWeight: theme.text.tag.weight,
                color: b.tone,
                opacity: r.opacity * opacity,
              }}
            >
              {b.label}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

/** A stack that builds BOTTOM-UP: the foundation exists before anything on it. */
export const LayerStack = ({
  rect,
  layers,
  f,
  gap = 20,
}: {
  rect: Rect;
  layers: { label: string; note?: string; at: number; tone: "solid" | "outline"; chips?: string[] }[];
  f: number;
  gap?: number;
}) => {
  const h = (rect.h - gap * (layers.length - 1)) / layers.length;
  return (
    <>
      {layers.map((l, i) => {
        const r = textReveal(f, l.at);
        if (f < l.at) return null;
        /** index 0 is the foundation, so it is drawn at the BOTTOM of the rect */
        const top = rect.y + rect.h - (i + 1) * h - i * gap;
        const solid = l.tone === "solid";
        return (
          <React.Fragment key={l.label}>
            <div
              style={{
                position: "absolute",
                left: rect.x,
                top: top + r.dy,
                width: rect.w,
                height: h,
                borderRadius: theme.shape.cardRadius,
                background: solid ? theme.color.indigo : theme.color.surface,
                border: `${theme.shape.rule}px solid ${solid ? theme.color.indigo : theme.color.cyan}`,
                opacity: r.opacity,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: rect.x + 28,
                top: top + 22 + r.dy,
                fontFamily: theme.text.family,
                fontSize: theme.text.chip.size,
                fontWeight: theme.text.title.weight,
                color: solid ? theme.color.onIndigo : theme.color.ink,
                opacity: r.opacity,
              }}
            >
              {l.label}
            </div>
            {l.note !== undefined && (
              <div
                style={{
                  position: "absolute",
                  left: rect.x + 28,
                  top: top + 22 + theme.text.chip.size + 10 + r.dy,
                  fontFamily: theme.text.family,
                  fontSize: theme.text.tag.size,
                  fontWeight: theme.text.tag.weight,
                  color: solid ? theme.color.indigoPale : theme.color.slate,
                  opacity: r.opacity,
                }}
              >
                {l.note}
              </div>
            )}
            {(l.chips ?? []).map((c, k) => (
              <div
                key={c}
                style={{
                  position: "absolute",
                  left: rect.x + rect.w - 28 - (l.chips!.length - k) * 190,
                  top: top + h / 2 - 26 + r.dy,
                  width: 172,
                  height: 52,
                  borderRadius: theme.shape.chipRadius,
                  background: theme.color.onIndigo,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: theme.text.family,
                  fontSize: theme.text.tag.size,
                  fontWeight: theme.text.tag.weight,
                  color: theme.color.indigo,
                  opacity: r.opacity,
                }}
              >
                {c}
              </div>
            ))}
          </React.Fragment>
        );
      })}
    </>
  );
};

/**
 * BB Width, plotted under the chart it belongs to. This is what makes a squeeze
 * MEASURABLE — the bands pinching is a picture, the width dropping to a trough
 * is the reading, and the scene needs both.
 */
export const BBWidthPanel = ({
  rect,
  width,
  upto,
  f,
  at,
  opacity = 1,
  troughLabel,
}: {
  rect: Rect;
  width: (number | null)[];
  /** How many bars of the series are on screen — keeps the panel in step. */
  upto: number;
  f: number;
  at: number;
  opacity?: number;
  troughLabel?: string;
}) => {
  if (f < at || opacity <= 0.001) return null;
  const inner = { x: rect.x + 24, y: rect.y + 18, w: rect.w - 48, h: rect.h - 36 };
  const g = seriesGrid(width, inner, 0.16);
  const shown = width.map((v, i) => (i <= upto ? v : null));
  const real = width.filter((v): v is number => v !== null);
  const trough = real.length > 0 ? Math.min(...real) : 0;
  return (
    <Panel rect={rect} opacity={opacity}>
      <Layer opacity={opacity}>
        {troughLabel !== undefined && (
          <line
            x1={inner.x}
            y1={g.y(trough)}
            x2={inner.x + inner.w}
            y2={g.y(trough)}
            stroke={theme.color.indigo40}
            strokeWidth={theme.shape.rule}
            strokeDasharray="8 8"
          />
        )}
        <path
          d={pathOf(shown, g)}
          fill="none"
          stroke={theme.color.cyan}
          strokeWidth={theme.shape.line}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Layer>
      <div
        style={{
          position: "absolute",
          left: rect.x + 24,
          top: rect.y + 12,
          fontFamily: theme.text.family,
          fontSize: theme.text.tag.size,
          fontWeight: theme.text.tag.weight,
          color: theme.color.slate,
          opacity: clamp01(opacity),
        }}
      >
        BB Width
      </div>
      {troughLabel !== undefined && (
        <div
          style={{
            position: "absolute",
            left: inner.x + 160,
            top: g.y(trough),
            transform: "translateY(-140%)",
            whiteSpace: "nowrap",
            fontFamily: theme.text.family,
            fontSize: theme.text.tag.size,
            fontWeight: theme.text.tag.weight,
            color: theme.color.indigo,
          }}
        >
          {troughLabel}
        </div>
      )}
    </Panel>
  );
};
