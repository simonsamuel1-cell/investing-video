/**
 * Band — a horizontal price zone: soft fill, 1px edges, optional label.
 *
 * This is the episode's room grammar, carried over from the Support &
 * Resistance video: an INDIGO band is a floor, a CYAN band is a ceiling. SC12
 * and SC13 turn on that rule — the same band re-tints when price passes
 * through it, and the swap is the whole point of those two scenes.
 */
import { theme } from "../theme";
import { usePalette } from "../palette";

export const Band = ({
  x,
  w,
  yTop,
  yBottom,
  variant = "indigo",
  draw = 1,
  fillOpacity = 0.1,
  opacity = 1,
  label,
  labelSide = "left",
  /** 0→1 blend from `variant` to `variantTo` — used for the floor↔ceiling swap. */
  variantTo,
  blend = 0,
}: {
  x: number;
  w: number;
  yTop: number;
  yBottom: number;
  variant?: "indigo" | "cyan" | "slate";
  draw?: number;
  fillOpacity?: number;
  opacity?: number;
  label?: string;
  labelSide?: "left" | "right";
  variantTo?: "indigo" | "cyan" | "slate";
  blend?: number;
}) => {
  const pal = usePalette();
  if (opacity <= 0.001 || draw <= 0.001) return null;
  const pick = (v: "indigo" | "cyan" | "slate") => (v === "indigo" ? pal.indigo : v === "cyan" ? pal.cyan : pal.slate);

  const hexRgb = (h: string) => {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const a = hexRgb(pick(variant));
  const b = variantTo ? hexRgb(pick(variantTo)) : a;
  const t = Math.max(0, Math.min(1, blend));
  const color = `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;

  const ww = Math.max(0, w * Math.max(0, Math.min(1, draw)));
  const h = Math.max(0, yBottom - yTop);

  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height} opacity={opacity}>
        <rect x={x} y={yTop} width={ww} height={h} fill={color} opacity={fillOpacity} />
        <line x1={x} y1={yTop} x2={x + ww} y2={yTop} stroke={color} strokeWidth={theme.stroke.hair} opacity={0.8} />
        <line x1={x} y1={yBottom} x2={x + ww} y2={yBottom} stroke={color} strokeWidth={theme.stroke.hair} opacity={0.8} />
      </svg>
      {label && (
        <div
          style={{
            position: "absolute",
            // above the band's top edge, so it never sits on the price line
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
