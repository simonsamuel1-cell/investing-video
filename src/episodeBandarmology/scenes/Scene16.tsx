/**
 * Scene 16 — Mistake 1: one day vs multi-day (3962, dur 271). Left: a single
 * net-buy bar "1 day: +1.2 M" (greyed, shaken-dismissed ~f120; UI bounce OK).
 * Right: a 20-bar daily net-buy series trending up "20 days: steady accumulation"
 * (indigo). Callout "1 day ≠ a trend." Title + sentence-case sub.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, Callout, IllustrationTag } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut, textReveal, mulberry32 } from "../helpers";

const { colors, font, type } = theme;

const SERIES = (() => {
  const rng = mulberry32(1616);
  return Array.from({ length: 20 }, (_, i) => 0.25 + (i / 19) * 0.55 + (rng() - 0.5) * 0.1);
})();

export const Scene16 = () => {
  const f = useCurrentFrame();
  const shake = f > 120 && f < 150 ? Math.sin((f - 120) * 1.6) * 10 : 0;
  const dismiss = fadeOut(f, 150, 18);

  return (
    <SafeArea>
      {/* single day */}
      <div style={{ position: "absolute", left: 180, top: 300, width: 420, opacity: dismiss, transform: `translateX(${shake}px)` }}>
        <svg width={300} height={360} viewBox="0 0 300 360">
          <line x1={0} y1={340} x2={300} y2={340} stroke={colors.slateFaint} strokeWidth={2} />
          <rect x={100} y={140} width={100} height={200} rx={6} fill={colors.slateFaint} />
        </svg>
        <div style={{ fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.slateMute, textAlign: "center" }}>1 day: +1.2 M</div>
      </div>

      {/* 20 days */}
      <div style={{ position: "absolute", left: 700, top: 300, width: 980 }}>
        <svg width={980} height={360} viewBox="0 0 980 360">
          <line x1={0} y1={340} x2={980} y2={340} stroke={colors.slateFaint} strokeWidth={2} />
          {SERIES.map((v, i) => (
            <rect key={i} x={10 + i * 48} y={340 - v * 320} width={32} height={v * 320} rx={3} fill={colors.indigo} opacity={fadeIn(f, 20 + i * 8, 14)} />
          ))}
        </svg>
        <div style={{ fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.indigoDeep, textAlign: "center" }}>20 days: steady accumulation</div>
      </div>

      <Callout ax={840} ay={360} dx={-20} dy={-200} width={360} body="1 day ≠ a trend." op={fadeIn(f, 170, 16)} variant="indigo" />

      <div style={{ position: "absolute", left: 96, top: 760, width: 1600, ...textReveal(f, 8, 18) }}>
        <div style={{ fontSize: type.subhead, fontWeight: font.weights.extrabold }}>1 · One Day Tells You Almost Nothing</div>
        <div style={{ fontSize: type.descriptor, fontWeight: font.weights.medium, color: colors.slate, marginTop: 8 }}>Accumulation is a pattern over time, not a snapshot.</div>
      </div>

      <IllustrationTag left={1620} top={280} />
    </SafeArea>
  );
};
