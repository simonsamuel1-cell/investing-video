/**
 * VI02 · SC07, card 2 — a profit line over the years (a shape, no figures): the tip runs along the curve and leaves a dot on
 * every year it passes. Simon, 25 Nov: "ganti gambar kartu 2 jadi garis laba" (it was the old revenue-split bar).
 */
import { theme, usePalette } from "../../../core";

/** The years' levels, 0–1 of the height: up, a small dip, then up. */
const LEVELS = [0.26, 0.46, 0.38, 0.66, 0.92] as const;
const N = LEVELS.length - 1;
const STEPS = 24;
const TIP = 11;

/** The smooth curve's level at u (0 = first year, 1 = last). */
const levelAt = (u: number) => {
  const i = Math.min(N - 1, Math.floor(u * N));
  const t = u * N - i;
  const slope = (k: number) =>
    (LEVELS[Math.min(N, k + 1)] - LEVELS[Math.max(0, k - 1)]) / 2;
  const [a, b] = [LEVELS[i], LEVELS[i + 1]];
  return (
    (2 * t ** 3 - 3 * t ** 2 + 1) * a +
    (t ** 3 - 2 * t ** 2 + t) * slope(i) +
    (3 * t ** 2 - 2 * t ** 3) * b +
    (t ** 3 - t ** 2) * slope(i + 1)
  );
};

/** `on` brings in the baseline and its years; `p` (0–1) is how far along the years the line has come. */
export const ProfitLine = ({
  x,
  y,
  w,
  h,
  on,
  p,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  on: number;
  p: number;
}) => {
  const c = usePalette();
  if (on <= 0.001) return null;
  const at = (u: number) => [u * w, h - levelAt(u) * h] as const;
  const n = Math.max(1, Math.ceil(p * N * STEPS));
  const pts = Array.from({ length: n + 1 }, (_, k) => at((p * k) / n));
  const line = pts.map(([a, b]) => `${a.toFixed(2)},${b.toFixed(2)}`).join(" ");
  const [tx, ty] = at(p);
  return (
    <svg
      width={w}
      height={h}
      style={{
        position: "absolute",
        left: x,
        top: y,
        overflow: "visible",
        opacity: on,
      }}
    >
      <polygon points={`0,${h} ${line} ${tx},${h}`} fill={c.indigoSoft} />
      <line
        x1={-12}
        x2={w + 12}
        y1={h}
        y2={h}
        stroke={theme.color.skeleton}
        strokeWidth={5}
        strokeLinecap="round"
      />
      {LEVELS.map((_, i) => (
        <circle
          key={i}
          cx={(i / N) * w}
          cy={h}
          r={7}
          fill={theme.color.skeleton}
        />
      ))}
      <polyline
        points={line}
        fill="none"
        stroke={c.indigo}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {LEVELS.map((_, i) => {
        const [cx, cy] = at(i / N);
        const r = Math.max(0, Math.min(1, (p - i / N) * N * 3)) * 9;
        return r > 0.01 && i < N ? (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill={c.cardBg}
            stroke={c.indigo}
            strokeWidth={4}
          />
        ) : null;
      })}
      <circle cx={tx} cy={ty} r={TIP} fill={c.indigo} />
    </svg>
  );
};
