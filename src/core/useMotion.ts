/**
 * core/useMotion.ts — theme.motion's SECONDS, resolved to frames at the
 * Composition's own fps.
 *
 * This is the seam that makes the library fps-agnostic. A component asks for
 * `m.reveal` and gets 12 at 30fps, 24 at 60fps — the same wall-clock duration
 * either way. Nothing in a component should ever write a frame count itself.
 */
import { useVideoConfig } from "remotion";
import { theme, frames } from "./theme";

export const useMotion = () => {
  const { fps } = useVideoConfig();
  return {
    fps,
    reveal: frames(theme.motion.reveal, fps),
    fade: frames(theme.motion.fade, fps),
    pop: frames(theme.motion.pop, fps),
    move: frames(theme.motion.move, fps),
    /** Any duration in seconds → frames, for scene-local timing. */
    sec: (s: number) => frames(s, fps),
  };
};
