/**
 * PrincipleCard.tsx — the centred sentence, arriving word by word.
 *
 * No surface behind it: no fill, no border, no shadow. The rect is only the box
 * the words wrap inside. Nothing in this episode puts a panel around type.
 *
 * Each word uses textReveal, so the line assembles rather than appears. This is
 * the one sentence a viewer might write down; it is allowed to take its time,
 * and it is never animated like a UI element.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { textReveal, type Rect } from "../helpers";

export const PrincipleCard = ({
  sentence,
  rect,
  at,
  step = 7,
}: {
  sentence: string;
  rect: Rect;
  at: number;
  /** Frames between one word landing and the next. */
  step?: number;
}) => {
  const f = useCurrentFrame();
  const card = textReveal(f, at, 18, 12);
  const words = sentence.split(" ");

  return (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        opacity: card.opacity,
        transform: `translateY(${card.dy}px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 72px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 14px" }}>
        {words.map((w, i) => {
          const r = textReveal(f, at + 14 + i * step, 14, 14);
          return (
            <span
              key={i}
              style={{
                fontSize: theme.text.title.size,
                fontWeight: theme.text.title.weight,
                color: theme.color.ink,
                opacity: r.opacity,
                transform: `translateY(${r.dy}px)`,
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
