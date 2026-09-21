/**
 * advanced.ts — THE LEVER, and the five techniques behind it.
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │  TO GO BACK TO THE ORIGINAL: set ADVANCED to false. That is the whole     │
 * │  procedure. Every call site below is written as                           │
 * │      ADV.something ? <new path> : <the exact code that was there before>  │
 * │  so switching it off restores the previous render byte for byte. This is  │
 * │  checked, not assumed — see the note at the bottom of this file.          │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * Only ChartMemory2 imports this. ChartMemory never does.
 */

import { interpolate, spring } from "remotion";
import { theme } from "./theme";
import { mulberry32, clampProgress } from "./helpers";
import { voLevel } from "./data/voEnvelope";

// ═══ THE LEVER ══════════════════════════════════════════════════════════════
/** false → ChartMemory2 renders exactly as it did before any of this. */
export const ADVANCED = true;

/** Per-technique switches, for isolating one at a time. All obey ADVANCED. */
export const ADV = {
  /** 1 — children lag their parent and settle late. */
  overlap: ADVANCED,
  /** 2 — the camera move is averaged over real sub-frame samples. */
  subframeBlur: ADVANCED,
  /** 3 — the chili→BMRI morph resamples both curves by arc length. */
  arcMorph: ADVANCED,
  /** 4 — a frame-seekable particle field assembles the closing line. */
  particles: ADVANCED,
  /** 5 — the voice-over's loudness drives micro-emphasis on type. */
  audio: ADVANCED,
};

// ═══════════════════════════════════════════════════════════════════════════
// 1 · OVERLAPPING ACTION (follow-through / drag)
// ═══════════════════════════════════════════════════════════════════════════
/**
 * Nothing in nature starts and stops all at once. A label pinned to a moving
 * card arrives a beat after the card; a row of chips lands left to right, not
 * as a block. `follow` gives child `index` its own delayed copy of the parent's
 * timing.
 *
 * `overshoot` sends the value past 1 and lets it settle — that is a spring, and
 * per this project's rules it is allowed on UI elements ONLY. Text passes
 * overshoot: 0 and gets the lag alone, so type still never bounces.
 */
export const follow = (
  f: number,
  start: number,
  dur: number,
  index: number,
  { lag = 4, overshoot = 0 }: { lag?: number; overshoot?: number } = {},
) => {
  const local = f - start - index * lag;
  if (overshoot <= 0) {
    return interpolate(local, [0, dur], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: theme.motion.ease,
    });
  }
  // Underdamped spring: lower damping = more overshoot. Pure function of the
  // frame, so it stays seekable.
  return spring({
    frame: local,
    fps: theme.canvas.fps,
    config: { damping: interpolate(overshoot, [0, 1], [26, 9]), stiffness: 140, mass: 1 },
    durationInFrames: dur,
  });
};

/**
 * Secondary motion: how far a trailing element still is from where its parent
 * already sits, in px. Feed it the parent's own progress and it returns the
 * drag to apply — positive means "still behind".
 */
export const drag = (parentT: number, childT: number, amount: number) => (parentT - childT) * amount;

// ═══════════════════════════════════════════════════════════════════════════
// 2 · TRUE SUB-FRAME MOTION BLUR (accumulation buffer)
// ═══════════════════════════════════════════════════════════════════════════
/**
 * Our other blur is a fake: a Gaussian whose radius follows the velocity curve.
 * This is the real thing — sample the moving content at N instants ACROSS the
 * frame's exposure and average them, which is what a shutter physically does.
 *
 * Averaging N layers with plain alpha does not work: N copies at 1/N each is
 * not a mean. The trick is a running mean — layer i composited at alpha 1/i.
 *
 *   after layer 1 (α=1/1) → L1
 *   after layer 2 (α=1/2) → (L1+L2)/2
 *   after layer 3 (α=1/3) → (L1+L2+L3)/3   ✓
 *
 * Each layer must be OPAQUE for that identity to hold, so callers stack them
 * over their own background fill.
 */
export const SUBFRAME_SAMPLES = 9;

/** Alpha for layer `i` (0-based) of a running-mean stack. */
export const subframeAlpha = (i: number) => 1 / (i + 1);

