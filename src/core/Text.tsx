/**
 * core/Text.tsx — every word on screen enters through here.
 *
 * There is exactly ONE entrance for type: fade and rise. No pop, no bounce, no
 * rotation, no overlap. Pop is reserved for UI elements — chips, dots, markers,
 * countdown numerals — which live in their own files.
 *
 * `Title` is centred in the title strip. Centred rather than flush left because
 * a centred title of any length stays symmetric about the canvas and therefore
 * cannot drift toward the logo zone as the wording changes.
 *
 * `Words` reveals a line word by word. This was the one thing episodeMovingAverage's
 * TextBlock did that Market-Structure's Text did not, and it is the treatment the
 * brand spec asks for on longer on-screen sentences.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { usePalette } from "./palette";
import { textReveal } from "./helpers";
import { useMotion } from "./useMotion";

type Anchor = "center" | "left" | "right";
const shiftOf = (a: Anchor) =>
  a === "center" ? "-50%" : a === "right" ? "-100%" : "0";

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
  /** Frame this enters on. Scene-local. */
  at?: number;
  subAt?: number;
  x?: number;
  y?: number;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const head = textReveal(f, at, m.reveal);
  const tail = textReveal(f, subAt ?? at + m.fade, m.reveal);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontSize: theme.text.title.size,
          fontWeight: theme.text.title.weight,
          color: c.ink,
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
            color: c.slate,
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

/** A single line of copy, revealed as one block. */
export const Line = ({
  text,
  x,
  y,
  at,
  anchor = "center",
  size = theme.text.body.size,
  weight = 600,
  color,
}: {
  text: string;
  x: number;
  y: number;
  at: number;
  anchor?: Anchor;
  size?: number;
  weight?: number;
  color?: string;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const r = textReveal(f, at, m.reveal);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${shiftOf(anchor)}, calc(-50% + ${r.dy}px))`,
        opacity: r.opacity,
        fontFamily: theme.text.family,
        fontSize: size,
        fontWeight: weight,
        color: color ?? c.ink,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/**
 * The same line, revealed WORD BY WORD. Each word carries the identical fade
 * and rise; only its start is staggered. Identical size and baseline for every
 * word — never a per-word scale, which reads as bouncing type.
 */
export const Words = ({
  text,
  x,
  y,
  at,
  anchor = "center",
  size = theme.text.body.size,
  weight = 600,
  color,
  /** Frames between one word starting and the next. */
  stagger,
  maxWidth,
}: {
  text: string;
  x: number;
  y: number;
  at: number;
  anchor?: Anchor;
  size?: number;
  weight?: number;
  color?: string;
  stagger?: number;
  maxWidth?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const step = stagger ?? Math.max(1, Math.round(m.reveal / 4));
  const words = text.split(" ");
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${shiftOf(anchor)}, -50%)`,
        fontFamily: theme.text.family,
        fontSize: size,
        fontWeight: weight,
        color: color ?? c.ink,
        lineHeight: 1.3,
        maxWidth,
        textAlign: anchor === "center" ? "center" : anchor === "right" ? "right" : "left",
        whiteSpace: maxWidth ? "normal" : "nowrap",
      }}
    >
      {words.map((w, i) => {
        const r = textReveal(f, at + i * step, m.reveal);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: r.opacity,
              transform: `translateY(${r.dy}px)`,
              marginRight: "0.3em",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
