/**
 * Scene 2 (v4) — The Real Question · 657f · NATIVE.
 * Beat list (Simon, 25 Jun — scene-relative frames):
 *   0–72    the S1 chart returns, indicators and all.
 *   73–169  the indicators disappear, leaving only the candlestick chart, which
 *           slides to screen centre.
 *   170–306 two condition-questions appear above the chart.
 *   307–452 two smaller "detail" questions appear struck-through below the chart
 *           ("What does the RSI say?" 313–381 · "Is the MACD crossed?" 382–452).
 *   453–501 everything fades out.
 *   →656    the resolve line "The details come after — only if needed." appears
 *           in Montserrat.
 *
 * Animation: the chart strip + recentre is the only big move; every WORD uses
 * the subtle reveal (fade + slide, no bounce).
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneWrap, TradingChart } from "../components";
import { COLORS, TYPE, WEIGHT } from "../theme";
import { ease, fadeOut, textReveal } from "../helpers";
import { montserratFamily } from "../fonts";
import { S2_CONDITION_QS, S2_DETAIL_QS, S2_CONDITION_FIRST, S2_RESOLVE } from "./scene02.data";

const CHART_DY = 185; // slide the chart from its S1 top position to centre

export const Scene02 = () => {
  const frame = useCurrentFrame();

  // 0–169: chart returns with indicators, then indicators fade and the chart
  // slides to centre. Everything fades out at 453.
  const indicators = ease(frame, [73, 150], [1, 0]);
  const dy = ease(frame, [73, 169], [0, CHART_DY]);
  const reveal = { ma5: indicators, ma20: indicators, rsi: indicators, macd: indicators, stoch: indicators, psar: indicators };
  const allOut = fadeOut(frame, 453, 44);

  // 170–306: the two condition questions, above the chart.
  const q1 = textReveal(frame, 170, 18, 16);
  const q2 = textReveal(frame, 246, 18, 16);

  // 307–452: the two struck-through detail questions, below the chart.
  const d1 = textReveal(frame, 313, 16, 10);
  const d2 = textReveal(frame, 382, 16, 10);

  // →656: the resolve — condition first (as it was), then details in Montserrat.
  const res1 = textReveal(frame, 505, 20, 18);
  const res2 = textReveal(frame, 545, 20, 18);
  // exit: fade the whole resolve out as the scene ends.
  const exit = fadeOut(frame, 624, 30);

  return (
    <SceneWrap>
      {/* the $ABCD chart — returns full, strips to price-only, slides to centre */}
      <AbsoluteFill style={{ opacity: allOut }}>
        <TradingChart candleProgress={1} reveal={reveal} dy={dy} />
      </AbsoluteFill>

      {/* 170–306 — two condition questions, above the chart */}
      <AbsoluteFill style={{ opacity: allOut }}>
        {[q1, q2].map((q, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 960 - 700,
              top: 96 + i * 78,
              width: 1400,
              textAlign: "center",
              opacity: q.opacity,
              transform: `translateY(${q.ty}px)`,
              fontSize: TYPE.principle,
              fontWeight: WEIGHT.bold,
              color: COLORS.text,
            }}
          >
            {S2_CONDITION_QS[i]}
          </div>
        ))}
      </AbsoluteFill>

      {/* 307–452 — two struck-through detail questions, below the chart */}
      <AbsoluteFill style={{ opacity: allOut }}>
        {[d1, d2].map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: i === 0 ? 430 : 1010,
              top: 778,
              width: 480,
              textAlign: "center",
              opacity: d.opacity,
              transform: `translateY(${d.ty}px)`,
              fontSize: TYPE.body,
              fontWeight: WEIGHT.semibold,
              color: COLORS.slate,
              textDecoration: "line-through",
            }}
          >
            {S2_DETAIL_QS[i]}
          </div>
        ))}
      </AbsoluteFill>

      {/* →656 — resolve: condition first (indigo, brand font) over details (Montserrat) */}
      <AbsoluteFill style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, opacity: exit }}>
        <div
          style={{
            width: 1400,
            textAlign: "center",
            opacity: res1.opacity,
            transform: `translateY(${res1.ty}px)`,
            fontSize: TYPE.display,
            fontWeight: WEIGHT.heavy,
            color: COLORS.primary,
          }}
        >
          {S2_CONDITION_FIRST}
        </div>
        <div
          style={{
            width: 1400,
            textAlign: "center",
            opacity: res2.opacity,
            transform: `translateY(${res2.ty}px)`,
            fontFamily: montserratFamily,
            fontSize: TYPE.headline,
            fontWeight: WEIGHT.semibold,
            color: COLORS.text,
          }}
        >
          {S2_RESOLVE}
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};
