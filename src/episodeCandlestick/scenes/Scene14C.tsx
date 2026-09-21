/**
 * Scene14C — from 9870, duration 516 (17.2s). Continues SC14B's frame. The
 * curtain wipes right; the following days reveal, climbing; a marker lands on
 * 17 Jun with a +10% delta chip (baseline = the 8th's close, 2,590). One slate
 * confirmation line. No arrows, projections, or targets.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { SourceTag } from "../components/SourceTag";
import { RevealCurtain } from "../components/RevealCurtain";
import { Chip } from "../components/Chip";
import { BbriAxis, BbriCandles, bcx, bbriScale, SLOT } from "../components/BbriChart";
import { BBRI, BBRI_IDX } from "../data/bbri-placeholder";
import { theme } from "../theme";
import { sec, progress, textReveal, fadeIn } from "../helpers";

const CURTAIN_X = bcx(BBRI_IDX.jun9) + SLOT;
const T = { curtain: 0.0, reveal: 0.4, mark: 5.4, delta: 6.2, line: 8.6, ring: 12.5 };

export const Scene14C = () => {
  const f = useCurrentFrame();
  const jun8 = BBRI[BBRI_IDX.jun8];
  const jun9 = BBRI[BBRI_IDX.jun9];
  const jun17 = BBRI[BBRI_IDX.jun17];
  const line = textReveal(f, sec(T.line));
  const ringOn = f >= sec(T.ring);

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 60 }}>
        <div style={{ fontFamily: theme.type.family, fontSize: theme.type.headline.size, fontWeight: theme.type.headline.weight, color: theme.colors.ink }}>BBRI</div>
        <div style={{ display: "flex", gap: 28, marginTop: 6 }}>
          <span style={{ fontSize: theme.type.body.size, color: theme.colors.slate }}>Bank Rakyat Indonesia</span>
          <span style={{ fontSize: theme.type.label.size, color: theme.colors.slate }}>June 2026</span>
        </div>
      </div>

      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
        <BbriAxis prices={[jun17.high, jun9.close, jun8.low]} />
        <BbriCandles staticUpto={BBRI_IDX.jun9} revealFrom={sec(T.reveal)} revealStart={12} revealEnd={19} revealStagger={sec(0.18)} />
        {/* focus ring back on the 9 Jun engulfing candle */}
        {ringOn && (
          <rect x={bcx(BBRI_IDX.jun9) - SLOT / 2} y={bbriScale(jun9.high) - 14} width={SLOT} height={bbriScale(jun9.low) - bbriScale(jun9.high) + 28} rx={10} fill="none" stroke={theme.colors.indigo} strokeWidth={theme.stroke.standard} opacity={fadeIn(f, sec(T.ring), 8)} />
        )}
      </svg>

      <RevealCurtain x={CURTAIN_X} slideProgress={1 - progress(f, sec(T.curtain), sec(1.2))} />

      {/* 17 Jun marker + delta */}
      {f >= sec(T.mark) && <Chip label="17 Jun" x={bcx(BBRI_IDX.jun17)} y={bbriScale(jun17.high) - 96} variant="indigo" startFrame={sec(T.mark)} anchor="center" />}
      {f >= sec(T.delta) && <Chip label="+10% From The 8th's Close" x={bcx(BBRI_IDX.jun17)} y={bbriScale(jun17.high) - 150} variant="indigo" startFrame={sec(T.delta)} anchor="center" />}

      {/* confirmation line */}
      <div style={{ position: "absolute", left: theme.layout.safeLeft, top: 900, width: theme.layout.activeWidth, textAlign: "center", fontSize: theme.type.body.size, fontWeight: theme.type.body.weight, color: theme.colors.slate, opacity: line.opacity, transform: `translateY(${line.y}px)` }}>
        Engulfing patterns fail without confirmation — this one played out.
      </div>

      <SourceTag />
    </SafeArea>
  );
};
