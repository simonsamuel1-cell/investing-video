/**
 * Scene 10 — Closing. The Scene 1 "$ABCD" chart returns (all candles + every
 * indicator fading in together this time, not one-by-one), with the kept
 * question "It's asking the right questions first" above it and a sub-line
 * "what is the condition?" — the principle restated as the literal chart prompt.
 */
import { useCurrentFrame } from "remotion";
import { SceneWrap } from "../components";
import { COLORS, TYPE, WEIGHT } from "../theme";
import { fadeIn, fadeOut, ease } from "../helpers";
import { TradingChart } from "../components/TradingChart";

// Everything visible at once (no one-by-one reveal, per Simon 26 Jun).
const ALL_REVEAL = { ma5: 1, ma20: 1, rsi: 1, macd: 1, stoch: 1, psar: 1 } as const;

export const Scene10 = () => {
  const frame = useCurrentFrame();

  // Frame 0 = abs 7387.
  const chartIn = fadeIn(frame, 0, 20); // chart (everything at once) @7387
  const qOp = fadeIn(frame, 146, 18); // "asking the right questions first" — kept @7533
  const qTy = ease(frame, [146, 164], [16, 0]);
  const subOp = fadeIn(frame, 210, 18); // "what is the condition?" @7597
  // @7737 (frame 350): remove all the above, bring up the closing lockup.
  const allOut = fadeOut(frame, 350, 16);
  const lockOp = fadeIn(frame, 358, 18);

  return (
    <SceneWrap>
      {/* Scene-1 chart, replicated — pushed down (dy) to clear the question above */}
      <div style={{ opacity: chartIn * allOut }}>
        <TradingChart candleProgress={1} reveal={ALL_REVEAL} dy={92} />
      </div>

      {/* the question + sub-line, above the chart (cleared @7737) */}
      <div style={{ position: "absolute", left: 96, top: 44, width: 1728, textAlign: "center", opacity: allOut }}>
        <div style={{ opacity: qOp, transform: `translateY(${qTy}px)`, fontSize: TYPE.title, fontWeight: WEIGHT.bold, color: COLORS.primary, lineHeight: 1.15 }}>
          It&rsquo;s asking the right questions first
        </div>
        <div style={{ opacity: subOp, marginTop: 10, fontSize: TYPE.sub, fontWeight: WEIGHT.medium, color: COLORS.slate }}>
          what is the condition?
        </div>
      </div>

      {/* closing lockup @7737 */}
      <div style={{ position: "absolute", left: 96, top: 430, width: 1728, textAlign: "center", opacity: lockOp, fontSize: TYPE.lead, fontWeight: WEIGHT.bold, lineHeight: 1.25 }}>
        <span style={{ color: COLORS.text }}>That&rsquo;s what the</span>
        <br />
        <span style={{ color: COLORS.primary }}>Technical Tab is built for</span>
      </div>
    </SceneWrap>
  );
};
