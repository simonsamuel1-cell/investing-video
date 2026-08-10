/**
 * Header — the scene title and an optional sub-line.
 *
 * Left-aligned at the safe margin and parked in the top band. Every title in
 * this episode is short enough that it ends well before x 1368, so it can never
 * crowd the logo zone.
 *
 * Type enters with textReveal and nothing else — no pop, no bounce.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { textReveal } from "../helpers";

export const Header = ({
  title,
  sub,
  startFrame = 0,
  subFrame,
  x = theme.frame.headerX,
  y = theme.frame.headerY,
  opacity = 1,
}: {
  title: string;
  sub?: string;
  startFrame?: number;
  subFrame?: number;
  x?: number;
  y?: number;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const a = textReveal(f, startFrame);
  const b = textReveal(f, subFrame ?? startFrame + 10);

  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(0, -50%)", opacity }}>
      <div
        style={{
          fontSize: theme.type.header.size,
          fontWeight: theme.type.header.weight,
          color: theme.colors.ink,
          opacity: a.opacity,
          transform: `translateY(${a.y}px)`,
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </div>
      {sub && (
        <div
          style={{
            marginTop: 8,
            fontSize: theme.type.label.size,
            fontWeight: 500,
            color: theme.colors.slate,
            opacity: b.opacity,
            transform: `translateY(${b.y}px)`,
            whiteSpace: "nowrap",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};

/** A sentence-case line of body copy, revealed as one block. */
export const Statement = ({
  text,
  x,
  y,
  startFrame,
  anchor = "center",
  size = theme.type.label.size,
  color = theme.colors.ink,
}: {
  text: string;
  x: number;
  y: number;
  startFrame: number;
  anchor?: "center" | "left" | "right";
  size?: number;
  color?: string;
}) => {
  const f = useCurrentFrame();
  const r = textReveal(f, startFrame);
  const translate = anchor === "center" ? "translate(-50%," : anchor === "right" ? "translate(-100%," : "translate(0,";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `${translate} calc(-50% + ${r.y}px))`,
        opacity: r.opacity,
        fontFamily: theme.type.family,
        fontSize: size,
        fontWeight: theme.type.label.weight,
        color,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};
