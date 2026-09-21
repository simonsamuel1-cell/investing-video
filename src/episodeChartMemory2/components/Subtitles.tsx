/**
 * Subtitles — burned-in subtitle overlay for the whole episode. Renders the
 * active cue inside the reserved bottom 108px band (the one region every scene
 * keeps visually empty). Uses the global composition frame, so it is mounted
 * outside any Sequence.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { SUBTITLES, type SubtitleCue } from "../subtitles";

/** `cues` lets a second composition burn in a different track. */
export const Subtitles = ({ cues = SUBTITLES }: { cues?: SubtitleCue[] }) => {
  const f = useCurrentFrame();
  const cue = cues.find((c) => f >= c.start && f < c.end);
  if (!cue) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        width: theme.canvas.width,
        height: theme.layout.safeBottom,
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
          fontSize: theme.type.label.size,
          fontWeight: 500,
          lineHeight: 1.2,
          color: theme.colors.indigo,
          textAlign: "center",
          maxWidth: theme.layout.activeW,
        }}
      >
        {cue.text}
      </span>
    </div>
  );
};
