/**
 * ZoneBand — horizontal price band marking a revisited area. Indigo fill
 * (opacity driven by the scene), 1px edges. Never red/green, no arrows.
 */
import { theme } from "../theme";

export const ZoneBand = ({
  x,
  w,
  yTop,
  yBottom,
  fillOpacity = 0.08,
  drawProgress = 1,
  opacity = 1,
}: {
  x: number;
  w: number;
  yTop: number;
  yBottom: number;
  fillOpacity?: number;
  drawProgress?: number; // 0–1 left→right reveal
  opacity?: number;
}) => {
  const ww = Math.max(0, w * drawProgress);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
      <rect x={x} y={yTop} width={ww} height={Math.max(0, yBottom - yTop)} fill={theme.colors.indigo} opacity={fillOpacity * opacity} />
      <line x1={x} y1={yTop} x2={x + ww} y2={yTop} stroke={theme.colors.indigo} strokeWidth={theme.stroke.hair} opacity={0.75 * opacity} />
      <line x1={x} y1={yBottom} x2={x + ww} y2={yBottom} stroke={theme.colors.indigo} strokeWidth={theme.stroke.hair} opacity={0.75 * opacity} />
    </svg>
  );
};
