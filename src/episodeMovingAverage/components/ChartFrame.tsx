/**
 * ChartFrame.tsx — THE chart. There is one, it lives at `theme.stage.chart`,
 * and it does not move for the whole episode.
 *
 * IT SITS ON A WHITE SURFACE. The card is drawn by this component, underneath
 * everything else it renders, so a chart can never end up floating on the
 * silver background. That separation is what makes a thin gridline, a 2px band
 * and a grey price line legible at all — on silver they sit at almost the same
 * value as the ground they are drawn on. It also gives every annotation one
 * consistent surface to be read against, whatever scene it is in.
 *
 * Between scenes only the annotation changes: a line draws, a label swaps, a
 * box highlights. The chart itself staying put is what lets the viewer keep
 * their bearings across fourteen scenes, and it is a hard constraint rather
 * than a preference.
 *
 * `gridOf` is exported because every annotation in the episode needs to know
 * where a price is. One coordinate space, shared — a marker and the line it
 * sits on can then never disagree.
 */
import React from "react";
import { theme } from "../theme";
import { progress, drawPath, price as fmt } from "../helpers";
import type { Bar } from "../series";

/** The shared chart box, widened to a plain Rect so a scene may split it. */
export type Box = { x: number; y: number; w: number; h: number };
export const CHART: Box = theme.stage.chart;

export type Grid = {
  lo: number;
  hi: number;
  slot: number;
  x: (i: number) => number;
  y: (v: number) => number;
};

/**
 * A grid over `values`, in the shared chart box.
 *
 * `domain` forces the price scale. Pass it wherever two things must be read
 * against each other — left to itself each series normalises to its own range,
 * which is how a chart quietly rigs the comparison it is asking the viewer to
 * make.
 */
export const gridOf = (
  values: (number | null)[],
  domain?: [number, number],
  box: Box = CHART,
  pad = 0.12,
  /**
   * A gutter reserved on the RIGHT for the price axis. The data plots inside
   * `box.w − gutter`, so a tick label never lands on the line it is measuring.
   * Pass 0 wherever the chart has no tick labels and may use the full width.
   */
  gutter = 0,
): Grid => {
  const real = values.filter((v): v is number => v !== null);
  const [lo, hi] = domain ?? [Math.min(...real), Math.max(...real)];
  const span = Math.max(1e-9, hi - lo);
  const n = Math.max(1, values.length);
  /**
   * The plot is inset horizontally by half a candle body plus a hair, so the
   * last bar's body cannot reach — let alone cross — the safe right margin.
   * A line's cap is 1.25px and would not need this; a 20px body does.
   */
  const padX = 18;
  const inner = box.w - padX * 2 - gutter;
  return {
    lo,
    hi,
    slot: inner / n,
    x: (i) => box.x + padX + (inner * i) / Math.max(1, n - 1),
    y: (v) => box.y + box.h * (1 - pad) - ((v - lo) / span) * box.h * (1 - pad * 2),
  };
};

/** A path through the values, skipping the leading nulls a warm-up leaves. */
export const pathOf = (values: (number | null)[], g: Grid) => {
  let d = "";
  let started = false;
  values.forEach((v, i) => {
    if (v === null) return;
    d += `${started ? "L" : "M"}${g.x(i).toFixed(1)},${g.y(v).toFixed(1)} `;
    started = true;
  });
  return d.trim();
};

export const lengthOf = (values: (number | null)[], g: Grid) => {
  let len = 0;
  let prev: { x: number; y: number } | null = null;
  values.forEach((v, i) => {
    if (v === null) return;
    const p = { x: g.x(i), y: g.y(v) };
    if (prev) len += Math.hypot(p.x - prev.x, p.y - prev.y);
    prev = p;
  });
  return len;
};

/**
 * ═══ WHERE A LABEL MAY SIT ═══
 *
 * A label pinned to a point on a line gets CROSSED by that line at its own
 * horizontal extremes: the text is ~180px wide and the line keeps sloping
 * through it. Anchoring 22px off the point is not enough, and no fixed gap is,
 * because the clearance needed depends on the slope.
 *
 * So a label does not clear the thing it names — it clears EVERYTHING drawn
 * near it. These return the topmost / bottommost y of every layer within
 * `span` bars of `i`, which is the y an "above" / "below" anchor must use.
 *
 * `span` should cover half the label's width in bars: `textPx / 2 / grid.slot`.
 */
export const clearAbove = (
  grid: Grid,
  i: number,
  span: number,
  layers: (number | null)[][],
  bars?: Bar[],
) => {
  let top = Infinity;
  for (let k = Math.max(0, i - span); k <= i + span; k++) {
    layers.forEach((v) => {
      const val = v[k];
      if (val !== undefined && val !== null) top = Math.min(top, grid.y(val));
    });
    const b = bars?.[k];
    if (b) top = Math.min(top, grid.y(b.h));
  }
  return Number.isFinite(top) ? top : grid.y(grid.hi);
};

export const clearBelow = (
  grid: Grid,
  i: number,
  span: number,
  layers: (number | null)[][],
  bars?: Bar[],
) => {
  let bottom = -Infinity;
  for (let k = Math.max(0, i - span); k <= i + span; k++) {
    layers.forEach((v) => {
      const val = v[k];
      if (val !== undefined && val !== null) bottom = Math.max(bottom, grid.y(val));
    });
    const b = bars?.[k];
    if (b) bottom = Math.max(bottom, grid.y(b.l));
  }
  return Number.isFinite(bottom) ? bottom : grid.y(grid.lo);
};

