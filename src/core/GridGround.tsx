/**
 * core/GridGround.tsx — the drifting grid the transitions are built on.
 *
 * Ported from episodeMovingAverage, where it was tuned and approved, so a
 * transition in one episode looks like a transition in the next. It is a
 * GROUND: something for cards and marks to sit on, never a subject.
 *
 * ⚠ THE LINE IS 2px, AND THAT IS THE WHOLE REASON IT IS VISIBLE. It was 1px at
 * a pale tone for a long time and nobody could see it: a one-pixel rule
 * survives no downscaling at all — it averages into the paper at every preview
 * scale, so it was genuinely absent on screen while a full-resolution crop
 * showed it there. Darkening alone did not fix it; it needed width.
 *
 * ⚠ THE VIGNETTE IS NOT ALWAYS RIGHT. It keeps the grid strongest in the middle
 * and gone at the edges, which suits a frame with several cards spread across
 * it. On a frame with ONE centred card the mask keeps exactly the part the card
 * then covers, and the ground draws nothing anyone can see — pass
 * `vignette={false}` there.
 */
import { theme } from "./theme";
import type { Rect } from "./helpers";

const GRID = {
  cell: 84,
  /**
   * Frames for one full cell of drift.
   *
   * ⚠ 360, NOT 150 — six seconds a cell at 60fps. This is a ground, and a
   * ground that moves fast enough to notice has stopped being one. Slow enough
   * that the eye reads it as texture and only registers the motion if it looks
   * for it.
   */
  loop: 360,
  w: 2,
};

export const GridGround = ({
  f,
  opacity = 1,
  vignette = true,
  tone,
  clip,
}: {
  /** The frame to read the drift from. Scene-local is fine — it only loops. */
  f: number;
  opacity?: number;
  vignette?: boolean;
  /** Overrides the line colour where the default is too quiet for the scene. */
  tone?: string;
  /**
   * The rectangle the ground is allowed to cover.
   *
   * ⚠ THIS IS A SAFE-AREA TOOL, NOT A DECORATION. The grid paints its own
   * PAPER full-bleed, so a scene that stands on it puts white into the 108px
   * subtitle band and the 360×150 logo zone — scripts/audit-frames.mjs fails
   * the frame, correctly: a drifting grid under a burned-in caption is exactly
   * what those reserves exist to prevent. Pass the band the scene may use and
   * the grid stops there, still canvas-aligned so the drift is unchanged.
   */
  clip?: Rect;
}) => {
  if (opacity <= 0) return null;
  const drift = ((f % GRID.loop) / GRID.loop) * GRID.cell;
  /** ⚠ The LINES are 10% lighter; the paper under them is not. Dimming the
   *  whole layer would lift the paper off the episode's own ground. */
  const ink = 0.9;
  const line = tone ?? theme.color.gridLine;
  const body = (
    <>
      <div style={{ position: "absolute", inset: 0, background: theme.color.gridPaper }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: ink,
          backgroundImage:
            `linear-gradient(${line} ${GRID.w}px, transparent ${GRID.w}px),` +
            `linear-gradient(90deg, ${line} ${GRID.w}px, transparent ${GRID.w}px)`,
          backgroundSize: `${GRID.cell}px ${GRID.cell}px`,
          backgroundPosition: `${drift.toFixed(2)}px ${drift.toFixed(2)}px`,
          ...(vignette
            ? {
                maskImage: "radial-gradient(ellipse at 50% 48%, #000 34%, transparent 82%)",
                WebkitMaskImage: "radial-gradient(ellipse at 50% 48%, #000 34%, transparent 82%)",
              }
            : null),
        }}
      />
    </>
  );

  /* ⚠ CLIPPED WITH A WINDOW, NOT WITH A SMALLER GRID. The inner layer is still
     the full canvas and is offset back into place, so the cells line up with
     where they would have been — shrinking the grid instead would move every
     line the moment the clip changed. */
  if (!clip) return <div style={{ position: "absolute", inset: 0, opacity }}>{body}</div>;
  return (
    <div
      style={{
        position: "absolute",
        left: clip.x,
        top: clip.y,
        width: clip.w,
        height: clip.h,
        overflow: "hidden",
        opacity,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -clip.x,
          top: -clip.y,
          width: theme.canvas.width,
          height: theme.canvas.height,
        }}
      >
        {body}
      </div>
    </div>
  );
};
