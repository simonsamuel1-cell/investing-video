/**
 * Text.tsx — every word on screen enters through here.
 *
 * There is exactly one entrance for type in this episode: fade and rise. No
 * pop, no bounce, no rotation, no overlap. Pop is reserved for UI elements —
 * chips, dots, markers, countdown numerals — which live in their own files.
 *
 * `Title` is centred in the title strip. Centred rather than flush left because
 * a centred title of any length stays symmetric about the canvas and therefore
 * cannot drift toward the logo zone as the wording changes.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { textReveal } from "../helpers";

export const Title = ({
  text,
  sub,
  at = 0,
  subAt,
  x = theme.stage.title.x,
  y = theme.stage.title.y,
  opacity = 1,
}: {
  text: string;
  sub?: string;
  at?: number;
  subAt?: number;
  x?: number;
  y?: number;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const head = textReveal(f, at);
  const tail = textReveal(f, subAt ?? at + 10);

  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", textAlign: "center", opacity }}>
      <div
        style={{
          fontSize: theme.text.title.size,
          fontWeight: theme.text.title.weight,
          color: theme.color.ink,
          opacity: head.opacity,
          transform: `translateY(${head.dy}px)`,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
      {sub && (
        <div
          style={{
            marginTop: 10,
            fontSize: theme.text.body.size,
            fontWeight: theme.text.body.weight,
            color: theme.color.slate,
            opacity: tail.opacity,
            transform: `translateY(${tail.dy}px)`,
            whiteSpace: "nowrap",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};

/** A single line of sentence-case copy, revealed as one block. */
export const Line = ({
  text,
  x,
  y,
  at,
  anchor = "center",
  size = theme.text.body.size,
  color = theme.color.ink,
  weight = 600,
}: {
  text: string;
  x: number;
  y: number;
  at: number;
  anchor?: "center" | "left" | "right";
  size?: number;
  color?: string;
  weight?: number;
}) => {
  const f = useCurrentFrame();
  const r = textReveal(f, at);
  const shift = anchor === "center" ? "-50%" : anchor === "right" ? "-100%" : "0";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${shift}, calc(-50% + ${r.dy}px))`,
        opacity: r.opacity,
        fontFamily: theme.text.family,
        fontSize: size,
        fontWeight: weight,
        color,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};
