/**
 * ForceBars.tsx — SC09's balance module. Buyers push from the left, sellers
 * from the right, against a divider in the middle.
 *
 * Equal lengths leave the divider dead centre. The tremble is deterministic and
 * applies to the DIVIDER ONLY: it says both sides are working without letting
 * either win, which is what sideways means. Nothing here is a signal — no
 * arrow, no advantage, no call.
 */
import { theme } from "../theme";
import { Layer } from "./Stage";

export const ForceBars = ({
  cx,
  cy,
  width,
  frame,
  reveal = 1,
  buy = 1,
  sell = 1,
  barHeight = 44,
  gap = 26,
  labels = ["Pembeli", "Penjual"],
}: {
  cx: number;
  cy: number;
  width: number;
  /** Scene-local frame — drives the tremble. */
  frame: number;
  reveal?: number;
  buy?: number;
  sell?: number;
  barHeight?: number;
  gap?: number;
  labels?: readonly string[];
}) => {
  if (reveal <= 0.001) return null;
  const p = Math.max(0, Math.min(1, reveal));
  const half = width / 2;
  // neither side gains ground; the divider only shivers
  const divider = cx + Math.sin(frame / 7) * 2.2 + Math.sin(frame / 3.3) * 1.1;
  const rowY = (i: number) => cy + (i === 0 ? -(barHeight + gap) / 2 : (barHeight + gap) / 2);
  const len = (which: 0 | 1) => half * (which === 0 ? buy : sell) * p;

  return (
    <>
      <Layer>
        <rect x={divider - len(0)} y={rowY(0) - barHeight / 2} width={len(0)} height={barHeight} rx={theme.shape.chipRadius} fill={theme.color.indigo} opacity={0.9} />
        <rect x={divider} y={rowY(1) - barHeight / 2} width={len(1)} height={barHeight} rx={theme.shape.chipRadius} fill={theme.color.cyan} opacity={0.9} />
        <line x1={divider} y1={cy - barHeight - gap} x2={divider} y2={cy + barHeight + gap} stroke={theme.color.ink} strokeWidth={theme.shape.rule} opacity={0.55 * p} />
      </Layer>
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: i === 0 ? divider - len(0) - 16 : divider + len(1) + 16,
            top: rowY(i),
            transform: i === 0 ? "translate(-100%, -50%)" : "translate(0, -50%)",
            fontFamily: theme.text.family,
            fontSize: theme.text.chip.size,
            fontWeight: theme.text.chip.weight,
            color: i === 0 ? theme.color.indigo : theme.color.cyan,
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
