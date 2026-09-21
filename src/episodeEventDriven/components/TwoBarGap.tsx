/**
 * TwoBarGap — two horizontal bars on a shared baseline ("Expected" cyan vs
 * "Actual" indigo) with a highlighted gap band + "The Gap" chip. Bars grow from
 * the left; the gap band and chip fade in on their own onsets. Illustration.
 */
import { theme } from "../theme";
import { clamp01 } from "../helpers";

const c = theme.colors;

export const TwoBarGap = ({
  x,
  y,
  w,
  expected,
  actual,
  frame,
  expStart,
  actStart,
  gapStart,
  chipStart,
  chipLabel = "The Gap",
}: {
  x: number;
  y: number;
  w: number; // full plot width (max bar length)
  expected: number; // 0..1 of w
  actual: number; // 0..1 of w
  frame: number;
  expStart: number;
  actStart: number;
  gapStart: number;
  chipStart: number;
  chipLabel?: string;
}) => {
  const barH = 74;
  const gapY = 96;
  const eLen = w * expected * clamp01((frame - expStart) / 22);
  const aLen = w * actual * clamp01((frame - actStart) / 22);
  const gapOp = clamp01((frame - gapStart) / 16);
  const chipOp = clamp01((frame - chipStart) / 14);
  const gx0 = x + w * Math.min(expected, actual);
  const gx1 = x + w * Math.max(expected, actual);

  return (
    <>
      {/* gap band */}
      {frame >= gapStart && (
        <div style={{ position: "absolute", left: gx0, top: y - 12, width: gx1 - gx0, height: gapY * 2 + barH + 4, background: theme.colors.indigoWash, border: `2px dashed ${c.indigo}`, borderRadius: theme.radius.sm, opacity: gapOp }} />
      )}

      {/* Expected (cyan) */}
      <div style={{ position: "absolute", left: x, top: y - 34, fontSize: 24, fontWeight: theme.font.weights.semibold, color: c.grey }}>Expected</div>
      <div style={{ position: "absolute", left: x, top: y, width: eLen, height: barH, background: c.cyan, borderRadius: theme.radius.sm }} />

      {/* Actual (indigo) */}
      <div style={{ position: "absolute", left: x, top: y + gapY - 34, fontSize: 24, fontWeight: theme.font.weights.semibold, color: c.grey }}>Actual</div>
      <div style={{ position: "absolute", left: x, top: y + gapY, width: aLen, height: barH, background: c.indigo, borderRadius: theme.radius.sm }} />

      {/* baseline */}
      <div style={{ position: "absolute", left: x, top: y - 40, width: 3, height: gapY + barH + 46, background: c.line }} />

      {/* chip */}
      {frame >= chipStart && (
        <div style={{ position: "absolute", left: (gx0 + gx1) / 2 - 78, top: y + gapY + barH + 26, width: 156, textAlign: "center", padding: "10px 0", borderRadius: theme.radius.chip, background: c.indigo, color: c.white, fontSize: 26, fontWeight: theme.font.weights.bold, opacity: chipOp }}>
          {chipLabel}
        </div>
      )}
    </>
  );
};
