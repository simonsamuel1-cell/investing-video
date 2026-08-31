/**
 * core/chart/Crosshair.tsx — one bar, singled out, with the numbers behind it.
 *
 * A vertical rule through the bar, a horizontal rule at the value it names, and
 * a small card carrying the date and whatever the scene is asking the viewer to
 * read. It is the gesture a viewer already knows from every charting app: this
 * one, here, is what it says.
 *
 * ⚠ IT TAKES A Grid AND A BAR INDEX, never coordinates. The rules and the card
 * are therefore in the chart's own space and cannot drift off the bar they name
 * when the domain, the window or the box changes. A crosshair placed by hand is
 * a crosshair that will eventually point at the wrong candle and say so
 * confidently.
 *
 * ⚠ THE CARD FLIPS SIDES RATHER THAN LEAVING THE PLOT. Past the halfway mark it
 * hangs to the left of the rule, and it is clamped out of the logo zone — both
 * by construction, because which bar is being named changes whenever the data
 * does.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { usePalette, useShadow } from "../palette";
import { progress } from "../helpers";
import { useMotion } from "../useMotion";
import { Layer } from "../Stage";
import type { Grid } from "./grid";

export type CrosshairRow = {
  label: string;
  value: string;
  /** A palette slot, for a row that names a coloured series. */
  ink?: string;
};

export const Crosshair = ({
  grid,
  index,
  value,
  at,
  date,
  rows = [],
  opacity = 1,
}: {
  grid: Grid;
  /** The bar this names. */
  index: number;
  /** The price the horizontal rule sits on. Omit for a vertical rule only. */
  value?: number;
  at: number;
  /** The card's heading — a date, a session, a bar number. */
  date?: string;
  rows?: CrosshairRow[];
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  if (opacity <= 0.001 || f < at) return null;

  const p = progress(f, at, m.fade);
  const x = grid.x(index);
  const top = grid.box.y;
  const bottom = grid.box.y + grid.box.h;
  const y = value === undefined ? undefined : grid.y(value);

  /* the card hangs on the side with room for it */
  const flip = x > grid.box.x + grid.box.w * 0.55;
  const gap = 14;
  const cardTop = Math.max(
    theme.logoZone.height + gap,
    (y ?? top + grid.box.h * 0.2) - theme.text.chip.size,
  );

  return (
    <>
      <Layer opacity={opacity}>
        {/* the vertical rule DRAWS DOWN from the top of the plot, so the eye
            arrives at the bar rather than finding the mark already there */}
        <line
          x1={x}
          y1={top}
          x2={x}
          y2={top + (bottom - top) * p}
          stroke={c.slate}
          strokeWidth={theme.shape.hairline}
          strokeDasharray="6 6"
        />
        {y !== undefined && (
          <line
            x1={grid.box.x}
            y1={y}
            x2={grid.box.x + grid.box.w * p}
            y2={y}
            stroke={c.slate}
            strokeWidth={theme.shape.hairline}
            strokeDasharray="6 6"
          />
        )}
        {y !== undefined && <circle cx={x} cy={y} r={6 * p} fill={c.indigo} />}
      </Layer>

      {(date || rows.length > 0) && (
        <div
          style={{
            position: "absolute",
            left: flip ? x - gap : x + gap,
            top: cardTop,
            transform: `translate(${flip ? "-100%" : "0"}, 0) scale(${0.96 + 0.04 * p})`,
            transformOrigin: flip ? "right top" : "left top",
            padding: `${Math.round(theme.text.axis.size * 0.5)}px ${theme.text.axis.size}px`,
            borderRadius: theme.shape.panelRadius,
            background: c.cardBg,
            border: `${theme.shape.hairline}px solid ${c.border}`,
            boxShadow: shadow.rest,
            fontFamily: theme.text.family,
            opacity: opacity * p,
            whiteSpace: "nowrap",
          }}
        >
          {date && (
            <div
              style={{
                fontSize: theme.text.axis.size,
                fontWeight: theme.text.axis.weight,
                color: c.slate,
                marginBottom: rows.length ? 6 : 0,
              }}
            >
              {date}
            </div>
          )}
          {rows.map((r) => (
            <div
              key={r.label}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: theme.text.axis.size,
                fontSize: theme.text.chip.size,
                fontWeight: theme.text.chip.weight,
                color: r.ink ?? c.ink,
              }}
            >
              <span style={{ color: c.slate, fontSize: theme.text.axis.size }}>{r.label}</span>
              <span style={{ marginLeft: "auto" }}>{r.value}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
