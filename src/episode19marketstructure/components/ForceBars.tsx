/**
 * ForceBars — SC09's balance module. Buyers push from the left, sellers from
 * the right, against a centred divider.
 *
 * Equal lengths leave the divider dead centre. The tremble is deterministic and
 * applies to the DIVIDER ONLY: it says both sides are working without letting
 * either win, which is exactly what sideways means. Nothing here is a signal —
 * no arrow, no advantage, no call.
 */
import { theme } from "../theme";
import { Layer } from "./SafeArea";

export const ForceBars = ({
  cx,
  cy,
  w,
  frame,
  reveal = 1,
  buy = 1,
  sell = 1,
  barH = 44,
  gap = 26,
  labels = ["Pembeli", "Penjual"],
}: {
  cx: number;
  cy: number;
  w: number;
  /** Scene-local frame — drives the tremble. */
  frame: number;
  reveal?: number;
  buy?: number;
  sell?: number;
  barH?: number;
  gap?: number;
  labels?: string[];
}) => {
  if (reveal <= 0.001) return null;
  const p = Math.max(0, Math.min(1, reveal));
  const half = w / 2;
  // neither side ever gains ground; the divider only shivers
  const divider = cx + Math.sin(frame / 7) * 2.2 + Math.sin(frame / 3.3) * 1.1;
  const rowY = (i: number) => cy + (i === 0 ? -(barH + gap) / 2 : (barH + gap) / 2);

  return (
    <>
      <Layer>
        <rect
          x={divider - half * buy * p}
          y={rowY(0) - barH / 2}
          width={half * buy * p}
          height={barH}
          rx={theme.radius.chip}
          fill={theme.colors.indigo}
          opacity={0.9}
        />
        <rect
          x={divider}
          y={rowY(1) - barH / 2}
          width={half * sell * p}
          height={barH}
          rx={theme.radius.chip}
          fill={theme.colors.cyan}
          opacity={0.9}
        />
        <line x1={divider} y1={cy - barH - gap} x2={divider} y2={cy + barH + gap} stroke={theme.colors.ink} strokeWidth={theme.stroke.rule} opacity={0.55 * p} />
      </Layer>
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: i === 0 ? divider - half * buy * p - 14 : divider + half * sell * p + 14,
            top: rowY(i),
            transform: i === 0 ? "translate(-100%, -50%)" : "translate(0, -50%)",
            fontFamily: theme.type.family,
            fontSize: theme.type.chip.size,
            fontWeight: theme.type.chip.weight,
            color: i === 0 ? theme.colors.indigo : theme.colors.cyan,
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
