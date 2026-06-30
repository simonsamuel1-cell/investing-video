/**
 * Scene 32 — The Story Changes (8498, dur 167). A centered two-state caption
 * swap: "Someone Is Quietly Buying" dissolves into "Someone Is Making Their
 * Move" (textReveal both). Paired with a price line transitioning flat → lift
 * (callback to Scene 30).
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, SchematicChart } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut, tween } from "../helpers";

const { colors, font, type } = theme;

const CW = 1400;
const CH = 320;

const PRICE = Array.from({ length: 70 }).map((_, i) => {
  const x = i / 69;
  let y = 0.35 + Math.sin(x * 20) * 0.02;
  if (x > 0.6) y = 0.35 + (x - 0.6) / 0.4 * 0.34;
  return { x, y };
});

export const Scene32 = () => {
  const f = useCurrentFrame();
  const prog = tween(f, [10, 150], [0, 1]);
  const firstOp = fadeOut(f, 70, 18);
  const secondOp = fadeIn(f, 80, 18);

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 250, width: 1728, textAlign: "center", height: 90 }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: "100%", fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.slate, opacity: firstOp }}>Someone Is Quietly Buying</div>
        <div style={{ position: "absolute", left: 0, top: 0, width: "100%", fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.indigo, opacity: secondOp }}>Someone Is Making Their Move</div>
      </div>

      <div style={{ position: "absolute", left: 260, top: 440, width: CW, height: CH }}>
        <SchematicChart width={CW} height={CH} points={PRICE} progress={prog} />
      </div>
    </SafeArea>
  );
};
