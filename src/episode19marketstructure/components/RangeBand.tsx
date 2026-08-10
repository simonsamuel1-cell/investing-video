/**
 * RangeBand — a horizontal price zone with dashed boundaries and a label.
 *
 * This carries the room grammar from the Support & Resistance episode:
 * an INDIGO band is a floor, a CYAN band is a ceiling. SC12 and SC13 trade on
 * exactly that — the same band RE-TINTS when price passes through it instead of
 * a new band being drawn. That is the claim those scenes make: one level, two
 * stories, and nothing about it changed except which side price stands on.
 *
 * `blend` 0→1 mixes `variant` into `variantTo`; the boundary and fill move
 * together so the swap reads as one object changing its mind.
 */
import { theme } from "../theme";
import { Layer } from "./SafeArea";

type Tint = "indigo" | "cyan" | "slate";

const hex = (v: string) => {
  const n = parseInt(v.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const pick = (v: Tint) => (v === "indigo" ? theme.colors.indigo : v === "cyan" ? theme.colors.cyan : theme.colors.slate);

export const RangeBand = ({
  x,
  w,
  yTop,
  yBottom,
  variant = "indigo",
  variantTo,
  blend = 0,
  draw = 1,
  fillOpacity = 0.1,
  opacity = 1,
  label,
  labelSide = "left",
  pierce,
}: {
  x: number;
  w: number;
  yTop: number;
  yBottom: number;
  variant?: Tint;
  variantTo?: Tint;
  /** 0→1 crossfade from `variant` to `variantTo`. */
  blend?: number;
  /** 0→1 left→right reveal. */
  draw?: number;
  fillOpacity?: number;
  opacity?: number;
  label?: string;
  labelSide?: "left" | "right";
  /** A ring at the point price crosses a boundary. */
  pierce?: { x: number; y: number; amount: number };
}) => {
  if (opacity <= 0.001 || draw <= 0.001) return null;
  const a = hex(pick(variant));
  const b = variantTo ? hex(pick(variantTo)) : a;
  const t = Math.max(0, Math.min(1, blend));
  const color = `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;

  const ww = Math.max(0, w * Math.max(0, Math.min(1, draw)));
  const h = Math.max(0, yBottom - yTop);

  return (
    <>
      <Layer opacity={opacity}>
        <rect x={x} y={yTop} width={ww} height={h} fill={color} opacity={fillOpacity} />
        <line x1={x} y1={yTop} x2={x + ww} y2={yTop} stroke={color} strokeWidth={theme.stroke.hair} strokeDasharray="12 10" opacity={0.85} />
        <line x1={x} y1={yBottom} x2={x + ww} y2={yBottom} stroke={color} strokeWidth={theme.stroke.hair} strokeDasharray="12 10" opacity={0.85} />
        {pierce && pierce.amount > 0.001 && (
          <circle
            cx={pierce.x}
            cy={pierce.y}
            r={12 + 40 * pierce.amount}
            fill="none"
            stroke={color}
            strokeWidth={theme.stroke.rule}
            opacity={(1 - pierce.amount) * 0.9}
          />
        )}
      </Layer>
      {label && (
        <div
          style={{
            position: "absolute",
            // above the band's top edge, so the label never sits on the price
            left: labelSide === "left" ? x + 4 : x + ww - 4,
            top: yTop - 12,
            transform: labelSide === "left" ? "translate(0, -100%)" : "translate(-100%, -100%)",
            fontFamily: theme.type.family,
            fontSize: theme.type.chip.size,
            fontWeight: theme.type.chip.weight,
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
