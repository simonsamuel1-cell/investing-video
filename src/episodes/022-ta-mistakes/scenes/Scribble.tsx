/**
 * scenes/Scribble.tsx — the black scrawl that goes over the whole window.
 *
 * ⚠ IT IS THE SCENE'S ANSWER, NOT A DECORATION. Seven readings have been piled
 * onto one tape and the voice has just said that more of them is not more
 * insight; the picture is then scribbled out. A neat cross or a red X would be
 * a verdict delivered by the video — this is somebody giving up on their own
 * chart, which is the thing being described.
 *
 * ⚠ SEEDED, LIKE EVERY OTHER RANDOM THING IN THIS PROJECT. A scrawl has to look
 * unplanned and be identical on every render; `mulberry32` is the only source of
 * randomness allowed, so the same frame always comes out the same scrawl.
 *
 * ⚠ AND IT IS DRAWN, NOT FADED IN. A scribble that appears is a graphic; one
 * that is laid down across sixty frames is a hand. The whole scrawl is ONE path
 * of many subpaths, so one dash offset walks the pen through all of them in
 * order — the moves between loops are not drawn, so the gaps cost nothing.
 */
import { theme, usePalette } from "../../../core";

/** The window it covers, in canvas pixels — 019's own panel box. */
export type Rect = { x: number; y: number; w: number; h: number };

/**
 * ⚠ ELLIPSES, NOT ZIGZAGS. Simon's reference is a ball of overlapping loops
 * drawn at every angle, which is what a pen does when a hand is being emphatic.
 * A lightning-bolt scribble reads as a strike-through — a different gesture, and
 * one that says "wrong" rather than "give up".
 */
const LOOPS = 34;
/**
 * ⚠ THE WANDER IS LOW-FREQUENCY, and that is the whole difference between a pen
 * and a wire frame. My first attempt jittered every sampled point independently,
 * which is noise: it put a corner every few pixels and the scrawl came out
 * angular and mechanical. A hand wobbles over a whole quarter of a loop, so the
 * radius is modulated by three slow waves with random phase instead.
 */
const WAVES = [2, 3, 5];
const WOBBLE = 0.07;
/** Samples per loop. High enough that each segment is a couple of pixels and the
 *  polyline reads as a curve — cheaper and steadier than fitting beziers. */
const STEPS = 150;
/** ⚠ LOOPS OVERSHOOT RATHER THAN CLOSE. A pen does not stop exactly where it
 *  started, and a ring that does reads as a drawn shape. */
const OVER = 1.08;

const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** The scrawl as one path, and how far the pen travels along it. */
export const scribbleOf = (box: Rect, seed = 8800) => {
  const rnd = mulberry32(seed);
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  let d = "";
  let len = 0;
  for (let i = 0; i < LOOPS; i++) {
    /** ⚠ THE LOOPS FILL THE BOX, they do not sit in the middle of it. Centres
     *  spread across it and the radii reach past its edges, because a scrawl
     *  that covers a window has to overrun the window. */
    const ox = cx + (rnd() - 0.5) * box.w * 0.46;
    const oy = cy + (rnd() - 0.5) * box.h * 0.46;
    const rx = box.w * (0.13 + rnd() * 0.24);
    const ry = box.h * (0.18 + rnd() * 0.3);
    const rot = rnd() * Math.PI;
    const cos = Math.cos(rot);
    const sin = Math.sin(rot);
    const start = rnd() * Math.PI * 2;
    const phase = WAVES.map(() => rnd() * Math.PI * 2);
    const amp = WAVES.map(() => (0.4 + rnd() * 0.6) * WOBBLE);
    let prev: { x: number; y: number } | null = null;
    for (let k = 0; k <= STEPS; k++) {
      const a = start + (k / STEPS) * Math.PI * 2 * OVER;
      const w = 1 + WAVES.reduce((sum, n, j) => sum + amp[j] * Math.sin(n * a + phase[j]), 0);
      const ex = Math.cos(a) * rx * w;
      const ey = Math.sin(a) * ry * w;
      const x = ox + ex * cos - ey * sin;
      const y = oy + ex * sin + ey * cos;
      d += `${k === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      if (prev) len += Math.hypot(x - prev.x, y - prev.y);
      prev = { x, y };
    }
  }
  return { d, len };
};

export const Scribble = ({
  box,
  drawn,
  opacity = 1,
}: {
  box: Rect;
  /** 0→1: how much of the scrawl the pen has laid down. */
  drawn: number;
  opacity?: number;
}) => {
  const c = usePalette();
  const { d, len } = scribbleOf(box);
  if (opacity <= 0.001 || drawn <= 0.001) return null;
  const id = `scrib-${box.x}-${box.y}`;
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0 }}
      width={theme.canvas.width}
      height={theme.canvas.height}
      opacity={opacity}
    >
      {/* ⚠ CLIPPED TO THE WINDOW, and to its own corners. The loops overrun the
          box on purpose; without the clip the scrawl would spill onto the
          episode's ground and stop being something done TO the chart. */}
      <defs>
        <clipPath id={id}>
          <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={24} />
        </clipPath>
      </defs>
      <path
        d={d}
        clipPath={`url(#${id})`}
        fill="none"
        /** ⚠ THE PALETTE'S INK, NOT A TYPED BLACK. Simon asked for black and on
         *  this episode's `terang` palette that is exactly what `ink` is —
         *  #000000 — but a scrawl over a window has to be whatever the window
         *  is NOT, and only the palette knows that. */
        stroke={c.ink}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - Math.max(0, Math.min(1, drawn)))}
      />
    </svg>
  );
};
