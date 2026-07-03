/**
 * Scene 33 — Pro / Cons / Takeaway summary (8690, ends 9020). A 2-column × 3-row
 * table; each row builds in at its cue: Pro·Efficient (8722), Cons·Not fail-proof
 * (8870), Takeaway·Manage risk & know your exit (8928). Left cells are brand-tinted
 * labels, right cells the plain-text value; the Takeaway row is indigo-filled for
 * emphasis. Frame = comp − 8690.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut, tween } from "../helpers";

const { colors, font, radius } = theme;

const ROWS = [
  { label: "Pro", value: "Efficient", at: 32, bg: colors.cyanTint, fg: colors.cyanDeep }, // 8722
  { label: "Cons", value: "Not fail-proof", at: 180, bg: colors.indigoTint, fg: colors.indigoDeep }, // 8870
  { label: "Takeaway", value: "Manage risk & know your exit", at: 238, bg: colors.indigo, fg: colors.white }, // 8928
];

const TABLE_W = 1200;
const TABLE_L = (1920 - TABLE_W) / 2; // 360
const COL1_W = 380;
const ROW_H = 150;
const GAP = 20;
const TOP = 300;

export const Scene33 = () => {
  const f = useCurrentFrame();
  const stageOut = fadeOut(f, 316, 14); // end 9020

  return (
    <SafeArea>
      <AbsoluteFill style={{ opacity: stageOut }}>
        <div style={{ position: "absolute", left: 96, top: 188, width: 1728, textAlign: "center", fontSize: 56, fontWeight: font.weights.extrabold, color: colors.text, opacity: fadeIn(f, 32, 16), transform: `translateY(${tween(f, [32, 48], [18, 0])}px)` }}>
          For short-term traders
        </div>

        {ROWS.map((r, i) => {
          const op = fadeIn(f, r.at, 16);
          const ty = tween(f, [r.at, r.at + 16], [18, 0]);
          const top = TOP + i * (ROW_H + GAP);
          return (
            <div key={r.label} style={{ position: "absolute", left: TABLE_L, top, width: TABLE_W, height: ROW_H, display: "flex", borderRadius: radius.md, overflow: "hidden", border: `2px solid ${colors.divider}`, background: colors.white, boxShadow: "0 10px 30px rgba(15,23,42,0.06)", opacity: op, transform: `translateY(${ty}px)` }}>
              <div style={{ width: COL1_W, display: "flex", alignItems: "center", justifyContent: "center", background: r.bg, color: r.fg, fontSize: 46, fontWeight: font.weights.extrabold }}>
                {r.label}
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 44px", color: colors.text, fontSize: 42, fontWeight: font.weights.bold }}>
                {r.value}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </SafeArea>
  );
};
