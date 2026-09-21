/**
 * WaveformPair — a clean "signal" wave (indigo) above a jittery "noise" wave
 * (grey), for Scene 14 ("Real, Or Just Noise?"). Deterministic jitter via a
 * seeded PRNG. Both paths mount only once `drawStart` passes.
 */
import { theme } from "../theme";
import { clamp01, mulberry32 } from "../helpers";

const c = theme.colors;

const wavePath = (w: number, midY: number, amp: number, freq: number, jitter: (i: number) => number, n = 120) => {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const px = (w * i) / n;
    const py = midY + Math.sin((i / n) * Math.PI * 2 * freq) * amp + jitter(i);
    d += `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`;
  }
  return d;
};

export const WaveformPair = ({
  x,
  y,
  w,
  frame,
  drawStart,
  drawDur = 26,
}: {
  x: number;
  y: number;
  w: number;
  frame: number;
  drawStart: number;
  drawDur?: number;
}) => {
  const h = 220;
  const prog = clamp01((frame - drawStart) / drawDur);
  const rnd = mulberry32(2027);
  const noiseJ = new Array(121).fill(0).map(() => (rnd() - 0.5) * 34);
  const signal = wavePath(w, 58, 30, 2, () => 0);
  const noise = wavePath(w, 168, 18, 5, (i) => noiseJ[i]);

  return (
    <svg style={{ position: "absolute", left: x, top: y }} width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {frame >= drawStart && (
        <>
          <text x={0} y={16} fontSize={20} fontWeight={700} fill={c.indigo} fontFamily={theme.font.family}>Signal</text>
          <path d={signal} fill="none" stroke={c.indigo} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - prog} />
          <text x={0} y={128} fontSize={20} fontWeight={700} fill={c.grey} fontFamily={theme.font.family}>Noise</text>
          <path d={noise} fill="none" stroke={c.greyLight} strokeWidth={2.5} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - prog} />
        </>
      )}
    </svg>
  );
};
