/**
 * ChapterCard — the "0N · Title" typographic header for the three Steps.
 * Big index number in indigo, title in ink-black. Used by Step frames + Scenes
 * 9 / 14 / 19. Drives its own textReveal from a passed `frame` + `start`.
 */
import { theme } from "../theme";
import { textReveal } from "../helpers";

export const ChapterCard = ({
  index,
  title,
  frame,
  start = 0,
  x = 96,
  y = 96,
}: {
  index: string; // "01"
  title: string; // "Screening"
  frame: number;
  start?: number;
  x?: number;
  y?: number;
}) => {
  const a = textReveal(frame, start, 18);
  const b = textReveal(frame, start + 6, 18);
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "baseline", gap: 10 }}>
      <span style={{ fontSize: 40, fontWeight: theme.font.weights.extrabold, color: theme.colors.indigo, letterSpacing: -0.5, ...a }}>
        {index}
      </span>
      <span style={{ fontSize: 40, fontWeight: theme.font.weights.extrabold, color: theme.colors.text, letterSpacing: -0.5, ...b }}>
        {title}
      </span>
    </div>
  );
};
