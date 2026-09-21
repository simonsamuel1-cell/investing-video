/**
 * staircaseView — ONE staircase, seen at two zoom levels.
 *
 * SC04 and SC05 do not draw two shapes. They draw the SAME shape: SC05 shows
 * the whole climb, and SC04 is that climb cropped to its first step and blown
 * up to fill the card. The transition between them is therefore a camera move
 * and nothing else — no morph, no redraw, no shape that has to be matched by
 * eye. Frame 1964 and frame 1965 are the same drawing at two different scales,
 * and the scale is the only thing that animates.
 *
 * This module owns the box, the plot and the crop so neither scene can drift.
 *
 * The zoom is UNIFORM. A chart cropped and re-fitted would normally stretch x
 * and y by different amounts, and that is what a real charting app does — but
 * on screen it reads as the shape deforming rather than the camera moving, and
 * the camera move is the whole point here.
 */
import { plot } from "./shape";
import { STAIRCASE } from "./shapes";
import { theme } from "../theme";

export type Pt = { x: number; y: number };

export const STAIR_BOX = { x: theme.stage.plot.x, y: theme.stage.plot.y + 30, w: theme.stage.plot.w, h: theme.stage.plot.h - 100 };
export const STAIR = plot(STAIRCASE, STAIR_BOX, { pad: 0.12 });

/**
 * One step: start → peak → pullback → higher peak. Turn 3 closes it, and that
 * is exactly the sentence SC04 spends its whole scene on.
 */
export const STEP_TURN = 3;
export const STEP_END = STAIR.reaches(STAIR.turn(STEP_TURN).t);

const stepPts = STAIR.points.filter((p) => p.x <= STAIR.turn(STEP_TURN).x);
const stepX0 = stepPts[0].x;
const stepTop = Math.min(...stepPts.map((p) => p.y));
const stepBottom = Math.max(...stepPts.map((p) => p.y));
/**
 * Chosen from HEIGHT, not width: enough to make one step fill the plot band
 * top to bottom, which is how any other chart in the episode is framed.
 *
 * Filling the WIDTH instead would need 2.35×, and at that scale the higher
 * high lands 50px from the top of the card with no room for its own label. The
 * cost of 1.97× is that the crop runs a little past the step before it reaches
 * the card's edge — which is what a crop does, and reads as "there is more".
 */
const K = STAIR_BOX.h / (stepBottom - stepTop);

/** Any point of the staircase, as SC04 frames it. */
export const zoomIn = (p: Pt): Pt => ({ x: STAIR_BOX.x + (p.x - stepX0) * K, y: STAIR_BOX.y + (p.y - stepTop) * K });

/** 0 = SC04's framing, 1 = SC05's. Affine in between, so it reads as a dolly. */
export const zoomed = (p: Pt, a: number): Pt => {
  if (a >= 0.9999) return p;
  const z = zoomIn(p);
  return { x: z.x + (p.x - z.x) * a, y: z.y + (p.y - z.y) * a };
};

/** The card's right edge — where the crop runs out of white surface. */
export const CLIP_X = theme.stage.card.x + theme.stage.card.w;

/**
 * Truncates at an exact x, INTERPOLATING the final point rather than dropping
 * the segment that crosses it. Without that, SC04's line would stop up to a
 * sample short of where SC05's clip cuts, and the two frames would not match.
 */
export const clipRight = (pts: Pt[], xMax: number): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    if (pts[i].x <= xMax) {
      out.push(pts[i]);
      continue;
    }
    if (i > 0) {
      const a = pts[i - 1];
      const b = pts[i];
      out.push({ x: xMax, y: a.y + ((b.y - a.y) * (xMax - a.x)) / (b.x - a.x) });
    }
    break;
  }
  return out;
};

/** Arc-length measurements, for a trim path over an arbitrary polyline. */
export const measure = (pts: Pt[]) => {
  const run = [0];
  for (let i = 1; i < pts.length; i++) run.push(run[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const length = run[run.length - 1];
  return {
    length,
    /** How far along the line a given x sits — for keying a trim to a turn. */
    fractionAtX: (x: number) => {
      let i = 0;
      while (i < pts.length - 1 && pts[i].x < x) i++;
      return length === 0 ? 0 : run[i] / length;
    },
    /** The point a given fraction of the way ALONG the line, not through it. */
    at: (u: number): Pt => {
      const target = Math.max(0, Math.min(1, u)) * length;
      let i = 1;
      while (i < run.length - 1 && run[i] < target) i++;
      const span = run[i] - run[i - 1] || 1;
      const t = (target - run[i - 1]) / span;
      return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t };
    },
  };
};

export const pathOf = (pts: Pt[]) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
