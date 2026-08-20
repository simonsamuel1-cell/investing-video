/**
 * Captions.tsx — the burned-in subtitles, inside the reserved bottom band.
 *
 * That band is the one region every scene keeps visually empty, which is what
 * makes burning them in safe. Mounted at the composition root, OUTSIDE every
 * Sequence, so the frame it reads is the global one.
 */
import { useCurrentFrame } from "remotion";
import { theme, CAPTION_BAND } from "../theme";
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
        top: CAPTION_BAND.top,
        width: theme.layout.width,
        height: CAPTION_BAND.height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `0 ${theme.layout.safeLeft}px`,
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          fontFamily: theme.type.family,
          fontSize: theme.type.labelSm.size,
          fontWeight: theme.type.labelSm.weight,
          lineHeight: 1.2,
          color: theme.colors.indigo,
          textAlign: "center",
        }}
      >
        {cue.text}
      </span>
    </div>
  );
};
