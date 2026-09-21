/**
 * Scene 13 — Four questions (comp 3199, dur 251). Preceded by the AnswerTitle
 * card (3110–3187). The four questions appear as numbered points, staggered, on a
 * clean screen; all fade out by 3450. Frame = comp − 3199.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeOut, textReveal } from "../helpers";

const { colors, font, type, radius } = theme;

const QUESTIONS = [
  { q: "Who is buying?", at: 0 }, // 3199
  { q: "How much?", at: 35 }, // 3234
  { q: "What price did they pay?", at: 91 }, // 3290
  { q: "Has quiet buying turned into a real move?", at: 164 }, // 3363
];

export const Scene13 = () => {
  const f = useCurrentFrame();
  const out = fadeOut(f, 237, 14); // all end at 3450

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 360, top: 296, width: 1200, display: "flex", flexDirection: "column", gap: 44 }}>
        {QUESTIONS.map((item, i) => {
          const rev = textReveal(f, item.at, 18);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 28, transform: rev.transform, opacity: Math.min(rev.opacity, out) }}>
              <span style={{ flex: "0 0 auto", width: 72, height: 72, borderRadius: radius.pill, background: colors.indigo, color: colors.white, fontSize: type.subhead, fontWeight: font.weights.extrabold, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
              <span style={{ fontSize: type.header, fontWeight: font.weights.bold, color: colors.text }}>{item.q}</span>
            </div>
          );
        })}
      </div>
    </SafeArea>
  );
};
