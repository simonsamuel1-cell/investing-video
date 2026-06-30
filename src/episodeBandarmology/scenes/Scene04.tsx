/**
 * Scene 04 — Clues, not prediction (755, dur 287). DISCLAIMER beat. A LineChart
 * draws up to a vertical "Now" marker (solid indigo = history); right of "Now"
 * stays blank — NO forecast line/arrow. Tooltip on the last point (sentence
 * case): "We can read the past, not the next tick." Pinned chip "Clues, Not
 * Predictions". "Illustration" tag.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, LineChart, Chip, IllustrationTag } from "../components";
import { theme } from "../theme";
import { tween, textReveal, fadeIn, mulberry32 } from "../helpers";

const { colors, font, type } = theme;

const NOW = 0.66;
const PTS = (() => {
  const rng = mulberry32(404);
  return Array.from({ length: 40 }, (_, i) => {
    const x = (i / 39) * NOW;
    const y = 0.3 + (i / 39) * 0.4 + (rng() - 0.5) * 0.06;
    return { x, y: Math.max(0.05, Math.min(0.95, y)) };
  });
})();
const LAST = PTS[PTS.length - 1];

export const Scene04 = () => {
  const f = useCurrentFrame();
  const prog = tween(f, [10, 150], [0, 1]);

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 110, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Clues, not prediction
      </div>

      <div style={{ position: "absolute", left: 150, top: 320, width: 1520, height: 440 }}>
        <LineChart width={1520} height={440} points={PTS} progress={prog} area nowX={NOW} tooltip={{ x: LAST.x, y: LAST.y, label: "Last known" }} />
      </div>

      <div style={{ position: "absolute", left: 150, top: 800, width: 1400, fontSize: type.descriptor, fontWeight: font.weights.medium, color: colors.slate, ...textReveal(f, 160, 18) }}>
        We can read the past, not the next tick.
      </div>

      <div style={{ position: "absolute", left: 96, top: 880 }}>
        <Chip label="Clues, Not Predictions" variant="outline" bounce delay={200} />
      </div>

      <IllustrationTag left={1620} top={300} op={fadeIn(f, 20, 16)} />
    </SafeArea>
  );
};
