/**
 * SC06 — One Stock, Three Timeframes (from 3008, dur 712) — INDEPENDENT.
 * A TimeframeSelector drives the same stock through 5M → 1D → 1W with a
 * mask-wipe between each, then the three views resolve into a triptych so the
 * differing silhouettes read side by side.
 * TODO [NEEDS DATA: BMRI 5-minute intraday (one session) + weekly OHLC;
 * weekly may be derived from daily]
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { CandlestickChart } from "../components/CandlestickChart";
import { TimeframeSelector } from "../components/TimeframeSelector";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fadeIn, type Box } from "../helpers";
import { bmriDaily, bmri5m, bmriWeekly } from "../data/bmri";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
// Card top clears the 150px logo zone.
const CARD: Box = { x: 96, y: 160, w: 1728, h: 812 };
const CHART: Box = { x: 200, y: 370, w: 1520, h: 430 };
const SEL = { x: 160, y: 196 };
const T = {
  ticker: 0, // "saham yang sama" — the constant, pinned all scene
  selector: 51, // "dalam timeframe berbeda"
  tf5m: 107,
  span5m: 150, // "merangkum 5 menit transaksi"
  tf1d: 195,
  tf1w: 274,
  weekSpan: 339, // "perdagangan" — one weekly swallows five dailies
  same: 373, // "Sahamnya sama dan sejarahnya juga sama"
  triptych: 443, // "bisa terasa sangat berbeda"
  near: 534, // "seberapa dekat"
  far: 599, // "atau seberapa jauh"
  settle: 643, // "kamu memilih untuk melihatnya"
};
const WIPE = 44;
const TRI = { y: 330, w: 520, h: 380, gap: 24 };
// ═══════════════════════════════════════════════════════════════════════════

const VIEWS = [
  { label: "5M", data: bmri5m, win: [0, bmri5m.length - 1] as [number, number], chip: "1 Candle = 5 Menit" },
  { label: "1D", data: bmriDaily, win: [bmriDaily.length - 60, bmriDaily.length - 1] as [number, number], chip: "1 Candle = 1 Hari" },
  { label: "1W", data: bmriWeekly, win: [bmriWeekly.length - 30, bmriWeekly.length - 1] as [number, number], chip: "1 Candle = 1 Minggu" },
];

export const Scene06 = () => {
  const f = useCurrentFrame();

  const to1d = f >= T.tf1d ? progress(f, T.tf1d, WIPE) : 0;
  const to1w = f >= T.tf1w ? progress(f, T.tf1w, WIPE) : 0;
  const activeIndex = to1d + to1w; // 0 → 1 → 2, slides with the wipes
  const tri = f >= T.triptych ? progress(f, T.triptych, 40) : 0;
  const near = f >= T.near && f < T.far ? progress(f, T.near, 26) * (1 - progress(f, T.far - 20, 20)) : 0;
  const far = f >= T.far && f < T.settle ? progress(f, T.far, 26) * (1 - progress(f, T.settle - 20, 20)) : 0;
  const tickerPulse = f >= T.same && f < T.same + 26 ? Math.sin(((f - T.same) / 26) * Math.PI) : 0;

  const bigOp = 1 - tri;

  const triX = (i: number) => (theme.canvas.width - (TRI.w * 3 + TRI.gap * 2)) / 2 + i * (TRI.w + TRI.gap);

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          left: CARD.x,
          top: CARD.y,
          width: CARD.w,
          height: CARD.h,
          borderRadius: theme.radius.cardLg,
          background: theme.colors.cardBg,
          border: `${theme.stroke.hair}px solid ${theme.colors.border}`,
        }}
      />

      {f >= T.selector && (
        <div style={{ opacity: fadeIn(f, T.selector, 20) }}>
          <TimeframeSelector x={SEL.x} y={SEL.y} activeIndex={activeIndex} />
        </div>
      )}

      {/* the constant across every timeframe */}
      <div style={{ transform: `scale(${1 + 0.05 * tickerPulse})`, transformOrigin: `${SEL.x}px 224px` }}>
        <Chip label="BMRI" x={SEL.x} y={224} variant="slate" anchor="left" startFrame={T.ticker + 10} />
      </div>
      <Chip label="Periode Sama" x={SEL.x + 190} y={224} variant="indigo" anchor="left" startFrame={T.same} opacity={1 - tri} />

      {/* the active chart — each timeframe wipes over the previous one */}
      {bigOp > 0.001 && (
        <div style={{ opacity: bigOp }}>
          {f >= T.tf5m && to1d < 1 && (
            <div style={{ position: "absolute", inset: 0, clipPath: `inset(0px 0px 0px ${CHART.x + CHART.w * to1d}px)` }}>
              <CandlestickChart data={VIEWS[0].data} window={VIEWS[0].win} box={CHART} revealProgress={fadeIn(f, T.tf5m, 30)} />
            </div>
          )}
          {to1d > 0.001 && to1w < 1 && (
            <div style={{ position: "absolute", inset: 0, clipPath: `inset(0px 0px 0px ${CHART.x + CHART.w * to1w}px)` }}>
              <CandlestickChart data={VIEWS[1].data} window={VIEWS[1].win} box={CHART} revealProgress={to1d} />
            </div>
          )}
          {to1w > 0.001 && <CandlestickChart data={VIEWS[2].data} window={VIEWS[2].win} box={CHART} revealProgress={to1w} />}
        </div>
      )}

      {/* one summary chip per timeframe, swapped on the beat */}
      {[T.tf5m, T.tf1d, T.tf1w].map((start, i) => {
        const next = [T.tf1d, T.tf1w, T.triptych][i];
        if (f < start || f >= next) return null;
        return <Chip key={i} label={VIEWS[i].chip} x={SEL.x} y={SEL.y + 110} variant="indigo" anchor="left" startFrame={start} opacity={bigOp} />;
      })}

      {/* triptych — the three silhouettes side by side */}
      {tri > 0.001 &&
        VIEWS.map((v, i) => {
          const s = 1 + 0.05 * (i === 0 ? near : i === 2 ? far : 0);
          const box: Box = { x: triX(i) + 34, y: TRI.y + 96, w: TRI.w - 68, h: TRI.h - 150 };
          return (
            <div key={v.label} style={{ opacity: tri, transform: `scale(${s})`, transformOrigin: `${triX(i) + TRI.w / 2}px ${TRI.y + TRI.h / 2}px` }}>
              <div
                style={{
                  position: "absolute",
                  left: triX(i),
                  top: TRI.y,
                  width: TRI.w,
                  height: TRI.h,
                  borderRadius: theme.radius.card,
                  background: theme.colors.cardBg,
                  border: `${theme.stroke.hair}px solid ${theme.colors.border}`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: triX(i),
                  top: TRI.y + 26,
                  width: TRI.w,
                  textAlign: "center",
                  fontFamily: theme.type.family,
                  fontSize: theme.type.label.size,
                  fontWeight: theme.type.label.weight,
                  color: theme.colors.slate,
                }}
              >
                {v.label}
              </div>
              <CandlestickChart data={v.data} window={v.win} box={box} showAxes={false} />
            </div>
          );
        })}

      {tri > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: TRI.y + TRI.h + 56,
            width: theme.canvas.width,
            textAlign: "center",
            fontFamily: theme.type.family,
            fontSize: theme.type.header.size,
            fontWeight: theme.type.header.weight,
            color: theme.colors.slate,
            opacity: fadeIn(f, T.settle, 24),
          }}
        >
          Jarak pandang yang kamu pilih
        </div>
      )}
    </SafeArea>
  );
};
