/**
 * core/chart/Annotations.tsx — everything drawn ON a chart to make a claim
 * about it: levels, zones, swing marks, arrows, strikes and reveals.
 *
 * All of these take a Grid, so they speak the chart's own coordinates and can
 * never drift from the price they name. None of them may be red or green.
 *
 * ⚠ NO BUY/SELL MARKERS. An annotation may name what happened; it may not tell
 * anyone what to do. That is a compliance line, not a style one.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { progress, price as fmtPrice } from "../helpers";
import { Layer } from "../Stage";
import { drawPath, type Grid } from "./grid";

/**
 * A horizontal price level — support, resistance, an average, a target.
 *
 * It DRAWS from left to right, so it reads as a line being laid down across the
 * history that made it. `broken` restyles it in place rather than replacing it:
 * a level that is breached is the same level, and drawing a second one would
 * lose that.
 */
export const Level = ({
  value,
  grid,
  at,
  over,
  label,
  broken = false,
  opacity = 1,
  from,
  to,
}: {
  value: number;
  grid: Grid;
  at: number;
  over: number;
  label?: string;
  /** Restyles to dashed and muted — the level still exists, it just failed. */
  broken?: boolean;
  opacity?: number;
  /** Bar indices the line spans. Defaults to the whole plot. */
  from?: number;
  to?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  if (opacity <= 0.001 || f < at) return null;
  const p = progress(f, at, Math.max(1, over));
  const x1 = from === undefined ? grid.box.x : grid.x(from);
  const x2 = to === undefined ? grid.box.x + grid.box.w : grid.x(to);
  const y = grid.y(value);
  const ink = broken ? c.muted : c.indigo;

  return (
    <>
      <Layer opacity={opacity}>
        <line
          x1={x1}
          y1={y}
          x2={x2}
          y2={y}
          stroke={ink}
          strokeWidth={theme.shape.rule}
          {...(broken
            ? { strokeDasharray: "12 9", opacity: p }
            : drawPath(p, Math.abs(x2 - x1)))}
        />
      </Layer>
      {label && (
        <div
          style={{
            /**
             * ⚠ AT THE RIGHT-HAND END OF THE LINE, not the left.
             *
             * The line DRAWS left to right, so its right end is where the eye
             * already is when the level finishes arriving — a label at the
             * start is read before the line that justifies it. It is also the
             * end nearest the newest bars, which is what a support or
             * resistance level is a claim about.
             */
            position: "absolute",
            left: x2 - 12,
            top: y - 10,
            transform: "translate(-100%, -100%)",
            fontFamily: theme.text.family,
            fontSize: theme.text.tag.size,
            fontWeight: theme.text.tag.weight,
            color: ink,
            opacity: opacity * p,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      )}
    </>
  );
};

/** The price scale tag for a level — sits in the right gutter, on the axis. */
export const PriceTag = ({
  value,
  grid,
  at,
  tone = "indigo",
}: {
  value: number;
  grid: Grid;
  at: number;
  /**
   * `solid` is the LAST TRADED PRICE, on ink rather than on a brand colour.
   *
   * ⚠ IT IS A DIFFERENT KIND OF FACT. Indigo, cyan and slate tags name levels
   * the episode is arguing about — a support, an average, a target. The last
   * price is not an argument, it is where the tape currently is, and every
   * broker screen the viewer has ever seen prints it in near-black. Giving it
   * a brand colour would put it on the same footing as the claims.
   */
  tone?: "indigo" | "cyan" | "slate" | "solid";
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  if (f < at) return null;
  const p = progress(f, at, 8);
  const ink =
    tone === "cyan" ? c.cyan : tone === "slate" ? c.slate : tone === "solid" ? c.ink : c.indigo;
  return (
    <div
      style={{
        position: "absolute",
        left: grid.box.x + grid.box.w,
        top: grid.y(value),
        transform: `translate(0, -50%) scale(${0.94 + 0.06 * p})`,
        padding: "6px 12px",
        borderRadius: theme.shape.chipRadius,
        background: ink,
        color: theme.color.onIndigo,
        fontFamily: theme.text.family,
        fontSize: theme.text.axis.size,
        fontWeight: 700,
        opacity: p,
        whiteSpace: "nowrap",
      }}
    >
      {fmtPrice(value)}
    </div>
  );
};

/**
 * A price ZONE rather than a line — an area where something repeatedly
 * happened. Fills downward from its top edge, because the top is usually the
 * claim (a supply zone's ceiling) and the depth is the uncertainty.
 */
export const Zone = ({
  hi,
  lo,
  grid,
  at,
  over,
  label,
  opacity = 1,
}: {
  hi: number;
  lo: number;
  grid: Grid;
  at: number;
  over: number;
  label?: string;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  if (opacity <= 0.001 || f < at) return null;
  const p = progress(f, at, Math.max(1, over));
  const yTop = grid.y(hi);
  const full = Math.abs(grid.y(lo) - yTop);
  return (
    <>
      <Layer opacity={opacity}>
        {/* ⚠ NO BORDER. An outlined rectangle reads as an OBJECT sitting on
            the chart; a zone is an AREA the price kept doing something in, and
            it has no edge the data actually knows about. The fill carries it
            alone, which is why it is `zoneFill` at 18% rather than the 9%
            wash every other overlay uses. */}
        <rect
          x={grid.box.x}
          y={yTop}
          width={grid.box.w}
          height={Math.max(1, full * p)}
          fill={theme.color.zoneFill}
        />
      </Layer>
      {label && (
        <div
          style={{
            position: "absolute",
            left: grid.box.x + 12,
            top: yTop - 10,
            transform: "translateY(-100%)",
            fontFamily: theme.text.family,
            fontSize: theme.text.tag.size,
            fontWeight: theme.text.tag.weight,
            color: c.indigo,
            opacity: opacity * p,
          }}
        >
          {label}
        </div>
      )}
    </>
  );
};

/**
 * Swing markers, ANCHORED TO CANDLES — a dot on the high or low of a named bar.
 * Anchored rather than floating so the mark cannot drift off the bar it names
 * when the domain changes.
 */
export const SwingMarks = ({
  points,
  grid,
  at,
  stagger,
  tone = "indigo",
}: {
  /** `{ i, value, label }` — the bar index, the price, an optional caption. */
  points: { i: number; value: number; label?: string; below?: boolean }[];
  grid: Grid;
  at: number;
  /** Frames between one mark and the next. */
  stagger: number;
  tone?: "indigo" | "cyan";
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const ink = tone === "cyan" ? c.cyan : c.indigo;
  return (
    <Layer>
      {points.map((q, k) => {
        const t0 = at + k * stagger;
        if (f < t0) return null;
        const p = progress(f, t0, 8);
        const x = grid.x(q.i);
        const y = grid.y(q.value);
        return (
          <g key={`${q.i}-${k}`}>
            <circle cx={x} cy={y} r={7 * p} fill={ink} />
            {q.label && (
              <text
                x={x}
                y={q.below ? y + 34 : y - 20}
                textAnchor="middle"
                fontFamily={theme.text.family}
                fontSize={theme.text.tag.size}
                fontWeight={theme.text.tag.weight}
                fill={ink}
                opacity={p}
              >
                {q.label}
              </text>
            )}
          </g>
        );
      })}
    </Layer>
  );
};

/** An arrow, drawn on. For direction, never for a trade instruction. */
export const Arrow = ({
  from,
  to,
  at,
  over,
  tone = "indigo",
  opacity = 1,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  at: number;
  over: number;
  tone?: "indigo" | "cyan" | "slate";
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  if (opacity <= 0.001 || f < at) return null;
  const p = progress(f, at, Math.max(1, over));
  const ink = tone === "cyan" ? c.cyan : tone === "slate" ? c.slate : c.indigo;
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  const ang = Math.atan2(to.y - from.y, to.x - from.x);
  const head = 16;
  const tip = { x: from.x + (to.x - from.x) * p, y: from.y + (to.y - from.y) * p };
  return (
    <Layer opacity={opacity}>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={ink}
        strokeWidth={theme.shape.line}
        strokeLinecap="round"
        {...drawPath(p, len)}
      />
      {p > 0.85 && (
        <polygon
          points={`0,0 ${-head},${head * 0.45} ${-head},${-head * 0.45}`}
          fill={ink}
          opacity={(p - 0.85) / 0.15}
          transform={`translate(${tip.x},${tip.y}) rotate(${(ang * 180) / Math.PI})`}
        />
      )}
    </Layer>
  );
};

/**
 * A reveal mask — hides everything to the RIGHT of a bar index, so a chart can
 * stop at "today" and the future can be opened later.
 *
 * This is what a prediction beat is built from: the answer is on the chart the
 * whole time and simply has not been shown. Painted in the palette background,
 * so it hides without reading as an object.
 */
export const RevealMask = ({
  fromIndex,
  grid,
  open = 0,
  /** Extra pixels above and below the plot, so the mask covers axis labels too. */
  bleed = 40,
}: {
  fromIndex: number;
  grid: Grid;
  /** 0 = fully masked, 1 = fully open. */
  open?: number;
  bleed?: number;
}) => {
  const c = usePalette();
  const t = Math.max(0, Math.min(1, open));
  const x0 = grid.x(fromIndex);
  const right = grid.box.x + grid.box.w;
  const w = (right - x0) * (1 - t);
  if (w < 1) return null;
  return (
    <Layer>
      <rect
        x={right - w}
        y={grid.box.y - bleed}
        width={w}
        height={grid.box.h + bleed * 2}
        fill={c.bg}
      />
    </Layer>
  );
};
