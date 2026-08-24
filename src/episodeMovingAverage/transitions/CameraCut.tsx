/**
 * CameraCut — a cut that lands in the middle of a move.
 *
 * ONE ease-in-out curve spans the scene boundary, and the content swaps at its
 * exact midpoint, where the camera is travelling fastest. Because the motion
 * never stops across that frame, the swap reads as a continuous camera move
 * rather than a cut — and the blur, which peaks at the same midpoint, is what
 * sells it: the eye cannot resolve detail at that speed anyway.
 *
 * The trick only works if BOTH scenes evaluate the SAME curve from GLOBAL
 * frames. A scene inside a Sequence sees rebased frames, so each one has to add
 * its own `from` back before calling in here.
 */
import { progressInOut } from "../helpers";

export type Cut =
  | {
      /** The GLOBAL frame the cut lands on — the midpoint of the move. */
      at: number;
      /** Frames the whole move takes, half before the cut and half after. */
      over: number;
      /**
       * How far the camera travels, in px. Short: the blur and the timing do
       * the work, and a long throw reads as a slide rather than a cut.
       *
       * 90px is the episode's ceiling for a VERTICAL cut. The panel's lower
       * edge sits at 900 and the subtitle band starts at 972 — a longer throw
       * would push it into a band that must never be entered. A horizontal
       * cut has no such neighbour and can afford more.
       */
      distance: number;
      /** Blur at the fastest frame. */
      blur: number;
      /** Which way the camera travels. "y" rises, "x" tracks left. */
      axis: "x" | "y";
    }
  | {
      /** A PUSH IN toward a fixed point, rather than a slide. */
      at: number;
      over: number;
      /** Blur at the fastest frame. */
      blur: number;
      axis: "zoom";
      /** The point the camera closes on, in canvas px. */
      origin: { x: number; y: number };
      /** How far past 1.0 the scale reaches at the cut itself. */
      amount: number;
    };

/**
 * THE EPISODE'S CUTS — one entry per boundary.
 *
 * Both scenes read the SAME entry — the outgoing one through `cutOut`, the
 * incoming one through `cutIn` — which is the only way a cut can be one move
 * rather than two that happen to meet.
 */
export const CUTS = {
  /**
   * SC01 → CG-A, on the 715 boundary.
   *
   * THE PUSH IS NOT THIS. SC01 closes on its own MOVING AVERAGE card at
   * 610–630 and then HOLDS there — that move belongs to the roadmap and lives
   * in Scene01 (see `T.push`), because the voice names the card at 631 and the
   * camera has to have arrived before it is spoken about, not still be
   * travelling. This entry is only the CUT that follows the hold, 85 frames
   * later: a short further push, landing on 715, that CG-A catches and settles
   * out of. Same origin as SC01's push, so the two are one continuous move
   * toward one point rather than two closes on different things.
   */
  toAverage: {
    at: 715,
    over: 24,
    blur: 9,
    axis: "zoom",
    /* the Moving Average card's own centre — see CARDS[1] in Scene01 */
    origin: { x: 364, y: 721 },
    amount: 0.3,
  },
  /*
   * THERE IS NO CUT AT 1788. SC04 used to be its own scene with its own chart
   * and the camera tracked left into it; Simon folded it into CG-A instead, so
   * SMA and EMA are now drawn on the very candles MA20 and MA200 were drawn
   * on. A cut there would say the chart had changed, and it has not — what
   * changes is only which pair of lines is on it. So the OUTGOING items rise
   * away on their own (see `clearTypes` in ExplainerGroup) and the chart never
   * moves. `toTypes` is gone with the boundary it served.
   */
  /**
   * SC04 → SC05, on the 2323/2324 boundary. What a moving average IS is
   * finished and how to READ one begins — a new instruction, not the next step
   * along the same one — so the camera RISES rather than tracking sideways.
   * It is also where the heading changes, and the cut is what carries it out.
   */
  toReading: { at: 2381, over: 24, distance: 90, blur: 9, axis: "y" },
  /*
   * THERE IS NO CUT AT 3547 EITHER. Same move Simon made at 1788: SC07 used to
   * arrive on a chart of its own — a grey line series with price labels — and
   * the camera rose into it. It now runs on SC05's candles, which simply ZOOM
   * OUT there until the whole tape spans the card. A cut would say the chart
   * had been replaced; zooming out says you are being shown more of the one
   * you have been reading, which is the truth. `toCross` is gone with it.
   */
} as const satisfies Record<string, Cut>;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const curve = (c: Cut) => (global: number) =>
  progressInOut(global, c.at - c.over / 2, c.over);

/** translateY/X for the OUTGOING scene: 0 → −distance, fully out ON the cut. */
export const cutOut = (global: number, c: Extract<Cut, { axis: "x" | "y" }>) =>
  -c.distance * clamp01(curve(c)(global) * 2);

/** translateY/X for the INCOMING scene: +distance on the cut → 0 at rest. */
export const cutIn = (global: number, c: Extract<Cut, { axis: "x" | "y" }>) =>
  c.distance * clamp01(1 - (curve(c)(global) - 0.5) * 2);

/** scale for the OUTGOING scene: 1 → 1+amount, at its widest ON the cut. */
export const zoomOut = (global: number, c: Extract<Cut, { axis: "zoom" }>) =>
  1 + c.amount * clamp01(curve(c)(global) * 2);

/** scale for the INCOMING scene: 1+amount on the cut → 1 as it settles. */
export const zoomIn = (global: number, c: Extract<Cut, { axis: "zoom" }>) =>
  1 + c.amount * clamp01(1 - (curve(c)(global) - 0.5) * 2);

/** Blur from the move's own speed — zero at both ends, maximum on the cut. */
export const cutBlur = (global: number, c: Cut) =>
  Math.sin(Math.PI * curve(c)(global)) * c.blur;

/**
 * The style a scene puts on its root. Both halves of a cut ask for one of
 * these, so neither has to know which axis the cut travels on — get that
 * wrong in one of them and the two halves move at odds with each other.
 */
const filterOf = (blur: number) =>
  blur > 0.05 ? `blur(${blur.toFixed(1)}px)` : undefined;

/** For the scene the cut takes AWAY. Pass the GLOBAL frame. */
export const cutOutStyle = (global: number, c: Cut) => {
  const filter = filterOf(cutBlur(global, c));
  if (c.axis === "zoom") {
    return {
      transform: `scale(${zoomOut(global, c).toFixed(4)})`,
      transformOrigin: `${c.origin.x}px ${c.origin.y}px`,
      filter,
    };
  }
  const d = cutOut(global, c);
  return {
    transform:
      c.axis === "x"
        ? `translateX(${d.toFixed(1)}px)`
        : `translateY(${d.toFixed(1)}px)`,
    filter,
  };
};

/** For the scene the cut BRINGS IN. Pass the GLOBAL frame. */
export const cutInStyle = (global: number, c: Cut) => {
  const filter = filterOf(cutBlur(global, c));
  if (c.axis === "zoom") {
    return {
      transform: `scale(${zoomIn(global, c).toFixed(4)})`,
      transformOrigin: `${c.origin.x}px ${c.origin.y}px`,
      filter,
    };
  }
  const d = cutIn(global, c);
  return {
    transform:
      c.axis === "x"
        ? `translateX(${d.toFixed(1)}px)`
        : `translateY(${d.toFixed(1)}px)`,
    filter,
  };
};
