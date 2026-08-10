/**
 * data/shape.ts — how every price shape in this episode is described and drawn.
 *
 * A shape is written as the LEGS the price walked: a starting level, then a
 * list of "and then it went to X". That is exactly how the script describes
 * price ("naik ke 5.000, turun ke 4.600, lalu naik ke 5.400"), so the code and
 * the narration are the same sentence.
 *
 * Two properties fall out of describing it this way, and the whole episode
 * leans on them:
 *
 *   1. A TURNING POINT IS NOT AUTHORED. It is the junction between two legs,
 *      and whether it is a peak or a trough is decided by the direction of the
 *      legs either side of it. No scene can mislabel a peak as a trough,
 *      because no scene gets to say which it is.
 *
 *   2. THE WIGGLE CANNOT INVENT A TURN. Jitter is multiplied by sin(pi·u)
 *      inside each leg, which is exactly zero at both ends. A peak is therefore
 *      always the highest point of its own neighbourhood, and the structure the
 *      narration describes is the structure on screen.
 *
 * These are ILLUSTRATIVE shapes. No ticker is attached to any of them. The one
 * real instrument in the episode is ASII in SC18, in data/asii.ts.
 */
import { seeded, type Rect } from "../helpers";

export type Leg = {
  /** The level this leg walks to. */
  to: number;
  /** Relative time this leg takes. Defaults to 1; use it to stretch a phase. */
  weight?: number;
};

export type Shape = {
  from: number;
  legs: Leg[];
  /** Wiggle as a fraction of the shape's full range. 0 draws the bare skeleton. */
  jitter?: number;
  seed?: number;
  /** Samples along the whole shape. More = smoother, slower.  */
  steps?: number;
};

export type TurnKind = "peak" | "trough" | "start" | "end";
export type Turn = { t: number; p: number; kind: TurnKind };
export type Curve = {
  samples: { t: number; p: number }[];
  turns: Turn[];
  lo: number;
  hi: number;
};

const smootherstep = (u: number) => u * u * u * (u * (u * 6 - 15) + 10);

/** Smooth value noise: random nodes, smootherstep between them. Deterministic. */
const noise = (seed: number, nodes: number) => {
  const rnd = seeded(seed);
  const v = Array.from({ length: nodes + 1 }, () => rnd() * 2 - 1);
  return (u: number) => {
    const q = Math.max(0, Math.min(1, u)) * nodes;
    const i = Math.min(nodes - 1, Math.floor(q));
    return v[i] + (v[i + 1] - v[i]) * smootherstep(q - i);
  };
};

export const curve = ({ from, legs, jitter = 0.02, seed = 7, steps = 340 }: Shape): Curve => {
  const total = legs.reduce((a, l) => a + (l.weight ?? 1), 0);

  // where each leg starts and ends in t, and the level it walks from and to
  let acc = 0;
  let level = from;
  const spans = legs.map((l) => {
    const t0 = acc / total;
    acc += l.weight ?? 1;
    const seg = { t0, t1: acc / total, from: level, to: l.to };
    level = l.to;
    return seg;
  });

  const levels = [from, ...legs.map((l) => l.to)];
  const range = Math.max(1, Math.max(...levels) - Math.min(...levels));
  const wobble = noise(seed, Math.max(6, Math.round(steps / 12)));

  const samples: { t: number; p: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const s = spans.find((sp) => t <= sp.t1) ?? spans[spans.length - 1];
    const u = Math.max(0, Math.min(1, (t - s.t0) / Math.max(1e-6, s.t1 - s.t0)));
    const base = s.from + (s.to - s.from) * smootherstep(u);
    // windowed to zero at both ends of the leg — a turn stays the true extreme
    samples.push({ t, p: base + wobble(t) * range * jitter * Math.sin(Math.PI * u) });
  }

  // A junction is a peak when the leg before it rose and the leg after it fell.
  const turns: Turn[] = [{ t: 0, p: from, kind: "start" }];
  for (let i = 0; i < spans.length; i++) {
    const rose = spans[i].to > spans[i].from;
    const next = spans[i + 1];
    if (!next) {
      turns.push({ t: 1, p: spans[i].to, kind: "end" });
      break;
    }
    const fallsNext = next.to < next.from;
    turns.push({ t: spans[i].t1, p: spans[i].to, kind: rose && fallsNext ? "peak" : !rose && !fallsNext ? "trough" : rose ? "peak" : "trough" });
  }

  const ps = samples.map((s) => s.p);
  return { samples, turns, lo: Math.min(...ps), hi: Math.max(...ps) };
};

/** Indices of every peak (or trough) in draw order. */
export const peaksOf = (c: Curve) => c.turns.map((t, i) => (t.kind === "peak" ? i : -1)).filter((i) => i >= 0);
export const troughsOf = (c: Curve) => c.turns.map((t, i) => (t.kind === "trough" ? i : -1)).filter((i) => i >= 0);

