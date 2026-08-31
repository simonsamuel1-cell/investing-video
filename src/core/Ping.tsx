/**
 * core/Ping.tsx — a concentric pulse at a chart point, with an optional
 * numbered label. Marks "look here" without drawing anything the chart itself
 * would own.
 *
 * Pop is allowed: it is a UI element, not type.
 *
 * Ring timing is in SECONDS via useMotion, so the pulse keeps its wall-clock
 * rhythm at any fps.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "./theme";
import { usePalette } from "./palette";
import { useMotion } from "./useMotion";
import { Layer } from "./Stage";

export const Ping = ({
  cx,
  cy,
  at,
  label,
  labelBelow = false,
}: {
  cx: number;
  cy: number;
  /** Frame it starts on. Scene-local. */
  at: number;
  /** Optional numeral or short tag, e.g. "1". */
  label?: string;
  /** Place the label below the point instead of above. */
  labelBelow?: boolean;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  if (f < at) return null;

  const t = f - at;
  const ringSpan = m.sec(0.867);
  const ringGap = m.sec(0.267);
  const rings = [0, ringGap].map((delay) => {
    const q = interpolate(t, [delay, delay + ringSpan], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { r: 10 + q * 42, op: (1 - q) * 0.8 };
  });
  const dotIn = interpolate(t, [0, m.sec(0.2)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Layer>
      {rings.map((ring, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={ring.r}
          fill="none"
          stroke={c.cyan}
          strokeWidth={theme.shape.line}
          opacity={ring.op}
        />
      ))}
      <circle cx={cx} cy={cy} r={9 * dotIn} fill={c.cyan} opacity={dotIn} />
      {label !== undefined && (
        <text
          x={cx}
          y={labelBelow ? cy + 24 + theme.text.tag.size : cy - 24}
          textAnchor="middle"
          fontFamily={theme.text.family}
          fontSize={theme.text.tag.size}
          fontWeight={theme.text.tag.weight}
          fill={c.slate}
          opacity={dotIn}
        >
          {label}
        </text>
      )}
    </Layer>
  );
};
