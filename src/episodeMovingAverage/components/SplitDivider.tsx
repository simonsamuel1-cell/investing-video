/**
 * SplitDivider.tsx — the one vertical rule in the episode, Scene 01 only, and
 * the ticking clock that sits beside it.
 *
 * Scene 01 is the single place the chart is split, because its whole argument
 * is a side-by-side: three laboured questions on the left, one instant line on
 * the right. Every other scene uses the chart whole.
 *
 * THE CLOCK IS THE ARGUMENT. It ticks once a second through the manual read
 * and STOPS the moment the indicator's line lands — the elapsed time is the
 * point being made, so the hand must move in visible one-second steps rather
 * than sweep. A smooth sweep would read as decoration.
 */
import { theme } from "../theme";
import { progress } from "../helpers";
import { Layer } from "./ChartFrame";

export const SplitDivider = ({ f, at = 0 }: { f: number; at?: number }) => {
  if (f < at) return null;
  const box = theme.layout.chartA;
  return (
    <Layer opacity={progress(f, at, 14)}>
      <line
        x1={theme.layout.splitX}
        y1={box.y}
        x2={theme.layout.splitX}
        y2={box.y + box.h}
        stroke={theme.colors.border}
        strokeWidth={theme.layout.border.thin}
      />
    </Layer>
  );
};

export const TickingClock = ({
  x,
  y,
  f,
  at,
  stopAt,
  r = 34,
}: {
  x: number;
  y: number;
  f: number;
  at: number;
  /** The frame the hand freezes — the indicator has answered. */
  stopAt: number;
  r?: number;
}) => {
  if (f < at) return null;
  const fps = theme.layout.fps;
  const held = Math.min(f, stopAt);
  /* whole seconds only: the hand steps, it does not sweep */
  const ticks = Math.floor((held - at) / fps);
  const angle = (ticks % 60) * 6 - 90;
  const hand = {
    x: x + Math.cos((angle * Math.PI) / 180) * r * 0.68,
    y: y + Math.sin((angle * Math.PI) / 180) * r * 0.68,
  };
  const stopped = f >= stopAt;
  return (
    <Layer opacity={progress(f, at, 12)}>
      <circle
        cx={x}
        cy={y}
        r={r}
        fill="none"
        stroke={stopped ? theme.colors.indigo : theme.colors.textMuted}
        strokeWidth={theme.layout.border.thick}
      />
      <line
        x1={x}
        y1={y}
        x2={hand.x}
        y2={hand.y}
        stroke={stopped ? theme.colors.indigo : theme.colors.textMuted}
        strokeWidth={theme.layout.border.thick}
        strokeLinecap="round"
      />
      <circle cx={x} cy={y} r={3} fill={stopped ? theme.colors.indigo : theme.colors.textMuted} />
    </Layer>
  );
};
