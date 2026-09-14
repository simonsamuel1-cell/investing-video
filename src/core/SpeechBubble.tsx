/**
 * core/SpeechBubble.tsx — a rounded panel with a tail, for a word the SCREEN
 * says rather than a word the video says.
 *
 * ⚠ THE SHAPE IS SIMON'S, traced off the reference he supplied: a rounded
 * rectangle whose tail leaves the BOTTOM-LEFT of the box, sweeps down and to
 * the left, and comes to a point. The tail is not a triangle — a triangular
 * tail reads as a tooltip, and this one reads as speech.
 *
 * ⚠ THE TAIL IS A PROPORTION OF THE BOX, never a typed size. Written in px it
 * would be a different shape at every size the bubble is used at, which is how
 * a component ends up with a `small` variant that is really just the same
 * drawing done again.
 *
 * ⚠ IT POINTS DOWN-LEFT, so the bubble belongs ABOVE AND RIGHT of whatever it
 * is speaking about. There is no mirrored version yet; add one when a scene
 * needs it rather than rotating this one, which would swing the corner radii
 * with it.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { usePalette } from "./palette";
import { useMotion } from "./useMotion";
import { popIn } from "./helpers";

/** The tail, as fractions of the box's width and height. */
const TAIL = {
  /** Where it leaves the bottom edge, and where it comes back to it. */
  right: 0.3,
  left: 0.19,
  /** The tip, below the box. */
  tipX: 0.112,
  drop: 0.25,
} as const;

/**
 * The tip, as fractions of the BOX's width and height — the box being what `x`,
 * `y`, `w` and `h` describe, with the tail hanging below it.
 *
 * ⚠ EXPORTED BECAUSE PLACING A BUBBLE MEANS PLACING ITS TIP. The tip is the
 * only part of the shape that means anything; a scene that wants it on a
 * particular bar has to solve the box backwards from it, and a scene that
 * copies these numbers by hand will be wrong the day the tail is redrawn.
 */
export const BUBBLE_TIP = { x: TAIL.tipX, y: 1 + TAIL.drop } as const;

export const bubblePath = (w: number, h: number, r: number) => {
  const tipY = h + h * TAIL.drop;
  return [
    `M ${r} 0`,
    `H ${w - r}`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    `V ${h - r}`,
    `A ${r} ${r} 0 0 1 ${w - r} ${h}`,
    `H ${w * TAIL.right}`,
    /* the long sweep out to the point */
    `C ${w * 0.29} ${h + h * 0.13} ${w * 0.24} ${h + h * 0.21} ${w * TAIL.tipX} ${tipY}`,
    /* and the short one back up to the edge */
    `C ${w * 0.17} ${h + h * 0.16} ${w * 0.185} ${h + h * 0.07} ${w * TAIL.left} ${h}`,
    `H ${r}`,
    `A ${r} ${r} 0 0 1 0 ${h - r}`,
    `V ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    "Z",
  ].join(" ");
};

export const SpeechBubble = ({
  label,
  x,
  y,
  w,
  h,
  at,
  tone = "indigo",
  radius = theme.shape.panelRadius,
  opacity = 1,
}: {
  label: string;
  /** Top-left of the BOX. The tail hangs below it. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Frame it arrives on. Scene-local. */
  at: number;
  /** `indigo` is a filled bubble in white type; `paper` is the card's own
   *  surface with the episode's ink, for a bubble on a coloured ground. */
  tone?: "indigo" | "paper";
  radius?: number;
  /**
   * ⚠ FOR LEAVING, NOT FOR ARRIVING. A bubble arrives by growing out of its own
   * tip — that is `at` and it is not optional. This is the other end: a bubble
   * that has finished speaking fades, because popping it back into the tip it
   * came from would read as the trade being un-taken.
   */
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  if (f < at || opacity <= 0.001) return null;

  const pop = popIn(f, at, m.pop);
  const fill = tone === "indigo" ? c.indigo : c.cardBg;
  const ink = tone === "indigo" ? theme.color.onIndigo : c.ink;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: pop.opacity * opacity,
        /** ⚠ THE ORIGIN IS THE TIP, so the bubble grows OUT of the thing it is
         *  pointing at rather than swelling around its own middle. */
        transform: `scale(${pop.scale.toFixed(4)})`,
        transformOrigin: `${(w * TAIL.tipX).toFixed(1)}px ${(h * (1 + TAIL.drop)).toFixed(1)}px`,
      }}
    >
      <svg
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
        width={w}
        height={h * (1 + TAIL.drop)}
      >
        <path d={bubblePath(w, h, radius)} fill={fill} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: w,
          height: h,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: theme.text.family,
          fontSize: theme.text.chip.size,
          fontWeight: theme.text.chip.weight,
          color: ink,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};