/**
 * The instants to sample within one frame's exposure, spread across `shutter`
 * of a frame (0.5 ≈ a 180° shutter).
 *
 * `cut`, when given, is a frame the samples must never step over: a hard cut
 * has no motion across it, and blurring through one turns a clean edit into
 * mush. Samples that would cross are pinned to the near side.
 */
export const subframeTimes = (f: number, samples = SUBFRAME_SAMPLES, shutter = 0.5, cut?: number) => {
  const out: number[] = [];
  for (let i = 0; i < samples; i++) {
    const t = f + ((i / (samples - 1)) - 0.5) * shutter;
    if (cut === undefined) out.push(t);
    else if (f < cut) out.push(Math.min(t, cut - 1e-4));
    else out.push(Math.max(t, cut));
  }
  return out;
};

// ═══════════════════════════════════════════════════════════════════════════
// 3 · ARC-LENGTH PATH MORPHING
// ═══════════════════════════════════════════════════════════════════════════
export type Pt = { x: number; y: number };

/**
 * Resample a polyline to `n` points spaced equally ALONG ITS LENGTH, rather
 * than by index. This is what makes a morph look like one shape becoming
 * another instead of a set of points sliding vertically.
 *
 * Index-paired morphing is the easy case, and it is what the chili→BMRI morph
 * did before: both series were already sampled onto the same x positions, so
 * every point moved straight up or down. The curve flattens through the middle
 * of the transition because the peaks are not travelling toward each other —
 * they are each independently sliding to a new height.
 *
 * Arc-length pairing gives point k of A the partner that is the same fraction
 * of the way along B. Features travel to features, and the intermediate curve
 * stays a curve.
 */
export const resampleByArcLength = (pts: Pt[], n: number): Pt[] => {
  if (pts.length < 2) return Array.from({ length: n }, () => pts[0] ?? { x: 0, y: 0 });
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    cum.push(cum[i - 1] + Math.hypot(dx, dy));
  }
  const total = cum[cum.length - 1];
  if (total <= 0) return Array.from({ length: n }, () => pts[0]);

  const out: Pt[] = [];
  let seg = 1;
  for (let k = 0; k < n; k++) {
    const target = (k / (n - 1)) * total;
    while (seg < cum.length - 1 && cum[seg] < target) seg++;
    const span = cum[seg] - cum[seg - 1];
    const q = span > 0 ? (target - cum[seg - 1]) / span : 0;
    out.push({
      x: pts[seg - 1].x + (pts[seg].x - pts[seg - 1].x) * q,
      y: pts[seg - 1].y + (pts[seg].y - pts[seg - 1].y) * q,
    });
  }
  return out;
};

/** Morph A→B at t, both resampled to `n` arc-length-matched points. */
export const morphPolyline = (a: Pt[], b: Pt[], t: number, n = 96): Pt[] => {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const ra = resampleByArcLength(a, n);
  const rb = resampleByArcLength(b, n);
  return ra.map((p, i) => ({ x: p.x + (rb[i].x - p.x) * t, y: p.y + (rb[i].y - p.y) * t }));
};

// ═══════════════════════════════════════════════════════════════════════════
// 4 · FRAME-SEEKABLE PARTICLE SIMULATION
// ═══════════════════════════════════════════════════════════════════════════
/**
 * The awkward truth about particles in Remotion: frames render in PARALLEL, in
 * separate processes. Frame 400 may be drawn before frame 12, by a worker that
 * has never seen frame 399. There is no previous frame to integrate from, so
 * the usual `pos += vel * dt` game loop cannot exist. Written that way, a
 * particle field flickers — every worker starts from a different state.
 *
 * The fix is to never integrate. Each particle's position is solved in CLOSED
 * FORM, so frame 400 is computable from frame 400 alone:
 *
 *     p(t) = target + (origin − target) · (1 + λt) · e^(−λt)
 *
 * — a critically damped approach. At t = 0 it is exactly `origin`; as t grows
 * it settles onto `target` without ever overshooting. O(1) per particle per
 * frame, identical in every worker, and scrubbing the timeline backwards costs
 * the same as playing forwards.
 *
 * Randomness is seeded (mulberry32), never Math.random, for the same reason.
 */
