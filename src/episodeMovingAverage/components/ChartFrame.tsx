/**
 * ChartFrame.tsx — THE chart. There is one, it lives in the box the scene's
 * layout mode hands it, and between scenes only the annotation changes.
 *
 * `gridOf` is exported because every annotation in the episode needs to know
 * where a price is. One coordinate space, shared — a marker and the line it
 * sits on can then never disagree.
 */
import React from "react";
import { theme } from "../theme";
import { progress, drawPath, fmtRp } from "../helpers";
import type { Bar } from "../series";

export type Box = { x: number; y: number; w: number; h: number };
export type Grid = {
  lo: number;
  hi: number;
  slot: number;
  box: Box;
  x: (i: number) => number;
  y: (v: number) => number;
};

/**
 * A grid over `values`, inside `box`.
 *
 * `domain` forces the price scale. Pass it wherever two things must be read
 * against each other — left to itself each series normalises to its own range,
 * which is how a chart quietly rigs the comparison it is asking for.
 *
 * `gutter` reserves room on the RIGHT for price labels, so a tick never lands
 * on the line it is measuring.
 */
export const gridOf = (
  values: (number | null)[],
  domain: [number, number],
  box: Box,
  pad = 0.12,
  gutter = 0,
): Grid => {
  const [lo, hi] = domain;
  const span = Math.max(1e-9, hi - lo);
  const n = Math.max(1, values.length);
  const padX = 18;
  const inner = box.w - padX * 2 - gutter;
  return {
    lo,
    hi,
    box,
    slot: inner / n,
    x: (i) => box.x + padX + (inner * i) / Math.max(1, n - 1),
    y: (v) => box.y + box.h * (1 - pad) - ((v - lo) / span) * box.h * (1 - pad * 2),
  };
};

/** A path through the values, skipping the leading nulls a warm-up leaves. */
export const pathOf = (values: (number | null)[], g: Grid) => {
  let d = "";
  values.forEach((v, i) => {
    if (v === null) return;
    d += `${d === "" ? "M" : "L"}${g.x(i).toFixed(1)},${g.y(v).toFixed(1)} `;
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

/** A full-canvas SVG. Every drawn primitive in the episode goes through one. */
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
      width={theme.layout.width}
      height={theme.layout.height}
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
  mode = "line",
  f,
  drawFrom,
  drawDur,
  opacity = 1,
  ticks,
  tickLabels = false,
}: {
  closes: number[];
  bars?: Bar[];
  grid: Grid;
  mode?: "line" | "candle";
  f: number;
  drawFrom: number;
  drawDur: number;
  opacity?: number;
  ticks?: number[];
  tickLabels?: boolean;
}) => {
  if (opacity <= 0.001) return null;
  const box = grid.box;
  const shown = progress(f, drawFrom, Math.max(1, drawDur));
  /* only ticks the chart actually reaches — a gridline for a price outside the
     plot is meaningless, and its LABEL lands outside the box */
  const inBox = (ticks ?? []).filter((p) => {
    const y = grid.y(p);
    return y >= box.y && y <= box.y + box.h;
  });

  return (
    <>
      <Layer opacity={opacity}>
        {inBox.map((p) => (
          <line
            key={p}
            x1={box.x}
            y1={grid.y(p)}
            x2={box.x + box.w}
            y2={grid.y(p)}
            stroke={theme.colors.gridline}
            strokeWidth={theme.layout.border.thin}
          />
        ))}
        <line
          x1={box.x}
          y1={box.y + box.h}
          x2={box.x + box.w}
          y2={box.y + box.h}
          stroke={theme.colors.gridline}
          strokeWidth={theme.layout.border.thin}
        />
      </Layer>

      {tickLabels &&
        inBox.map((p) => (
          <div
            key={p}
            style={{
              position: "absolute",
              left: box.x + box.w - 8,
              top: grid.y(p),
              transform: "translate(-100%, -50%)",
              fontFamily: theme.type.family,
              fontSize: theme.type.labelSm.size,
              fontWeight: theme.type.labelSm.weight,
              color: theme.colors.textMuted,
              opacity,
            }}
          >
            {fmtRp(p)}
          </div>
        ))}

      {/* the guard every animated path needs: without it frame 0 shows the
          finished series for one frame */}
      {f >= drawFrom &&
        (mode === "line" ? (
          <Layer opacity={opacity}>
            <path
              d={pathOf(closes, grid)}
              fill="none"
              stroke={theme.colors.price}
              strokeWidth={theme.layout.stroke.price}
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
              const fill = b.c >= b.o ? theme.colors.candleGreen : theme.colors.candleRed;
              return (
                <g key={i}>
                  <line
                    x1={x}
                    y1={grid.y(b.h)}
                    x2={x}
                    y2={grid.y(b.l)}
                    stroke={theme.colors.price}
                    strokeWidth={theme.layout.stroke.wick}
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
