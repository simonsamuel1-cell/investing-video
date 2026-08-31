/**
 * core/ComboTable.tsx — a table that FILLS IN, one row at a time.
 *
 * ═══ WHY THIS IS A COMPONENT AND NOT FOUR CHIPS ═══
 *
 * The problem it solves is a timing one, not a layout one. A recap that
 * summarises four scenes has nowhere to live: a recorded voice-over leaves
 * 0.3–0.6s of silence between scenes and sometimes NONE at all, so the summary
 * card the script asks for cannot exist.
 *
 * The answer is to stop treating it as a card. One row lands per scene, while
 * that scene is being narrated, and by the time the chapter ends the table is
 * already complete and simply holds under whatever comes next. Same
 * information, no extra runtime — and the viewer watches it being built rather
 * than being handed a finished list.
 *
 * ⚠ THAT ONLY WORKS IF THE TABLE IS ONE OBJECT MOUNTED ACROSS ALL FOUR SCENES.
 * Those scenes must therefore share a continuity group. Rebuilding it per scene
 * restarts every row's entrance and loses the argument — the picture still
 * looks right and the claim is gone.
 *
 * ⚠ ROWS CARRY THEIR OWN FRAME. `revealedAt` is per row and local to whatever
 * mounts the table, so the whole schedule is legible in one place instead of
 * being spread across four scene files.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { usePalette } from "./palette";
import { textReveal } from "./helpers";
import { useMotion } from "./useMotion";
import type { Rect } from "./helpers";
import type { Tone } from "./Chip";

export type ComboRow = {
  cells: string[];
  /** Frame this row fills in on. Local to the group that mounts the table. */
  revealedAt: number;
  /** Colours the whole row. Defaults to the body ink. */
  tone?: Tone;
};

export const ComboTable = ({
  columns,
  widths,
  rows,
  rect,
  headAt = 0,
  align,
  opacity = 1,
}: {
  /** Column headings. Defined once, up front — they do not arrive per row. */
  columns: string[];
  /** Column widths as fractions of `rect.w`. Should sum to 1. */
  widths: number[];
  rows: ComboRow[];
  rect: Rect;
  headAt?: number;
  align?: ("left" | "center" | "right")[];
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  if (opacity <= 0.001) return null;

  /* the head owns one row's worth of height, so the body sits below it and the
     rows are the same height whether or not the head has arrived */
  const rowH = rect.h / (rows.length + 1);
  const bodyTop = rect.y + rowH;
  const xOf = (k: number) =>
    rect.x + rect.w * widths.slice(0, k).reduce((a, b) => a + b, 0);
  const alignOf = (k: number) => align?.[k] ?? (widths[k] < 0.14 ? "center" : "left");
  const inkOf = (t?: Tone) =>
    t === "cyan" ? c.cyan : t === "slate" ? c.slate : t === "indigo" ? c.indigo : c.ink;

  const cell = (
    text: string,
    k: number,
    top: number,
    ink: string,
    r: { opacity: number; dy: number },
    size: number,
    weight: number,
  ) => (
    <div
      key={`${k}-${text}`}
      style={{
        position: "absolute",
        left: xOf(k),
        top,
        width: rect.w * widths[k],
        height: rowH,
        display: "flex",
        alignItems: "center",
        justifyContent:
          alignOf(k) === "center" ? "center" : alignOf(k) === "right" ? "flex-end" : "flex-start",
        fontFamily: theme.text.family,
        fontSize: size,
        fontWeight: weight,
        color: ink,
        opacity: r.opacity * opacity,
        transform: `translateY(${r.dy}px)`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );

  const head = textReveal(f, headAt, m.reveal);

  return (
    <>
      {head.opacity > 0.001 &&
        columns.map((t, k) =>
          cell(t, k, rect.y, c.slate, head, theme.text.axis.size, theme.text.axis.weight),
        )}
      {/* the head's rule arrives with the head, and spans the whole table */}
      {head.opacity > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: rect.x,
            top: rect.y + rowH - theme.shape.rule,
            width: rect.w * head.opacity,
            height: theme.shape.rule,
            background: c.border,
            opacity,
          }}
        />
      )}
      {rows.map((row, i) => {
        const r = textReveal(f, row.revealedAt, m.reveal);
        if (r.opacity <= 0.001) return null;
        const ink = inkOf(row.tone);
        return (
          <div key={i}>
            {/* each row's own hairline arrives with it, so the table grows a
                line at a time rather than showing empty ruled space waiting */}
            <div
              style={{
                position: "absolute",
                left: rect.x,
                top: bodyTop + i * rowH + rowH - theme.shape.hairline,
                width: rect.w * r.opacity,
                height: theme.shape.hairline,
                background: c.border,
                opacity,
              }}
            />
            {row.cells.map((t, k) =>
              cell(t, k, bodyTop + i * rowH, ink, r, theme.text.chip.size, theme.text.chip.weight),
            )}
          </div>
        );
      })}
    </>
  );
};
