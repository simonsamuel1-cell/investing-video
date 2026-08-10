/**
 * SC18 — ASII case study (from 8555, dur 1055).
 *
 * The only real security in the episode, and therefore the only scene where the
 * numbers on screen are claims about the world. See data/asii.ts: every candle
 * is currently a PLACEHOLDER behind a typed interface, and this scene cannot
 * ship until the real CSV is in and all four narrated figures are checked
 * against it. If the data diverges from a narrated figure, the SCRIPT is what
 * gets revised — the chart is never bent to fit the words.
 *
 * The price scale is fixed to the FULL series rather than the revealed part, so
 * the chart never rescales under the viewer while the story is being told.
 *
 * The countdown dramatises a moment that has already happened. It is not a
 * forecast, and no marker here is an entry.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea, ChartCard } from "../components/SafeArea";
import { CandleChart, candleGeom } from "../components/CandleChart";
import { PivotLabel } from "../components/PivotLabel";
import { RangeBand } from "../components/RangeBand";
import { ReferenceLine } from "../components/StructureLine";
import { CountdownNumeral } from "../components/CountdownNumeral";
import { Chip } from "../components/Chip";
import { Header } from "../components/Header";
import { theme } from "../theme";
import { progress, fmtPrice, clamp01 } from "../helpers";
import { asiiDaily, ASII, ASII_TICKS } from "../data/asii";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  open: 87, // "awal 2025"
  range: 123, // "bergerak sideways"
  rangeLabels: 172, // "4.400 sampai 5.000"
  breakout: 330, // "menembus area itu"
  peak: 451, // "7.300"
  freeze: 562, // "lihat puncak berikutnya"
  three: 695, // "tiga, dua"
  two: 714,
  one: 733, // "satu"
  failed: 769, // "ternyata gagal"
  lh: 795, // "lower high"
  ll: 835, // "lower low"
  back: 924, // "menuju area 4.400"
};
const BOX = { x: theme.frame.plot.x, y: theme.frame.plot.y + 44, w: theme.frame.plot.w, h: theme.frame.plot.h - 120 };
/**
 * How far the plot has advanced, in BARS, at each beat. The flat stretch from
 * `freeze` to `failed` is the hold the countdown plays over.
 */
const BAR_KEYS = [T.open, T.range, T.rangeLabels, T.breakout, T.peak, T.freeze, T.failed, T.failed + 24, T.ll, T.ll + 40, T.back, T.back + 96];
const BAR_VALS = [0, 70, 100, 126, ASII.peakBar, ASII.priorLow + 8, ASII.priorLow + 8, ASII.lowerHigh + 6, ASII.lowerHigh + 18, ASII.lowerLow + 6, 350, ASII.lastBar];
/** The swing points on the way up, marked as the story passes them. */
const CLIMB = [
  { bar: 160, peak: true },
  { bar: 176, peak: false },
  { bar: 196, peak: true },
  { bar: 212, peak: false },
  { bar: 236, peak: true },
  { bar: 252, peak: false },
];
const COUNTDOWN_Y = 470;
const FAINT_BAND_FROM = 360;
// ═══════════════════════════════════════════════════════════════════════════

const WIN: [number, number] = [0, asiiDaily.length - 1];
const G = candleGeom(asiiDaily, WIN, BOX);
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Scene18 = () => {
  const f = useCurrentFrame();
  const bar = interpolate(f, BAR_KEYS, BAR_VALS, { ...CLAMP, easing: theme.motion.ease });
  const reveal = bar / (asiiDaily.length - 1);
  const range = f >= T.range ? progress(f, T.range, 34) : 0;
  const ref = f >= T.freeze ? progress(f, T.freeze, 30) : 0;
  const backBand = f >= T.back ? progress(f, T.back, 40) : 0;

  const peakPt = { x: G.cx(ASII.peakBar), y: G.scale(ASII.peak) };
  const bandTopY = G.scale(ASII.rangeHigh);

  return (
    <SafeArea>
      {/* identity strip — what this chart IS, stated plainly */}
      <Header title="ASII · 1D" startFrame={0} />

      <ChartCard>
        {/* the early-2025 range */}
        <RangeBand
          x={G.cx(0) - G.slot / 2}
          w={G.cx(ASII.rangeEnd) - G.cx(0) + G.slot}
          yTop={bandTopY}
          yBottom={G.scale(ASII.rangeLow)}
          variant="indigo"
          draw={range}
          label={f >= T.rangeLabels ? `${fmtPrice(ASII.rangeLow)} – ${fmtPrice(ASII.rangeHigh)}` : undefined}
          pierce={{ x: G.cx(ASII.breakout), y: bandTopY, amount: f >= T.breakout ? clamp01((f - T.breakout) / 34) : 0 }}
        />
        {/* the same area, faint, as price heads back toward it */}
        {backBand > 0.001 && (
          <RangeBand
            x={G.cx(FAINT_BAND_FROM)}
            w={G.cx(ASII.lastBar) - G.cx(FAINT_BAND_FROM)}
            yTop={bandTopY}
            yBottom={G.scale(ASII.rangeLow)}
            variant="indigo"
            draw={backBand}
            fillOpacity={0.06}
            opacity={0.7}
          />
        )}

        <CandleChart data={asiiDaily} window={WIN} box={BOX} reveal={reveal} tickValues={ASII_TICKS} />

        {/* the peak the next push has to clear — tag LEFT of it, so the Lower
            High chip that lands to its right can never collide with it */}
        {bar >= ASII.peakBar && <Chip label={fmtPrice(ASII.peak)} x={peakPt.x - 120} y={peakPt.y - 48} variant="indigo" startFrame={T.peak} />}
        <ReferenceLine x1={peakPt.x} x2={BOX.x + BOX.w} y={peakPt.y} draw={ref} />

        {CLIMB.map((c, i) =>
          bar >= c.bar ? (
            <PivotLabel
              key={c.bar}
              x={G.cx(c.bar)}
              y={G.scale(c.peak ? asiiDaily[c.bar].h : asiiDaily[c.bar].l)}
              variant={c.peak ? "indigo" : "cyan"}
              side={c.peak ? "above" : "below"}
              startFrame={T.breakout + 30 + i * 18}
            />
          ) : null,
        )}

        {bar >= ASII.lowerHigh + 4 && (
          <PivotLabel x={G.cx(ASII.lowerHigh)} y={G.scale(asiiDaily[ASII.lowerHigh].h)} label="Lower High" variant="indigo" startFrame={T.lh} />
        )}
        {bar >= ASII.lowerLow + 4 && (
          <PivotLabel x={G.cx(ASII.lowerLow)} y={G.scale(asiiDaily[ASII.lowerLow].l)} label="Lower Low" variant="cyan" side="below" startFrame={T.ll} />
        )}

        {/* tension about something that already happened */}
        <CountdownNumeral value="3" x={theme.canvas.width / 2} y={COUNTDOWN_Y} startFrame={T.three} />
        <CountdownNumeral value="2" x={theme.canvas.width / 2} y={COUNTDOWN_Y} startFrame={T.two} />
        <CountdownNumeral value="1" x={theme.canvas.width / 2} y={COUNTDOWN_Y} startFrame={T.one} />
      </ChartCard>

      {f >= T.back + 40 && <Chip label="Struktur Berubah" x={theme.canvas.width / 2} y={theme.frame.captionY} variant="cyan" startFrame={T.back + 40} />}
    </SafeArea>
  );
};
