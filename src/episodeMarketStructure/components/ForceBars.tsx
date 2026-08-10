/**
 * ForceBars — the balance module in SC09. Two bars push against a centre
 * divider: buyers from the left, sellers from the right.
 *
 * Equal `buy` and `sell` leave the divider dead centre. The tremble is a small
 * deterministic oscillation of the divider only — it says "both sides are
 * working" without letting either win, which is exactly what sideways means.
 * Nothing here is a signal: no arrow, no advantage, no call.
 */
import { theme } from "../theme";
import { usePalette } from "../palette";

export const ForceBars = ({
  cx,
  cy,
  w,
  barH = 44,
  gap = 26,
  reveal = 1,
  frame = 0,
  buy = 1,
  sell = 1,
  labels = ["Pembeli", "Penjual"],
}: {
  cx: number;
  cy: number;
  w: number;
  barH?: number;
  gap?: number;
  reveal?: number;
  /** Scene-local frame — drives the tremble. */
  frame?: number;
  buy?: number;
  sell?: number;
  labels?: [string, string] | string[];
}) => {
  const pal = usePalette();
  if (reveal <= 0.001) return null;
  const p = Math.max(0, Math.min(1, reveal));
  const half = w / 2;
  // Neither side ever gains ground; the divider only shivers.
  const tremble = Math.sin(frame / 7) * 2.2 + Math.sin(frame / 3.3) * 1.1;
  const divider = cx + tremble;

  const bar = (side: "buy" | "sell") => {
    const len = half * (side === "buy" ? buy : sell) * p;
    const color = side === "buy" ? pal.indigo : pal.cyan;
    const y = cy + (side === "buy" ? -(barH + gap) / 2 : (barH + gap) / 2) - barH / 2;
    const x = side === "buy" ? divider - len : divider;
    return (
      <g key={side}>
        <rect x={x} y={y} width={len} height={barH} rx={theme.radius.chip} fill={color} opacity={0.9} />
      </g>
    );
  };

  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
        {bar("buy")}
        {bar("sell")}
        <line
          x1={divider}
          y1={cy - barH - gap}
          x2={divider}
          y2={cy + barH + gap}
          stroke={pal.ink}
          strokeWidth={theme.stroke.rule}
          opacity={0.55 * p}
        />
      </svg>
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: i === 0 ? divider - half * buy * p - 14 : divider + half * sell * p + 14,
            top: cy + (i === 0 ? -(barH + gap) / 2 : (barH + gap) / 2),
            transform: i === 0 ? "translate(-100%, -50%)" : "translate(0, -50%)",
            fontFamily: theme.type.family,
            fontSize: theme.type.chip.size,
            fontWeight: theme.type.chip.weight,
            color: i === 0 ? pal.indigo : pal.cyan,
            opacity: p,
            whiteSpace: "nowrap",
          }}
        >
          {labels[i]}
        </div>
      ))}
    </>
  );
};
