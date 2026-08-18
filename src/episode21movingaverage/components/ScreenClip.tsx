/**
 * ScreenClip.tsx — a screen recording placed on the stage.
 *
 * These are portrait phone captures, so a scene sets the HEIGHT and the width
 * follows from the file's own aspect ratio. Nothing is ever stretched.
 *
 * `inset` narrows the mask by that many pixels on the left AND the right, and
 * the video slides under it by the same amount so what remains is centred. The
 * corners are rounded on the mask, not on the video, which is why the crop and
 * the radius cannot disagree.
 *
 * Audio is muted here and nowhere else has to remember to: the episode has ONE
 * voice, mounted once at the root.
 */
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { theme } from "../theme";

export const ScreenClip = ({
  src,
  height,
  aspect,
  inset = 0,
  radius = theme.shape.cardRadius,
  top = theme.margin.top,
}: {
  /** File name inside public/. */
  src: string;
  height: number;
  /** The recording's own width ÷ height. */
  aspect: number;
  /** Pixels trimmed off EACH side. */
  inset?: number;
  radius?: number;
  top?: number;
}) => {
  const width = height * aspect;
  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: top }}
    >
      <div
        style={{
          height,
          width: width - inset * 2,
          overflow: "hidden",
          borderRadius: radius,
        }}
      >
        <OffthreadVideo
          src={staticFile(src)}
          muted
          style={{ height, width, marginLeft: -inset, display: "block" }}
        />
      </div>
    </AbsoluteFill>
  );
};