// ── placing a curve on the canvas ───────────────────────────────────────────

export type Plot = {
  x: (t: number) => number;
  y: (p: number) => number;
  /** Screen position of turn `i`, and what kind of turn it is. */
  turn: (i: number) => { x: number; y: number; kind: TurnKind; p: number; t: number };
  points: { x: number; y: number }[];
  d: string;
  length: number;
  /** Point at draw progress `u`, measured ALONG the line. */
  along: (u: number) => { x: number; y: number };
  /** Draw progress at which the trim path passes `t`. */
  reaches: (t: number) => number;
};

/**
 * Place a curve in a rect.
 *
 * `range` pins the price scale explicitly. That is what lets two scenes share
 * one chart across a boundary — pass the same range and the axis cannot shift
 * underneath the narration.
 */
export const plot = (c: Curve, box: Rect, { pad = 0.12, range }: { pad?: number; range?: [number, number] } = {}): Plot => {
  const lo = range ? range[0] : c.lo;
  const hi = range ? range[1] : c.hi;
  const span = Math.max(1, hi - lo);
  const x = (t: number) => box.x + box.w * Math.max(0, Math.min(1, t));
  const y = (p: number) => box.y + box.h * (1 - pad) - ((p - lo) / span) * box.h * (1 - pad * 2);

  const points = c.samples.map((s) => ({ x: x(s.t), y: y(s.p) }));
  const cum = [0];
  for (let i = 1; i < points.length; i++) cum.push(cum[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
  const length = cum[cum.length - 1];

  const lerpAt = (q: number) => {
    const i = Math.min(points.length - 2, Math.floor(q));
    const u = q - i;
    return { x: points[i].x + (points[i + 1].x - points[i].x) * u, y: points[i].y + (points[i + 1].y - points[i].y) * u };
  };

  return {
    x,
    y,
    points,
    length,
    d: points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" "),
    turn: (i) => {
      const t = c.turns[i];
      return { x: x(t.t), y: y(t.p), kind: t.kind, p: t.p, t: t.t };
    },
    /**
     * Measured by ARC LENGTH, not by t. A trim path advances along the line, so
     * on a steep leg the parameter and the drawn end diverge — a head dot placed
     * by t floats off the end of its own line.
     */
    along: (u) => {
      if (length <= 0) return points[0];
      const target = Math.max(0, Math.min(1, u)) * length;
      let i = 1;
      while (i < cum.length - 1 && cum[i] < target) i++;
      const seg = cum[i] - cum[i - 1];
      return lerpAt(i - 1 + (seg > 0 ? (target - cum[i - 1]) / seg : 0));
    },
    reaches: (t) => {
      if (length <= 0) return 0;
      const q = Math.max(0, Math.min(1, t)) * (points.length - 1);
      const i = Math.min(points.length - 2, Math.floor(q));
      return (cum[i] + (cum[i + 1] - cum[i]) * (q - i)) / length;
    },
  };
};

// ── candles ─────────────────────────────────────────────────────────────────

/** `date` is carried only by the real series; drawn shapes leave it off. */
export type Bar = { o: number; h: number; l: number; c: number; date?: string };

/**
 * Candles whose CLOSES ride the curve exactly.
 *
 * SC03 dissolves the SC01 candles into a line; because both come from one
 * curve, that dissolve is a fact about a single series rather than two drawings
 * that were made to look alike.
 */
export const candles = (c: Curve, count: number, seed = 5): Bar[] => {
  const rnd = seeded(seed);
  const range = c.hi - c.lo;
  const at = (i: number) => c.samples[Math.round((i / count) * (c.samples.length - 1))].p;
  const out: Bar[] = [];
  for (let i = 0; i < count; i++) {
    const close = at(i + 1);
    const open = i === 0 ? at(0) : out[i - 1].c;
    const wick = range * (0.008 + rnd() * 0.018);
    out.push({ o: open, c: close, h: Math.max(open, close) + wick, l: Math.min(open, close) - wick });
  }
  return out;
};

/** Cut a `t` window out of a curve and re-normalise it to 0→1. */
export const window = (c: Curve, [a, b]: [number, number]): Curve => {
  const samples = c.samples.filter((s) => s.t >= a && s.t <= b).map((s) => ({ t: (s.t - a) / (b - a), p: s.p }));
  const turns = c.turns.filter((t) => t.t >= a && t.t <= b).map((t) => ({ ...t, t: (t.t - a) / (b - a) }));
  const ps = samples.map((s) => s.p);
  return { samples, turns, lo: Math.min(...ps), hi: Math.max(...ps) };
};
