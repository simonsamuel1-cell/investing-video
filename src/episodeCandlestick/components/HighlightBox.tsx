/**
 * HighlightBox — a rounded indigo highlight rectangle over the chart, with an
 * optional label placed beside its left edge and bottom-aligned. This is the box
 * used at frame 9990 (the recovery highlight): pass label="+10%".
 */
import { theme } from "../theme";

export const HighlightBox = ({
  x,
  y,
  w,
  h,
  opacity = 1,
  radius = 12,
  label,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  opacity?: number;
  radius?: number;
  label?: string; // e.g. "+10%" — sits beside-left, aligned to the box bottom
}) => (
  <>
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
      <rect x={x} y={y} width={w} height={h} rx={radius} fill="none" stroke={theme.colors.indigo} strokeWidth={theme.stroke.standard} opacity={opacity} />
    </svg>
    {label && (
      <div
        style={{
          position: "absolute",
          left: x - 190,
          top: y + h - 48,
          width: 170,
          textAlign: "right",
          fontFamily: theme.type.family,
          fontSize: 44,
          fontWeight: theme.type.headline.weight,
          color: theme.colors.indigo,
          opacity,
        }}
      >
        {label}
      </div>
    )}
  </>
);
