/**
 * TextBlock.tsx — the component that enforces Rule 2.
 *
 * ═══ TEXT IS SEQUENTIAL, NEVER STACKED ═══
 *
 * The storyboard gives several text blocks per scene. They appear one AFTER
 * another. A block owns the frame from `from` until `until`, and the next
 * block's `from` may not begin before this one's `until` — checked by
 * `assertBlocks`, which throws in development.
 *
 * That assertion is the whole point of this file. Stacking text is exactly
 * what made the first preview unreadable, and a rule that lives only in a
 * reviewer's memory is a rule that comes back.
 *
 * A "block" is ONE text element however many lines it holds — the two-line
 * limit counts blocks, not lines.
 */
import { theme } from "../theme";
import { textReveal, fadeOut } from "../helpers";
import { Strike } from "./Strike";

export type Mode = "A" | "B" | "C";
/** Every size in `theme.type` except the font family itself. */
export type TypeSize = Exclude<keyof typeof theme.type, "family">;
export type Line = {
  text: string;
  size?: TypeSize;
  /** true → the rule sweeps 20 frames after this line lands; a number → that
      absolute frame. Never render a struck claim without one. */
  struck?: boolean | number;
  color?: "text" | "indigo" | "cyan" | "muted";
  /**
   * An absolute frame this line reveals, overriding the block's own stagger.
   * A hierarchy that builds over fifteen seconds cannot use a 4-frame rhythm,
   * and splitting it into separate blocks would break Rule 2 — it is ONE text
   * element that grows.
   */
  at?: number;
};

const TONE = {
  text: theme.colors.text,
  indigo: theme.colors.indigo,
  cyan: theme.colors.cyan,
  muted: theme.colors.textMuted,
} as const;

/** Where a block sits, per mode. A scene may override with x / y. */
const HOME: Record<Mode, { x: number; y: number; w: number }> = {
  A: { x: 160, y: 300, w: 900 },
  B: { x: theme.layout.panelB.x, y: theme.layout.panelB.y, w: theme.layout.panelB.w },
  C: { x: theme.layout.textC.x, y: theme.layout.textC.y, w: theme.layout.textC.w },
};

/** Lines within one block stagger in at 4-frame intervals. */
const STAGGER = 4;

export const TextBlock = ({
  lines,
  mode,
  localFrame: f,
  from,
  until,
  x,
  y,
  gap = 18,
}: {
  lines: Line[];
  mode: Mode;
  localFrame: number;
  from: number;
  until: number;
  x?: number;
  y?: number;
  gap?: number;
}) => {
  if (f < from || f >= until) return null;
  const home = HOME[mode];
  /* the block fades out over the last `revealF` frames of its own window, so
     it is gone before the next block's `from` */
  const out = fadeOut(f, until - theme.motion.revealF);

  return (
    <div
      style={{
        position: "absolute",
        left: x ?? home.x,
        top: y ?? home.y,
        width: home.w,
        display: "flex",
        flexDirection: "column",
        gap,
        opacity: out,
      }}
    >
      {lines.map((ln, i) => {
        const at = ln.at ?? from + i * STAGGER;
        if (f < at) return null;
        const r = textReveal(f, at);
        const t = theme.type[ln.size ?? "h2"];
        const strikeAt =
          ln.struck === undefined || ln.struck === false
            ? null
            : ln.struck === true
              ? at + 20
              : ln.struck;
        const body = (
          <span
            style={{
              fontFamily: theme.type.family,
              fontSize: t.size,
              fontWeight: t.weight,
              color: TONE[ln.color ?? "text"],
              whiteSpace: "pre-wrap",
            }}
          >
            {ln.text}
          </span>
        );
        return (
          <div key={i} style={{ opacity: r.opacity, transform: r.transform }}>
            {strikeAt === null ? (
              body
            ) : (
              <Strike f={f} at={strikeAt}>
                {body}
              </Strike>
            )}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Throws if two blocks in one scene would ever be on screen together.
 *
 * Call it once at module scope in every scene that uses more than one block.
 * It runs at import time, so a violation fails the Studio build rather than
 * quietly producing an unreadable frame nobody scrubs to.
 */
export const assertBlocks = (
  scene: string,
  blocks: { from: number; until: number }[],
) => {
  const sorted = [...blocks].sort((a, b) => a.from - b.from);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].from < sorted[i - 1].until) {
      throw new Error(
        `${scene}: TextBlocks overlap — [${sorted[i - 1].from}, ${sorted[i - 1].until}) ` +
          `and [${sorted[i].from}, ${sorted[i].until}). Rule 2: text is sequential, never stacked.`,
      );
    }
  }
};
