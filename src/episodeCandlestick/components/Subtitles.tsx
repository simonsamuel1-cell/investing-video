/**
 * Subtitles — burned-in subtitle overlay for the whole episode.
 * Renders the active SRT cue in the reserved bottom band: 36px, weight 500,
 * indigo, Plus Jakarta, horizontally centered. Uses the global composition
 * frame (mounted outside any Sequence).
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { SUBTITLES, type SubtitleCue } from "../subtitles";

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
        padding: "0 96px",
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          fontFamily: theme.type.family,
          fontSize: 36,
          fontWeight: 500,
          lineHeight: 1.2,
          color: theme.colors.indigo,
          textAlign: "center",
          maxWidth: theme.layout.activeWidth,
        }}
      >
        {cue.text}
      </span>
    </div>
  );
};
