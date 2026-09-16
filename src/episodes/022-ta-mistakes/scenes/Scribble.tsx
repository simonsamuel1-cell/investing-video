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
 * ⚠ HOW FAR THE LOOPS SPREAD AND REACH, as fractions of the box, and they are
 * DIFFERENT for the two axes on purpose.
 *
 * Sideways the scrawl is free to run off the frame — Simon: "scribblenya di
 * luar window aja, jangan di masking" — and a cut at the canvas's own edge is
 * not a cut anybody sees.
 *
 * Downwards and upwards it has to DIE OUT rather than be trimmed, because a
 * straight horizontal edge across a scribble is exactly the masking he has just
 * taken off. So `spreadY + reachY` is kept under half the box: the ink stops
 * because it ran out, not because something stopped it.
 */
const SPREAD_X = 0.25;
const REACH_X = [0.16, 0.34];
const SPREAD_Y = 0.12;
const REACH_Y = [0.2, 0.5];
/**
 * ⚠ THE LOOPS TILT, THEY DO NOT TUMBLE. With a free rotation a loop's WIDEST
 * radius can end up being its vertical one, which blew the scrawl's height out
 * to the point that fitting it to the window shrank the width to two thirds of
 * the box — a ball in the middle of a wide card. Held inside ±35° the ball keeps
 * the box's own proportions, and it is also what the reference looks like: a
 * hand scribbling across something wide works across it, not around it.
 */
const TILT = 0.61;
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

/**
 * The scrawl as one path, and how far the pen travels along it.
 *
 * ⚠ IT IS MEASURED AND FITTED TO THE BOX, not trusted to land in it. Every loop
 * is drawn at a random ROTATION, so a loop's widest radius can end up being its
 * vertical one — reasoning about the extent from the spread and the reach gave
 * me 369px when the real answer was 971, which is how the first version ended
 * up behind the logo. The points are measured and scaled uniformly about their
 * own centre instead.
 *
 * ⚠ AND THE FIT IS WHY THERE IS NO MASK. Simon asked for the scrawl unmasked
 * and then for it to be the window's size — "aku gamau bentrok sama logo dan
 * subtitle" — and those two are the same instruction: a scribble that is ALREADY
 * the size of the thing it covers needs nothing cutting it, so its edges are
 * ragged loops rather than a straight trim, and the two reserved strips are
 * clear because the window clears them.
 */
export const scribbleOf = (box: Rect, seed = 8800) => {
  const rnd = mulberry32(seed);
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  const loops: { x: number; y: number }[][] = [];
  for (let i = 0; i < LOOPS; i++) {
    /** ⚠ THE LOOPS FILL THE BOX, they do not sit in the middle of it. Centres
     *  spread across it and the radii reach past its edges, because a scrawl
     *  that covers a window has to overrun the window. */
    const ox = cx + (rnd() - 0.5) * box.w * SPREAD_X * 2;
    const oy = cy + (rnd() - 0.5) * box.h * SPREAD_Y * 2;
    const rx = box.w * (REACH_X[0] + rnd() * (REACH_X[1] - REACH_X[0]));
    const ry = box.h * (REACH_Y[0] + rnd() * (REACH_Y[1] - REACH_Y[0]));
    const rot = (rnd() - 0.5) * TILT * 2;
    const cos = Math.cos(rot);
    const sin = Math.sin(rot);
    const start = rnd() * Math.PI * 2;
    const phase = WAVES.map(() => rnd() * Math.PI * 2);
    const amp = WAVES.map(() => (0.4 + rnd() * 0.6) * WOBBLE);
    const pts: { x: number; y: number }[] = [];
    for (let k = 0; k <= STEPS; k++) {
      const a = start + (k / STEPS) * Math.PI * 2 * OVER;
      const w = 1 + WAVES.reduce((sum, n, j) => sum + amp[j] * Math.sin(n * a + phase[j]), 0);
      const ex = Math.cos(a) * rx * w;
      const ey = Math.sin(a) * ry * w;
      pts.push({ x: ox + ex * cos - ey * sin, y: oy + ex * sin + ey * cos });
    }
    loops.push(pts);
  }

  const all = loops.flat();
  const bx = [Math.min(...all.map((q) => q.x)), Math.max(...all.map((q) => q.x))];
  const by = [Math.min(...all.map((q) => q.y)), Math.max(...all.map((q) => q.y))];
  /** ⚠ ONE SCALE FOR BOTH AXES. Fitting them separately squashes every loop to
   *  the box's aspect, and a ball of flattened rings reads as a pattern rather
   *  than as a hand. The tighter of the two wins, so the scrawl ends up AT the
   *  box on one axis and a little inside it on the other. */
  const k = Math.min(box.w / (bx[1] - bx[0]), box.h / (by[1] - by[0]));

  /**
   * ⚠ THE PEN NEVER LIFTS — Simon: "trim path aja… jadi animasi 1 garis yang
   * membentuk scribble". Every loop after the first begins with an L, not an M,
   * so the stroke runs from wherever the last loop ended straight into the next
   * one. That is what makes this ONE line: a trim along a path of many subpaths
   * reveals them one at a time with the pen jumping between them, which reads as
   * a shape being assembled rather than as somebody scribbling.
   *
   * ⚠ AND THE CONNECTORS ARE NOT A COMPROMISE. Look at the reference: a real
   * scrawl has long sweeping strokes cutting right across the tangle, and they
   * are exactly this — the hand travelling from one loop to the next without
   * stopping.
   */
  let d = "";
  let len = 0;
  let prev: { x: number; y: number } | null = null;
  for (const pts of loops) {
    pts.forEach((q) => {
      const x = cx + (q.x - (bx[0] + bx[1]) / 2) * k;
      const y = cy + (q.y - (by[0] + by[1]) / 2) * k;
      d += `${prev ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
      if (prev) len += Math.hypot(x - prev.x, y - prev.y);
      prev = { x, y };
    });
  }
  return { d, len };
};

export const Scribble = ({
  box,
  drawn,
  opacity = 1,
}: {
  /** The scrawl is fitted to this — it IS the scrawl's size. */
  box: Rect;
  /** 0→1: how much of the scrawl the pen has laid down. */
  drawn: number;
  opacity?: number;
}) => {
  const c = usePalette();
  const { d, len } = scribbleOf(box);
  if (opacity <= 0.001 || drawn <= 0.001) return null;
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0 }}
      width={theme.canvas.width}
      height={theme.canvas.height}
      opacity={opacity}
    >
      <path
        d={d}
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
