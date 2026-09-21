/**
 * Captions.tsx — the burned-in subtitles, inside the reserved bottom band.
 *
 * That band is the one region every scene keeps visually empty, which is what
 * makes burning them in safe. Mounted at the composition root, OUTSIDE every
 * Sequence, so the frame it reads is the global one.
 *
 * Pass `show={false}` on the composition for a clean plate.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { CUES, type Cue } from "../subtitles";

export const Captions = ({ cues = CUES }: { cues?: Cue[] }) => {
  const f = useCurrentFrame();
  const cue = cues.find((c) => f >= c.start && f < c.end);
  if (!cue) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: theme.captionBand.top,
        width: theme.canvas.width,
        height: theme.captionBand.height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `0 ${theme.margin.left}px`,
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          fontFamily: theme.text.family,
          fontSize: theme.text.body.size,
          fontWeight: 500,
          lineHeight: 1.2,
          color: theme.color.indigo,
          textAlign: "center",
        }}
      >
        {cue.text}
      </span>
    </div>
  );
};
