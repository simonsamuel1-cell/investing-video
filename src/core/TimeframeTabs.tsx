/**
 * core/TimeframeTabs.tsx — the timeframe row every broker screen has.
 *
 * The active tab is FILLED; the rest are plain type. No outlines on the
 * inactive ones: a row of five outlined pills reads as five buttons competing
 * for a press, and the point of this row is that one of them is already chosen.
 *
 * ⚠ IT IS CHROME, NOT AN ARGUMENT. It exists so a chart reads as a real
 * screen — and, in the episode about volume, so that "1D" and "5M" can be
 * pointed at while the chart underneath does not change. Nothing about it is
 * clickable and nothing about it is a recommendation.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { usePalette } from "./palette";
import { progress } from "./helpers";
import { useMotion } from "./useMotion";

export const TimeframeTabs = ({
  tabs,
  active,
  x,
  y,
  at = 0,
  anchor = "left",
  opacity = 1,
}: {
  tabs: string[];
  /** Index of the tab that is filled. */
  active: number;
  x: number;
  /** Centre-y of the row. */
  y: number;
  at?: number;
  anchor?: "left" | "center" | "right";
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  if (opacity <= 0.001 || f < at) return null;
  const p = progress(f, at, m.pop);
  const size = theme.text.axis.size;
  const pad = { x: Math.round(size * 0.68), y: Math.round(size * 0.34) };
  const shift = anchor === "center" ? "-50%" : anchor === "right" ? "-100%" : "0";

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${shift}, -50%)`,
        display: "flex",
        alignItems: "center",
        gap: Math.round(size * 0.32),
        fontFamily: theme.text.family,
        opacity: opacity * p,
      }}
    >
      {tabs.map((t, i) => (
        <span
          key={t}
          style={{
            padding: `${pad.y}px ${pad.x}px`,
            borderRadius: theme.shape.chipRadius,
            background: i === active ? c.indigo : "transparent",
            color: i === active ? theme.color.onIndigo : c.slate,
            fontSize: size,
            fontWeight: i === active ? 700 : theme.text.axis.weight,
            whiteSpace: "nowrap",
          }}
        >
          {t}
        </span>
      ))}
    </div>
  );
};
