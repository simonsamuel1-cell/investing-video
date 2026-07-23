/**
 * Ping — cyan concentric pulse at a chart point; optional numbered label.
 * Pop allowed (UI element). Render as HTML overlay (absolute, canvas coords).
 */
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";

export const Ping = ({
  cx,
  cy,
  startFrame,
  numberLabel,
}: {
  cx: number;
  cy: number;
  startFrame: number;
  numberLabel?: string;
}) => {
  const f = useCurrentFrame();
  if (f < startFrame) return null;
  const t = f - startFrame;
  const rings = [0, 8].map((delay) => {
    const q = interpolate(t, [delay, delay + 26], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { r: 10 + q * 42, op: (1 - q) * 0.8 };
  });
  const dotIn = interpolate(t, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}
      width={theme.canvas.width}
      height={theme.canvas.height}
    >
      {rings.map((ring, i) => (
        <circle key={i} cx={cx} cy={cy} r={ring.r} fill="none" stroke={theme.colors.cyan} strokeWidth={theme.stroke.standard} opacity={ring.op} />
      ))}
      <circle cx={cx} cy={cy} r={9 * dotIn} fill={theme.colors.cyan} opacity={dotIn} />
      {numberLabel !== undefined && (
        <text
          x={cx}
          y={cy - 24}
          textAnchor="middle"
          fontFamily={theme.type.family}
          fontSize={theme.type.label.size}
          fontWeight={theme.type.label.weight}
          fill={theme.colors.slate}
          opacity={dotIn}
        >
          {numberLabel}
        </text>
      )}
    </svg>
  );
};
