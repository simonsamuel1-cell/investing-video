/**
 * SubPane — one of the indicator panes that slide up under the chart in SC02.
 *
 * It exists to be buried and then cleared away: the point of that scene is that
 * the tools arrive before the direction. So the pane is drawn accurately (the
 * values come from data/indicators, computed on the same series) and then wiped
 * in one pass.
 */
import { theme } from "../theme";
import { usePalette } from "../palette";
import type { Box } from "../helpers";

export const SubPane = ({
  box,
  values,
  window: win,
  kind = "line",
  rise = 1,
  label,
  bounds,
}: {
  box: Box;
  values: (number | null)[];
  window: [number, number];
  kind?: "line" | "hist";
  /** 0→1 slide up from below the card. */
  rise?: number;
  label?: string;
  /** Fixed value range; auto-fitted when omitted. */
  bounds?: [number, number];
}) => {
  const pal = usePalette();
  if (rise <= 0.001) return null;
  const [a, b] = win;
  const slice = values.slice(a, b + 1);
  const real = slice.filter((v): v is number => v !== null && v !== undefined);
  if (real.length < 2) return null;
  const lo = bounds ? bounds[0] : Math.min(...real);
  const hi = bounds ? bounds[1] : Math.max(...real);
  const span = Math.max(1e-6, hi - lo);
  const x = (i: number) => box.x + (box.w * (i - a)) / Math.max(1, b - a);
  const y = (v: number) => box.y + box.h - ((v - lo) / span) * box.h;
  const zero = y(Math.max(lo, Math.min(hi, 0)));

  const d = slice
    .map((v, i) => (v === null || v === undefined ? null : `${x(a + i)},${y(v)}`))
    .filter(Boolean)
    .map((s, i) => `${i === 0 ? "M" : "L"}${s}`)
    .join(" ");

  const dy = (1 - Math.max(0, Math.min(1, rise))) * 90;
  const barW = Math.max(1.5, (box.w / Math.max(1, b - a)) * 0.6);

  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", transform: `translateY(${dy}px)`, opacity: rise }}
      width={theme.canvas.width}
      height={theme.canvas.height}
    >
      <rect x={box.x} y={box.y} width={box.w} height={box.h} fill={pal.indigoTint8} rx={theme.radius.chip} />
      {kind === "line" ? (
        <path d={d} fill="none" stroke={pal.indigoTintMA1} strokeWidth={theme.stroke.rule} />
      ) : (
        slice.map((v, i) =>
          v === null || v === undefined ? null : (
            <rect
              key={i}
              x={x(a + i) - barW / 2}
              y={Math.min(zero, y(v))}
              width={barW}
              height={Math.max(1, Math.abs(y(v) - zero))}
              fill={pal.indigoTintMA1}
            />
          ),
        )
      )}
      {label && (
        <text
          x={box.x + 12}
          y={box.y + 24}
          fontFamily={theme.type.family}
          fontSize={theme.type.axis.size}
          fontWeight={theme.type.axis.weight}
          fill={pal.slate}
        >
          {label}
        </text>
      )}
    </svg>
  );
};
