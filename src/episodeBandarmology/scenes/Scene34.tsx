/**
 * Scene 34 — Closing quote (9035, dur 306). DISCLAIMER / close. A large indigo
 * quotation mark, then the quote builds in line by line: 9074 / 9131 / 9194 /
 * 9255 / 9309. The disclaimer clause ("a probability, never a promise") is
 * emphasised in indigo. Frame = comp − 9035.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut, tween } from "../helpers";

const { colors, font } = theme;

const LINES = [
  { node: "The tracks are public.", at: 39 }, // 9074
  { node: "The skill is reading them honestly,", at: 96 }, // 9131
  { node: "and remembering that even the", at: 159 }, // 9194
  { node: (
    <>
      clearest trail is <span style={{ color: colors.indigo }}>a probability,</span>
    </>
  ), at: 220 }, // 9255
  { node: <span style={{ color: colors.indigo }}>never a promise.</span>, at: 274 }, // 9309
];

export const Scene34 = () => {
  const f = useCurrentFrame();
  const out = fadeOut(f, 292, 14);

  return (
    <SafeArea>
      <div style={{ opacity: out }}>
        {/* decorative opening quote mark */}
        <div style={{ position: "absolute", left: 96, top: 180, width: 1728, textAlign: "center", fontSize: 150, lineHeight: 1, fontWeight: font.weights.extrabold, color: colors.indigo, opacity: fadeIn(f, 20, 18) }}>
          &ldquo;
        </div>

        {/* pull-quote, line by line */}
        <div style={{ position: "absolute", left: 96, top: 380, width: 1728, textAlign: "center", fontSize: 54, lineHeight: 1.42, fontWeight: font.weights.bold, color: colors.text }}>
          {LINES.map((l, i) => (
            <div key={i} style={{ opacity: fadeIn(f, l.at, 14), transform: `translateY(${tween(f, [l.at, l.at + 14], [14, 0])}px)` }}>
              {l.node}
            </div>
          ))}
        </div>
      </div>
    </SafeArea>
  );
};
