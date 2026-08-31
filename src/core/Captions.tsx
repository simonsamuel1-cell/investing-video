/**
 * core/Captions.tsx — the burned-in subtitles, inside the reserved bottom band.
 *
 * That band is the one region every scene keeps visually empty, which is what
 * makes burning them in safe.
 *
 * Mount at the composition ROOT, OUTSIDE every Sequence, so the frame it reads
 * is the global one.
 *
 * Pass `show={false}` for a clean plate.
 *
 * CUES ARE GENERATED, NEVER HAND-TYPED — from the corrected SRT, at the
 * Composition's fps. See scripts/srt-to-cues.ts.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { usePalette } from "./palette";

export type Cue = { start: number; end: number; text: string };

export const Captions = ({
  cues,
  show = true,
}: {
  cues: Cue[];
  show?: boolean;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  if (!show) return null;
  const cue = cues.find((q) => f >= q.start && f < q.end);
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
          color: c.indigo,
          textAlign: "center",
        }}
      >
        {cue.text}
      </span>
    </div>
  );
};
