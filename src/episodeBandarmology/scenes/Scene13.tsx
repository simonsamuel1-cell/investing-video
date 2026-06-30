/**
 * Scene 13 — Four Questions (3098, dur 339). Checklist builds in sequence (each
 * textReveal, stacked, no overlap; stagger ~20,100,190,280): Who Is Buying? /
 * How Much? / What Price Did They Pay? / Has Quiet Buying Become A Real Move?
 * Indigo numerals 1–4, cyan tick markers. (Scene 24 revisits a narrowed version.)
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, textReveal } from "../helpers";

const { colors, font, type, radius } = theme;

const QS = [
  { q: "Who Is Buying?", at: 20 },
  { q: "How Much?", at: 100 },
  { q: "What Price Did They Pay?", at: 190 },
  { q: "Has Quiet Buying Become A Real Move?", at: 280 },
];

export const Scene13 = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 110,
          width: 1272,
          fontSize: type.header,
          fontWeight: font.weights.extrabold,
          ...textReveal(f, 8, 18),
        }}
      >
        Four Questions
      </div>

      {QS.map((item, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 200,
            top: 270 + i * 150,
            width: 1450,
            height: 120,
            display: "flex",
            alignItems: "center",
            gap: 28,
            ...textReveal(f, item.at, 18),
          }}
        >
          <span
            style={{
              flex: "0 0 auto",
              width: 72,
              height: 72,
              borderRadius: radius.pill,
              background: colors.indigoTint,
              color: colors.indigo,
              fontSize: type.subhead,
              fontWeight: font.weights.extrabold,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {i + 1}
          </span>
          <span style={{ fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.text }}>{item.q}</span>
          <svg width={48} height={48} viewBox="0 0 48 48" style={{ marginLeft: "auto", opacity: fadeIn(f, item.at + 14, 14) }} stroke={colors.cyan} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 8 26 L 20 38 L 42 10" />
          </svg>
        </div>
      ))}
    </SafeArea>
  );
};
