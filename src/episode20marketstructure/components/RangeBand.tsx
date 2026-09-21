/**
 * RangeBand.tsx — a horizontal price zone: soft fill, dashed edges, a label.
 *
 * This carries the room grammar from the Support & Resistance episode, and
 * SC12 and SC13 turn on it: an INDIGO band is a floor, a CYAN band is a
 * ceiling. Neither scene draws a second band when price passes through — the
 * SAME band re-tints. That is the claim being made: one level, two stories,
 * and nothing about it changed except which side price is standing on.
 *
 * `blend` 0→1 mixes `tone` into `becomes`, moving fill and edges together so
 * the swap reads as one object changing its mind.
 */
import { theme } from "../theme";
import { Layer } from "./Stage";

type Tint = "indigo" | "cyan" | "slate";

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const hexOf = (t: Tint) => (t === "indigo" ? theme.color.indigo : t === "cyan" ? theme.color.cyan : theme.color.slate);

export const RangeBand = ({
  x,
  w,
  top,
  bottom,
  tone = "indigo",
  becomes,
  blend = 0,
  draw = 1,
  fill = 0.1,
  opacity = 1,
  label,
  labelSide = "left",
  pierce,
}: {
  x: number;
  w: number;
  top: number;
  bottom: number;
  tone?: Tint;
  becomes?: Tint;
  blend?: number;
  draw?: number;
  fill?: number;
  opacity?: number;
  label?: string;
  labelSide?: "left" | "right";
  pierce?: { x: number; y: number; amount: number };
}) => {
  if (opacity <= 0.001 || draw <= 0.001) return null;
  const a = rgb(hexOf(tone));
  const b = becomes ? rgb(hexOf(becomes)) : a;
  const t = Math.max(0, Math.min(1, blend));
  const color = `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;
  const ww = Math.max(0, w * Math.max(0, Math.min(1, draw)));
  const h = Math.max(0, bottom - top);

  return (
    <>
      <Layer opacity={opacity}>
        <rect x={x} y={top} width={ww} height={h} fill={color} opacity={fill} />
        <line x1={x} y1={top} x2={x + ww} y2={top} stroke={color} strokeWidth={theme.shape.hairline} strokeDasharray="12 10" opacity={0.85} />
        <line x1={x} y1={bottom} x2={x + ww} y2={bottom} stroke={color} strokeWidth={theme.shape.hairline} strokeDasharray="12 10" opacity={0.85} />
        {pierce && pierce.amount > 0.001 && (
          <circle cx={pierce.x} cy={pierce.y} r={12 + 40 * pierce.amount} fill="none" stroke={color} strokeWidth={theme.shape.rule} opacity={(1 - pierce.amount) * 0.9} />
        )}
      </Layer>
      {label && (
        <div
          style={{
            position: "absolute",
            // above the band's top edge — a label inside it sits on the price
            left: labelSide === "left" ? x + 6 : x + ww - 6,
            top: top - 14,
            transform: labelSide === "left" ? "translate(0, -100%)" : "translate(-100%, -100%)",
            fontFamily: theme.text.family,
            fontSize: theme.text.chip.size,
            fontWeight: theme.text.chip.weight,
            color,
            opacity: opacity * Math.max(0, Math.min(1, draw * 2 - 1)),
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      )}
    </>
  );
};