/** A full-box SVG. Every drawn primitive in the episode goes through one. */
export const Layer = ({
  children,
  opacity = 1,
}: {
  children: React.ReactNode;
  opacity?: number;
}) => {
  if (opacity <= 0.001) return null;
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      width={theme.canvas.width}
      height={theme.canvas.height}
      opacity={opacity}
    >
      {children}
    </svg>
  );
};

export const ChartFrame = ({
  closes,
  bars,
  grid,
  mode = "candle",
  f,
  drawFrom,
  drawDur,
  opacity = 1,
  ticks,
  tickLabels = true,
  box = CHART,
  surface = true,
}: {
  closes: number[];
  /**
   * CANDLES ARE THE DEFAULT. A line chart is the exception — use it only where
   * the scene is about the shape of an average rather than about price, and say
   * so at the call site.
   */
  bars?: Bar[];
  grid: Grid;
  mode?: "line" | "candle";
  f: number;
  drawFrom: number;
  drawDur: number;
  opacity?: number;
  ticks?: number[];
  tickLabels?: boolean;
  box?: Box;
  /** Off only where a scene stacks two frames on ONE shared card. */
  surface?: boolean;
}) => {
  if (opacity <= 0.001) return null;
  const shown = progress(f, drawFrom, Math.max(1, drawDur));
  /**
   * Only ticks the chart actually reaches. A gridline for a price outside the
   * plot is meaningless, and its LABEL lands outside the box — one of them was
   * printing "4.400" down inside the subtitle band.
   */
  const inBox = (ticks ?? []).filter((p) => {
    const y = grid.y(p);
    return y >= box.y && y <= box.y + box.h;
  });
  return (
    <>
      {/* THE SURFACE, under everything. See the header note. */}
      {surface && (
        <div
          style={{
            position: "absolute",
            left: box.x,
            top: box.y,
            width: box.w,
            height: box.h,
            borderRadius: theme.shape.cardRadius,
            background: theme.color.surface,
            border: `${theme.shape.hairline}px solid ${theme.color.hairline}`,
            /* no shadow: a 24px blur bleeds ~16px past the card and puts
               something — however faint — outside the safe margins */
            opacity,
          }}
        />
      )}

      {/* the axes are always present — they are the room, not the content */}
      <Layer opacity={opacity}>
        {inBox.map((p) => (
          <line
            key={p}
            x1={box.x}
            y1={grid.y(p)}
            x2={box.x + box.w}
            y2={grid.y(p)}
            stroke={theme.color.gridline}
            strokeWidth={theme.shape.hairline}
          />
        ))}
        <line
          x1={box.x}
          y1={box.y + box.h}
          x2={box.x + box.w}
          y2={box.y + box.h}
          stroke={theme.color.gridline}
          strokeWidth={theme.shape.hairline}
        />
      </Layer>

      {/* the price axis is the ONE numeric readout the episode allows */}
      {tickLabels &&
        inBox.map((p) => (
          <div
            key={p}
            style={{
              position: "absolute",
              /* in the reserved gutter — inside the safe margin, and clear of
                 the data. Outside the box they ran off the canvas; on top of
                 the data they were unreadable. */
              left: box.x + box.w - 8,
              top: grid.y(p),
              transform: "translate(-100%, -50%)",
              fontFamily: theme.text.family,
              /* the price axis has its own size in the theme — it was reading
                 `tag` here, and the two only ever agreed by coincidence */
              fontSize: theme.text.axis.size,
              fontWeight: theme.text.axis.weight,
              color: theme.color.textMuted,
              opacity,
            }}
          >
            {fmt(p)}
          </div>
        ))}

      {/* guard: without it, frame 0 shows the finished series for one frame */}
      {f >= drawFrom &&
        (mode === "line" ? (
          <Layer opacity={opacity}>
            <path
              d={pathOf(closes, grid)}
              fill="none"
              stroke={theme.color.priceLine}
              strokeWidth={theme.shape.price}
              strokeLinecap="round"
              strokeLinejoin="round"
              {...drawPath(f, drawFrom, drawDur, lengthOf(closes, grid))}
            />
          </Layer>
        ) : (
          <Layer opacity={opacity}>
            {(bars ?? []).slice(0, Math.ceil((bars ?? []).length * shown)).map((b, i) => {
              const x = grid.x(i);
              const w = Math.max(2, Math.min(20, grid.slot * 0.62));
              const top = Math.min(grid.y(b.o), grid.y(b.c));
              const h = Math.max(1.5, Math.abs(grid.y(b.c) - grid.y(b.o)));
              /* candle bodies are the ONLY place green and red appear */
              const fill = b.c >= b.o ? theme.color.candleGreen : theme.color.candleRed;
              return (
                <g key={i}>
                  <line
                    x1={x}
                    y1={grid.y(b.h)}
                    x2={x}
                    y2={grid.y(b.l)}
                    stroke={theme.color.priceLine}
                    strokeWidth={theme.shape.wick}
                  />
                  <rect x={x - w / 2} y={top} width={w} height={h} fill={fill} />
                </g>
              );
            })}
          </Layer>
        ))}
    </>
  );
};
