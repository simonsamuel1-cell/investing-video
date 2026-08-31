/**
 * core/Watermark.tsx — the brand mark, above everything, for the whole episode.
 *
 * A transparent PNG the full size of the canvas (1920×1080), so the mark is
 * already in position inside the image and needs no placement here. The theme
 * reserves its room through `logoZone`, so scene content never creeps under it.
 *
 * It arrives on the first frames and leaves on the last. A logo that snaps on
 * at frame 0 reads as a flicker; one that rises with the first picture reads as
 * part of the film.
 *
 * A component rather than inline in the Composition purely because its fade
 * needs useCurrentFrame — the Composition stays a single expression with no
 * hooks.
 */
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { useMotion } from "./useMotion";

export const Watermark = ({
  totalFrames,
  src = "watermark.png",
}: {
  /** The Composition's durationInFrames. */
  totalFrames: number;
  src?: string;
}) => {
  const f = useCurrentFrame();
  const m = useMotion();
  /** Same as the between-scene fade, so its arrival does not feel different. */
  const fade = m.fade;
  const op = interpolate(
    f,
    [0, fade, totalFrames - fade, totalFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill style={{ opacity: op, zIndex: 100 }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
};
