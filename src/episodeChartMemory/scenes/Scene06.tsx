/**
 * SC06 — One Stock, Three Timeframes (from 3008, dur 712) — INDEPENDENT.
 * A TimeframeSelector drives the same stock through 5M → 1D → 1W with a
 * mask-wipe between each, then the three views resolve into a triptych so the
 * differing silhouettes read side by side.
 * TODO [NEEDS DATA: 5-minute intraday (two sessions) + weekly OHLC;
 * weekly may be derived from daily]
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { CandlestickChart } from "../components/CandlestickChart";
import { TimeframeSelector } from "../components/TimeframeSelector";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fadeIn, cardBreath, type Box } from "../helpers";
import { bmriDaily, bmri5m, bmriWeekly, WIN } from "../data/bmri";
import { usePalette } from "../palette";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
// Card top clears the 150px logo zone.
const CARD: Box = { x: 96, y: 160, w: 1728, h: 812 };
const CHART: Box = { x: 200, y: 370, w: 1520, h: 430 };
// One row: [ABCD] [5m][1D][1W]. The ticker chip used to sit ON the selector's
// first segment, which is why "5m" was invisible.
// The ticker is FICTIONAL: the VO never names a stock (0 hits for "BMRI" in
// the subtitle track) and the series is still a seeded placeholder, so a made
// -up code is the honest label until real data lands.
const TICKER = { x: 160, y: 224, w: 150 };
const SEL = { x: TICKER.x + TICKER.w + 12, y: 196 };
// ── HANDOFF from SC05 ───────────────────────────────────────────────────────
// At global 3007 the only thing on screen is ChartContinuity's candle series:
// BMRI daily over WIN.sc03, in this box, dimmed to this opacity. This scene
// opens by drawing exactly that, then carries it into the card. Match these to
// ChartContinuity's BOX_FULL and its phase-D dim, or the seam will show.
const HANDOFF_BOX: Box = { x: 260, y: 250, w: 1400, h: 540 };
const HANDOFF_DIM = 0.3;
const T = {
  ticker: 0, // "saham yang sama" — the constant, pinned all scene
  carry: 0, // the carried series eases into the card…
  carryDur: 46, // …and comes back to full brightness
  selector: 51, // "dalam timeframe berbeda"
  tf5m: 107,
  span5m: 150, // "merangkum 5 menit transaksi"
  tf1d: 195,
  tf1w: 274,
  weekSpan: 339, // "perdagangan" — one weekly swallows five dailies
  triptych: 443, // "bisa terasa sangat berbeda"
  near: 534, // "seberapa dekat"
  far: 599, // "atau seberapa jauh"
  settle: 643, // "kamu memilih untuk melihatnya"
};
const WIPE = 24; // pergantian timeframe — dipercepat dari 44
const TRI = { y: 330, w: 520, h: 380, gap: 24 };
// ── HANDOFF to SC07 ─────────────────────────────────────────────────────────
// The 5M triptych card IS SC07's left card, only smaller. Over these frames the
// other two cards and all the chrome clear, and this one grows into SC07's
// geometry — so global 3719 and 3720 are the same picture. Match SC07's LEFT
// box and its inner() inset, or the seam will show.
const HAND = { start: 660, dur: 51 }; // ends on this scene's last frame (711)
const SC07_CARD: Box = { x: 96, y: 250, w: 852, h: 490 };
const SC07_CHART: Box = { x: 140, y: 306, w: 682, h: 380 };
// ═══════════════════════════════════════════════════════════════════════════

const VIEWS = [
  { label: "5m", data: bmri5m, win: [0, bmri5m.length - 1] as [number, number] },
  { label: "1D", data: bmriDaily, win: [bmriDaily.length - 60, bmriDaily.length - 1] as [number, number] },
  { label: "1W", data: bmriWeekly, win: [bmriWeekly.length - 30, bmriWeekly.length - 1] as [number, number] },
];

export const Scene06 = () => {
  const pal = usePalette();
  const f = useCurrentFrame();

  // the series carried over from SC05: eases into the card, comes back up to
  // full brightness, then the 5m view wipes over it
  const carry = progress(f, T.carry, T.carryDur);
  const carriedBox: Box = {
    x: HANDOFF_BOX.x + (CHART.x - HANDOFF_BOX.x) * carry,
    y: HANDOFF_BOX.y + (CHART.y - HANDOFF_BOX.y) * carry,
    w: HANDOFF_BOX.w + (CHART.w - HANDOFF_BOX.w) * carry,
    h: HANDOFF_BOX.h + (CHART.h - HANDOFF_BOX.h) * carry,
  };
  const carriedDim = HANDOFF_DIM + (1 - HANDOFF_DIM) * carry;

  const to5m = f >= T.tf5m ? progress(f, T.tf5m, WIPE) : 0;
  const to1d = f >= T.tf1d ? progress(f, T.tf1d, WIPE) : 0;
  const to1w = f >= T.tf1w ? progress(f, T.tf1w, WIPE) : 0;
  const activeIndex = to1d + to1w; // 0 → 1 → 2, slides with the wipes
  const tri = f >= T.triptych ? progress(f, T.triptych, 40) : 0;
  const near = f >= T.near && f < T.far ? progress(f, T.near, 26) * (1 - progress(f, T.far - 20, 20)) : 0;
  const far = f >= T.far && f < T.settle ? progress(f, T.far, 26) * (1 - progress(f, T.settle - 20, 20)) : 0;

  // Price labels sit to the RIGHT of the box, outside the wipe's clip, so during
  // a changeover BOTH charts' labels were on screen at once and stacked. Each
  // chart's axes now leave early and arrive late, so only one set is ever up.
  const axesIn = (t: number) => Math.max(0, Math.min(1, t * 3 - 2));
  const axesOut = (t: number) => Math.max(0, 1 - t * 3);

  const bigOp = 1 - tri;

  const triX = (i: number) => (theme.canvas.width - (TRI.w * 3 + TRI.gap * 2)) / 2 + i * (TRI.w + TRI.gap);

  // ── handoff to SC07: the 5M card grows into SC07's left card ──
  const hand = f >= HAND.start ? progress(f, HAND.start, HAND.dur) : 0;
  const lerp = (a: number, b: number) => a + (b - a) * hand;
  const lerpBox = (a: Box, b: Box): Box => ({ x: lerp(a.x, b.x), y: lerp(a.y, b.y), w: lerp(a.w, b.w), h: lerp(a.h, b.h) });
  const clearing = 1 - hand; // everything except that one card steps aside
  // panel #4 — mengecil; berhenti sebelum triptych mengambil alih
  const cardScale = cardBreath(4, f, 0, T.triptych);

  return (
    <SafeArea>
      {/* the panel and the chart it backs drift together */}
      <div style={{ transform: `scale(${cardScale})`, transformOrigin: `${CARD.x + CARD.w / 2}px ${CARD.y + CARD.h / 2}px` }}>
      <div
        style={{
          position: "absolute",
          left: CARD.x,
          top: CARD.y,
          width: CARD.w,
          height: CARD.h,
          borderRadius: theme.radius.cardLg,
          background: pal.cardBg,
          border: `${theme.stroke.hair}px solid ${pal.border}`,
          // arrives behind the carried series rather than popping in on frame 0
          opacity: carry * clearing,
        }}
      />

      {f >= T.selector && (
        <div style={{ opacity: fadeIn(f, T.selector, 20) * clearing }}>
          {/* the track is up before any timeframe is chosen — the fill only
              lands once the 5m view actually arrives */}
          <TimeframeSelector x={SEL.x} y={SEL.y} activeIndex={activeIndex} fillOpacity={f >= T.tf5m ? fadeIn(f, T.tf5m, 14) : 0} />
        </div>
      )}

      {/* the constant across every timeframe — sits still; no pulse */}
      <Chip label="ABCD" x={TICKER.x} y={TICKER.y} variant="slate" anchor="left" width={TICKER.w} startFrame={T.ticker + 10} opacity={clearing} />

      {/* the active chart — each timeframe wipes over the previous one */}
      {bigOp > 0.001 && (
        <div style={{ opacity: bigOp }}>
          {/* SC05's series, still the same element the viewer was looking at */}
          {to5m < 1 && (
            <div style={{ position: "absolute", inset: 0, clipPath: `inset(0px 0px 0px ${CHART.x + CHART.w * to5m}px)` }}>
              <CandlestickChart data={bmriDaily} window={WIN.sc03} box={carriedBox} showAxes={false} dimOpacity={carriedDim} />
            </div>
          )}
          {f >= T.tf5m && to1d < 1 && (
            <div style={{ position: "absolute", inset: 0, clipPath: `inset(0px 0px 0px ${CHART.x + CHART.w * to1d}px)` }}>
              <CandlestickChart data={VIEWS[0].data} window={VIEWS[0].win} box={CHART} revealProgress={to5m} axesOpacity={axesIn(to5m) * axesOut(to1d)} />
            </div>
          )}
          {to1d > 0.001 && to1w < 1 && (
            <div style={{ position: "absolute", inset: 0, clipPath: `inset(0px 0px 0px ${CHART.x + CHART.w * to1w}px)` }}>
              <CandlestickChart data={VIEWS[1].data} window={VIEWS[1].win} box={CHART} revealProgress={to1d} axesOpacity={axesIn(to1d) * axesOut(to1w)} />
            </div>
          )}
          {to1w > 0.001 && (
            <CandlestickChart data={VIEWS[2].data} window={VIEWS[2].win} box={CHART} revealProgress={to1w} axesOpacity={axesIn(to1w)} />
          )}
        </div>
      )}
      </div>

      {/* triptych — the three silhouettes side by side */}
      {tri > 0.001 &&
        VIEWS.map((v, i) => {
          const s = 1 + 0.05 * (i === 0 ? near : i === 2 ? far : 0);
          const lead = i === 0; // the card that carries over into SC07
          const card: Box = lead
            ? lerpBox({ x: triX(0), y: TRI.y, w: TRI.w, h: TRI.h }, SC07_CARD)
            : { x: triX(i), y: TRI.y, w: TRI.w, h: TRI.h };
          const box: Box = lead
            ? lerpBox({ x: triX(0) + 34, y: TRI.y + 96, w: TRI.w - 68, h: TRI.h - 150 }, SC07_CHART)
            : { x: triX(i) + 34, y: TRI.y + 96, w: TRI.w - 68, h: TRI.h - 150 };
          return (
            <div
              key={v.label}
              style={{
                opacity: tri * (lead ? 1 : clearing),
                transform: `scale(${s})`,
                transformOrigin: `${triX(i) + TRI.w / 2}px ${TRI.y + TRI.h / 2}px`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: card.x,
                  top: card.y,
                  width: card.w,
                  height: card.h,
                  borderRadius: lead ? lerp(theme.radius.card, theme.radius.cardLg) : theme.radius.card,
                  background: pal.cardBg,
                  border: `${theme.stroke.hair}px solid ${pal.border}`,
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
                  color: pal.slate,
                  opacity: lead ? clearing : 1,
                }}
              >
                {v.label}
              </div>
              {/* the lead card's axes fade in as it grows — SC07 draws them */}
              <CandlestickChart data={v.data} window={v.win} box={box} showAxes={lead} axesOpacity={lead ? hand : 0} />
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
            color: pal.slate,
            opacity: fadeIn(f, T.settle, 24) * clearing,
          }}
        >
          Jarak pandang yang kamu pilih
        </div>
      )}
    </SafeArea>
  );
};
