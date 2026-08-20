/**
 * Ping.tsx — a cyan ring at a touch point, 20 frames and gone.
 *
 * The episode's "here, now" mark. It is UI, so it may expand and fade on
 * arrival — that and the chips are the only places any pop is allowed. Type
 * never pops.
 */
import { theme } from "../theme";
import { Layer } from "./ChartFrame";

export const Ping = ({
  x,
  y,
  f,
  at,
  life = theme.motion.pingF,
  r = 30,
}: {
  x: number;
  y: number;
  f: number;
  at: number;
  life?: number;
  r?: number;
}) => {
  if (f < at || f > at + life) return null;
  const t = (f - at) / life;
  return (
    <Layer opacity={1 - t}>
      <circle
        cx={x}
        cy={y}
        r={r * (0.4 + 0.9 * t)}
        fill="none"
        stroke={theme.colors.cyan}
        strokeWidth={theme.layout.stroke.band}
      />
    </Layer>
  );
};
