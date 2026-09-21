/**
 * SubPane — RSI(14) or MACD(12,26,9) sub-pane that slides up under the price
 * pane. Values are COMPUTED from the daily series. Indigo/cyan/neutral only —
 * histogram bars never use candle red/green.
 */
import { theme } from "../theme";
import { interpolate } from "remotion";
import type { Box } from "../helpers";
import type { OHLC } from "../data/bmri";
import { rsi, macd } from "../data/bmri";

export const SubPane = ({
  kind,
  data,
  window: win,
  box,
  cx,
  slideProgress,
  title,
}: {
  kind: "rsi" | "macd";
  data: OHLC[];
  window: [number, number];
  box: Box; // resting box; the pane slides up into it
  cx: (globalIdx: number) => number;
  slideProgress: number; // 0–1
  title: string;
}) => {
  if (slideProgress <= 0.001) return null;
  const [a, b] = win;
  const dy = interpolate(slideProgress, [0, 1], [box.h + 24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const top = box.y + dy;

  let body: React.ReactNode = null;

  if (kind === "rsi") {
    const vals = rsi(data, 14);
    const yOf = (v: number) => top + box.h - (v / 100) * box.h;
    const pts: string[] = [];
    for (let i = a; i <= b; i++) {
      const v = vals[i];
      if (v === null || v === undefined) continue;
      pts.push(`${pts.length === 0 ? "M" : "L"}${cx(i)},${yOf(v)}`);
    }
    body = (
      <>
        <line x1={box.x} y1={yOf(70)} x2={box.x + box.w} y2={yOf(70)} stroke={theme.colors.border} strokeWidth={theme.stroke.hair} strokeDasharray="8 8" />
        <line x1={box.x} y1={yOf(30)} x2={box.x + box.w} y2={yOf(30)} stroke={theme.colors.border} strokeWidth={theme.stroke.hair} strokeDasharray="8 8" />
        <path d={pts.join(" ")} fill="none" stroke={theme.colors.indigo} strokeWidth={theme.stroke.rule} />
      </>
    );
  } else {
    const m = macd(data, 12, 26, 9);
    const slice = [];
    for (let i = a; i <= b; i++) slice.push(m.hist[i]);
    const maxAbs = Math.max(...slice.map((v) => Math.abs(v)), 1);
    const mid = top + box.h / 2;
    const barW = Math.max(1.5, (box.w / Math.max(1, b - a + 1)) * 0.55);
    body = (
      <>
        <line x1={box.x} y1={mid} x2={box.x + box.w} y2={mid} stroke={theme.colors.border} strokeWidth={theme.stroke.hair} />
        {Array.from({ length: b - a + 1 }, (_, k) => {
          const i = a + k;
          const v = m.hist[i];
          const hh = (Math.abs(v) / maxAbs) * (box.h / 2 - 6);
          return (
            <rect
              key={i}
              x={cx(i) - barW / 2}
              y={v >= 0 ? mid - hh : mid}
              width={barW}
              height={Math.max(1, hh)}
              fill={v >= 0 ? theme.colors.indigo : theme.colors.indigoTintMA2}
              opacity={0.85}
            />
          );
        })}
      </>
    );
  }

  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: slideProgress }} width={theme.canvas.width} height={theme.canvas.height}>
        {body}
      </svg>
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: top - 30,
          fontFamily: theme.type.family,
          fontSize: theme.type.axis.size,
          fontWeight: 600,
          color: theme.colors.slate,
          opacity: slideProgress,
        }}
      >
        {title}
      </div>
    </>
  );
};
