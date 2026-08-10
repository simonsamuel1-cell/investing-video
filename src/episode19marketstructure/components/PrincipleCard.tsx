/**
 * PrincipleCard — a centred white card whose sentence arrives word by word.
 *
 * Each word uses textReveal: fade plus a short rise. No pop, no bounce. This is
 * the one line in the episode a viewer might write down, so it is allowed to
 * take its time and is never animated like a UI element.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { textReveal } from "../helpers";

export const PrincipleCard = ({
  sentence,
  box,
  startFrame,
  wordStep = 7,
}: {
  sentence: string;
  box: { x: number; y: number; w: number; h: number };
  startFrame: number;
  /** Frames between one word landing and the next. */
  wordStep?: number;
}) => {
  const f = useCurrentFrame();
  const card = textReveal(f, startFrame, 18, 12);
  const words = sentence.split(" ");

  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        borderRadius: theme.radius.cardLg,
        background: theme.colors.cardBg,
        border: `${theme.stroke.hair}px solid ${theme.colors.border}`,
        boxShadow: theme.shadow.rest,
        opacity: card.opacity,
        transform: `translateY(${card.y}px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 72px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 14px" }}>
        {words.map((w, i) => {
          const r = textReveal(f, startFrame + 14 + i * wordStep, 14, 14);
          return (
            <span
              key={i}
              style={{
                fontSize: theme.type.header.size,
                fontWeight: theme.type.header.weight,
                color: theme.colors.ink,
                opacity: r.opacity,
                transform: `translateY(${r.y}px)`,
                display: "inline-block",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};