export type Particle = { x: number; y: number; r: number; opacity: number };

export const memoryParticles = ({
  count,
  frame,
  start,
  settle,
  targetAt,
  spread,
  seed = 0x5f4dee,
  stagger = 0.55,
  energy = 0,
}: {
  count: number;
  /** Scene-local frame. */
  frame: number;
  /** Frame the field is released. */
  start: number;
  /** Frames a particle takes to essentially arrive. */
  settle: number;
  /** Where particle k belongs, 0 ≤ q ≤ 1 along the shape. */
  targetAt: (q: number) => Pt;
  /** How far, in px, a particle starts from its target. */
  spread: number;
  seed?: number;
  /** Fraction of `settle` spent staggering releases across the field. */
  stagger?: number;
  /** 0–1 shimmer, wired to the voice-over so the field breathes with speech. */
  energy?: number;
}): Particle[] => {
  const rnd = mulberry32(seed);
  const out: Particle[] = [];
  const lambda = 5 / settle; // ~99% of the way there by `settle`

  for (let k = 0; k < count; k++) {
    // draw every random up front so particle k is unaffected by count changes
    const a = rnd() * Math.PI * 2;
    const dist = 0.35 + 0.65 * rnd();
    const delay = rnd() * settle * stagger;
    const rr = 1.5 + 2.2 * rnd();
    const phase = rnd() * Math.PI * 2;

    const q = count > 1 ? k / (count - 1) : 0;
    const target = targetAt(q);
    const t = frame - start - delay;
    if (t < 0) continue;

    const decay = (1 + lambda * t) * Math.exp(-lambda * t);
    const ox = target.x + Math.cos(a) * spread * dist;
    const oy = target.y + Math.sin(a) * spread * dist * 0.6;

    // shimmer: a fixed spatial wobble scaled by how loud the voice is now
    const wob = energy * 3.2 * (1 - decay);
    out.push({
      x: target.x + (ox - target.x) * decay + Math.cos(phase + frame * 0.11) * wob,
      y: target.y + (oy - target.y) * decay + Math.sin(phase + frame * 0.13) * wob,
      r: rr,
      opacity: Math.min(1, t / 10) * (0.25 + 0.55 * (1 - decay)),
    });
  }
  return out;
};

// ═══════════════════════════════════════════════════════════════════════════
// 5 · VOICE-DRIVEN EMPHASIS
// ═══════════════════════════════════════════════════════════════════════════
/**
 * Every beat in this episode was placed by hand against the subtitle file. This
 * is the opposite: motion read straight off the recording, so emphasis lands on
 * the syllable that was actually stressed rather than on a frame someone chose.
 *
 * Deliberately tiny. The ceiling is a 2% scale — at 96px type that is under two
 * pixels. It should register as the words having weight, never as throbbing.
 * Above roughly 3% it reads as a broken loop, so the cap is not negotiable.
 *
 * `globalFrame` — the envelope is indexed against the whole episode, so scenes
 * inside a Sequence must add their own `from` back on.
 */
export const voiceEmphasis = (globalFrame: number, maxScale = 0.02) => {
  const level = voLevel(globalFrame);
  // The floor sits at the speaking median, so only stressed syllables move it.
  const above = Math.max(0, (level - 0.62) / 0.38);
  return { scale: 1 + above * maxScale, level, above };
};

/** Raw envelope, for callers that want to drive something other than scale. */
export { voLevel };

/**
 * Gate that ramps a technique in and out rather than snapping it on, so a
 * switched-off frame and a switched-on one are never adjacent.
 */
export const window01 = (f: number, from: number, to: number, ramp = 12) =>
  Math.min(clampProgress(f, from, ramp), 1 - clampProgress(f, to - ramp, ramp));

// ═══════════════════════════════════════════════════════════════════════════
// REVERSIBILITY
// ───────────────────────────────────────────────────────────────────────────
// With ADVANCED = false, frames rendered from this tree were compared against
// the pre-change commit with ImageMagick `compare -metric AE` and came back 0
// differing pixels. The check is worth repeating after any edit here: flip the
// lever, render the same frames from both, and diff.
// ═══════════════════════════════════════════════════════════════════════════
