/**
 * Scene14A — from 9044, duration 630 (21.0s). Real BBRI, June 2026.
 * Format break: no tab row. Real-ticker header strip, full-width chart, the run
 * of selling into 8 Jun, then the 9 Jun bullish engulfing building live to 2,790
 * — swallowing the 8th's body ("Erased"). Green/red confined to candle bodies.
 * Mounts SourceTag (never IllustrationTag).
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { SourceTag } from "../components/SourceTag";
import { Chip } from "../components/Chip";
import { Candle } from "../components/Candle";
import { theme } from "../theme";
import { sec, progress, textReveal, fadeIn, priceScale, fmtRp } from "../helpers";
import { BBRI, BBRI_IDX } from "../data/bbri-placeholder";

const CHART = { x: 194, y: 260, w: 1456, h: 600 };
const SLOT = (CHART.w - 80) / 20; // spaced for all 20 days (SC14C reveals the rest)
const cx = (i: number) => CHART.x + 40 + SLOT * (i + 0.5);
const BODY_W = Math.min(34, SLOT * 0.6);
const scale = priceScale(Math.min(...BBRI.map((d) => d.low)), Math.max(...BBRI.map((d) => d.high)), CHART.y + 20, CHART.y + CHART.h - 20, 0.08);

const T = { header: 0.0, wipe: 1.2, ring8: 4.0, tick9: 7.4, body9: 10.0, cross: 12.2, close9: 13.0, pair: 16.0 };

export const Scene14A = () => {
  const f = useCurrentFrame();
  const jun8 = BBRI[BBRI_IDX.jun8];
  const jun9 = BBRI[BBRI_IDX.jun9];
  const build9 = progress(f, sec(T.body9), sec(3.0));
  const dim8 = f >= sec(T.cross) ? progress(f, sec(T.cross), 12) : 0;
  const ring8On = f >= sec(T.ring8) && f < sec(T.tick9);
  const head = textReveal(f, sec(T.header));

  return (
    <SafeArea>
      {/* Real-ticker header strip (ends x ≤ 1368). */}
      <div style={{ position: "absolute", left: 96, top: 60, opacity: head.opacity, transform: `translateY(${head.y}px)` }}>
        <div style={{ fontFamily: theme.type.family, fontSize: theme.type.headline.size, fontWeight: theme.type.headline.weight, color: theme.colors.ink }}>BBRI</div>
        <div style={{ display: "flex", gap: 28, marginTop: 6 }}>
          <span style={{ fontSize: theme.type.body.size, color: theme.colors.slate }}>Bank Rakyat Indonesia</span>
          <span style={{ fontSize: theme.type.label.size, color: theme.colors.slate }}>June 2026</span>
        </div>
      </div>

      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
        {/* Rp axis */}
        {[jun9.high, (jun8.close + jun9.close) / 2, jun8.low].map((p, k) => (
          <text key={k} x={CHART.x + CHART.w + 8} y={scale(p) + 8} fontFamily={theme.type.family} fontSize={24} fill={theme.colors.slate}>
            {fmtRp(p)}
          </text>
        ))}
        {/* candles 0..10 wipe in */}
        {BBRI.slice(0, 11).map((c, i) => {
          const start = sec(T.wipe) + i * 2;
          if (f < start) return null;
          const p = progress(f, start, 10);
          return <Candle key={i} x={cx(i)} width={BODY_W} open={c.open} high={c.high} low={c.low} close={c.close} scale={scale} buildProgress={p} wickProgress={p} dim={i === BBRI_IDX.jun8 && dim8 > 0.5} />;
        })}
        {/* 9 Jun open tick + live body */}
        {f >= sec(T.tick9) && (
          <>
            <line x1={cx(BBRI_IDX.jun9) - BODY_W / 2 - 6} y1={scale(jun9.open)} x2={cx(BBRI_IDX.jun9) + BODY_W / 2 + 6} y2={scale(jun9.open)} stroke={theme.colors.indigo} strokeWidth={theme.stroke.standard} />
            {f >= sec(T.body9) && <Candle x={cx(BBRI_IDX.jun9)} width={BODY_W} open={jun9.open} high={jun9.high} low={jun9.low} close={jun9.close} scale={scale} buildProgress={build9} wickProgress={build9} />}
          </>
        )}
        {/* 8 Jun focus ring */}
        {ring8On && (
          <rect x={cx(BBRI_IDX.jun8) - SLOT / 2} y={scale(jun8.high) - 14} width={SLOT} height={scale(jun8.low) - scale(jun8.high) + 28} rx={10} fill="none" stroke={theme.colors.indigo} strokeWidth={theme.stroke.standard} opacity={fadeIn(f, sec(T.ring8), 8)} />
        )}
      </svg>

      {/* 8 Jun date + values */}
      {ring8On && (
        <>
          <Chip label="8 Jun" x={cx(BBRI_IDX.jun8)} y={scale(jun8.high) - 96} variant="indigo" startFrame={sec(T.ring8)} anchor="center" />
          <div style={{ position: "absolute", left: cx(BBRI_IDX.jun8), top: scale(jun8.low) + 24, transform: "translateX(-50%)", fontSize: theme.type.label.size, color: theme.colors.slate, whiteSpace: "nowrap", opacity: fadeIn(f, sec(T.ring8) + 8, 10) }}>
            O 2,700 · C 2,590
          </div>
        </>
      )}
      {/* 9 Jun date + tick label + close label */}
      {f >= sec(T.tick9) && (
        <>
          <Chip label="9 Jun" x={cx(BBRI_IDX.jun9)} y={scale(jun9.high) - 96} variant="indigo" startFrame={sec(T.tick9)} anchor="center" />
          {f < sec(T.body9) && <div style={{ position: "absolute", left: cx(BBRI_IDX.jun9) + 40, top: scale(jun9.open) - 18, fontSize: theme.type.label.size, color: theme.colors.slate, whiteSpace: "nowrap", opacity: fadeIn(f, sec(T.tick9) + 8, 10) }}>Opens 2,540</div>}
          {f >= sec(T.close9) && <div style={{ position: "absolute", left: cx(BBRI_IDX.jun9) + 40, top: scale(jun9.close) - 18, fontSize: theme.type.label.size, color: theme.colors.slate, whiteSpace: "nowrap", opacity: fadeIn(f, sec(T.close9), 10) }}>Closes 2,790</div>}
        </>
      )}
      {/* Erased */}
      {dim8 > 0.3 && <Chip label="Erased" x={cx(BBRI_IDX.jun8)} y={scale((jun8.open + jun8.close) / 2) - 20} variant="indigo" startFrame={sec(T.cross)} anchor="center" />}
      {/* engulfing pair chips */}
      {f >= sec(T.pair) && (
        <div style={{ position: "absolute", left: cx(BBRI_IDX.jun8), top: scale(jun9.low) + 70, display: "flex", gap: 20, opacity: fadeIn(f, sec(T.pair), 10) }}>
          <Chip label="Bullish Engulfing" x={0} y={0} variant="indigo" startFrame={sec(T.pair)} anchor="left" />
          <Chip label="After A Run Of Selling" x={230} y={0} variant="indigo" startFrame={sec(T.pair) + 6} anchor="left" />
        </div>
      )}

      <SourceTag />
    </SafeArea>
  );
};
