/**
 * FocusFrame — rounded indigo 2px frame; everything OUTSIDE dims via four
 * bg-colored cover rects (no SafeArea-opaque tricks). The scene animates the
 * rect between targets and drives dimStrength / strokeOpacity.
 */
import { theme } from "../theme";

export type FocusRect = { x: number; y: number; w: number; h: number };

export const FocusFrame = ({
  rect,
  dimOpacity = 0.15, // what the outside dims TO at full strength
  dimStrength = 1, // 0–1 animate the dim on/off
  strokeOpacity = 1,
}: {
  rect: FocusRect;
  dimOpacity?: number;
  dimStrength?: number;
  strokeOpacity?: number;
}) => {
  const cover = (1 - dimOpacity) * dimStrength;
  const W = theme.canvas.width;
  const H = theme.canvas.height;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
      <g fill={theme.colors.bg} opacity={cover}>
        <rect x={0} y={0} width={W} height={rect.y} />
        <rect x={0} y={rect.y + rect.h} width={W} height={H - rect.y - rect.h} />
        <rect x={0} y={rect.y} width={rect.x} height={rect.h} />
        <rect x={rect.x + rect.w} y={rect.y} width={W - rect.x - rect.w} height={rect.h} />
      </g>
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.w}
        height={rect.h}
        rx={theme.radius.card}
        fill="none"
        stroke={theme.colors.indigo}
        strokeWidth={theme.stroke.standard}
        opacity={strokeOpacity}
      />
    </svg>
  );
};
