/**
 * SC18 — Case study: ASII 2025–2026 (from 8555, dur 1055) — INDEPENDENT.
 *
 * The only real security in the episode, and therefore the only scene where the
 * numbers on screen are claims about the world. See data/asii.ts: every candle
 * is currently a PLACEHOLDER and the scene cannot ship until the real CSV is in
 * and all four narrated figures are checked against it.
 *
 * Two things are deliberate:
 *   · The price scale is fixed to the FULL series, not to the revealed part, so
 *     the chart never rescales under the viewer while the story is being told.
 *   · The countdown is tension about a PAST event, and the reveal is whatever
 *     the data did. Nothing here is a forecast, and no marker is an entry.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartCard } from "../components/ChartCard";
import { CandlestickChart, chartGeom } from "../components/CandlestickChart";
import { PivotMarker } from "../components/PivotMarker";
import { Band } from "../components/Band";
import { Level } from "../components/Level";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { progress, fadeIn, fmtPrice } from "../helpers";
import { asiiDaily, ASII, ASII_TICKS } from "../data/asii";
import { CARD, PLOT, CAPTION_Y } from "../layout";

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
const BOX = { x: PLOT.x, y: PLOT.y + 44, w: PLOT.w, h: PLOT.h - 120 };
const WIN: [number, number] = [0, asiiDaily.length - 1];
/**
 * How far the plot has advanced, in BARS, at each beat. The chart freezes at
 * the trough before the failed push and waits out the countdown there.
 */
const BAR_KEYS = [T.open, T.range, T.rangeLabels, T.breakout, T.peak, T.freeze, T.failed, T.failed + 24, T.ll, T.ll + 40, T.back, T.back + 96];
const BAR_VALS = [0, 70, 100, 126, ASII.peakBar, ASII.priorLow + 8, ASII.priorLow + 8, ASII.lowerHigh + 6, ASII.lowerHigh + 18, ASII.lowerLow + 6, 350, ASII.lastBar];
/** The climb's swing points, marked as the story passes them. */
const CLIMB = [
  { bar: 160, peak: true },
  { bar: 176, peak: false },
  { bar: 196, peak: true },
  { bar: 212, peak: false },
  { bar: 236, peak: true },
  { bar: 252, peak: false },
];
// ═══════════════════════════════════════════════════════════════════════════

const G = chartGeom(asiiDaily, WIN, BOX);
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Scene18 = () => {
  const pal = usePalette();
  const f = useCurrentFrame();

  const bar = interpolate(f, BAR_KEYS, BAR_VALS, { ...CLAMP, easing: theme.motion.ease });
  const reveal = bar / (asiiDaily.length - 1);
  const range = f >= T.range ? progress(f, T.range, 34) : 0;
  const ref = f >= T.freeze ? progress(f, T.freeze, 30) : 0;
  const backBand = f >= T.back ? progress(f, T.back, 40) : 0;

  const count = (start: number) => (f >= start && f < start + 22 ? progress(f, start, 10) * (1 - progress(f, start + 14, 8)) : 0);
  const numerals: [string, number][] = [
    ["3", count(T.three)],
    ["2", count(T.two)],
    ["1", count(T.one)],
  ];

  const peakPt = { x: G.cx(ASII.peakBar), y: G.scale(ASII.peak) };
  const lhPt = { x: G.cx(ASII.lowerHigh), y: G.scale(asiiDaily[ASII.lowerHigh].h) };
  const llPt = { x: G.cx(ASII.lowerLow), y: G.scale(asiiDaily[ASII.lowerLow].l) };

  return (
    <SafeArea>
      {/* identity strip — what this chart IS, stated plainly */}
      <div
        style={{
          position: "absolute",
          left: PLOT.x,
          top: 100,
          transform: "translate(0, -50%)",
          fontFamily: theme.type.family,
          fontSize: theme.type.header.size,
          fontWeight: theme.type.header.weight,
          color: pal.ink,
          opacity: fadeIn(f, 0, 18),
        }}
      >
        ASII · 1D
      </div>

      <ChartCard box={CARD}>
        {/* the early-2025 range, and the area price returns to at the end */}
        <Band
          x={G.cx(0) - G.slot / 2}
          w={G.cx(ASII.rangeEnd) - G.cx(0) + G.slot}
          yTop={G.scale(ASII.rangeHigh)}
          yBottom={G.scale(ASII.rangeLow)}
          variant="indigo"
          draw={range}
          label={f >= T.rangeLabels ? `${fmtPrice(ASII.rangeLow)} – ${fmtPrice(ASII.rangeHigh)}` : undefined}
        />
        {backBand > 0.001 && (
          <Band
            x={G.cx(360)}
            w={G.cx(ASII.lastBar) - G.cx(360)}
            yTop={G.scale(ASII.rangeHigh)}
            yBottom={G.scale(ASII.rangeLow)}
            variant="indigo"
            draw={backBand}
            fillOpacity={0.06}
            opacity={0.7}
          />
        )}

        <CandlestickChart data={asiiDaily} window={WIN} box={BOX} revealProgress={reveal} tickValues={ASII_TICKS} />

        {/* the peak the next push has to clear */}
        {/* to the LEFT of the peak — the Lower High chip lands to its right */}
        {bar >= ASII.peakBar && <Chip label={fmtPrice(ASII.peak)} x={peakPt.x - 120} y={peakPt.y - 48} variant="indigo" startFrame={T.peak} />}
        <Level x1={peakPt.x} x2={BOX.x + BOX.w} y={peakPt.y} draw={ref} variant="slate" />

        {/* the swings on the way up */}
        {CLIMB.map((c, i) => {
          const start = T.breakout + 30 + i * 18;
          return (
            bar >= c.bar && (
              <PivotMarker
                key={c.bar}
                x={G.cx(c.bar)}
                y={G.scale(c.peak ? asiiDaily[c.bar].h : asiiDaily[c.bar].l)}
                variant={c.peak ? "indigo" : "cyan"}
                side={c.peak ? "above" : "below"}
                startFrame={start}
              />
            )
          );
        })}

        {bar >= ASII.lowerHigh + 4 && <PivotMarker x={lhPt.x} y={lhPt.y} label="Lower High" variant="indigo" startFrame={T.lh} />}
        {bar >= ASII.lowerLow + 4 && <PivotMarker x={llPt.x} y={llPt.y} label="Lower Low" variant="cyan" side="below" startFrame={T.ll} />}

        {/* the countdown — tension about something that already happened */}
        {numerals.map(([n, o]) =>
          o > 0.001 ? (
            <div
              key={n}
              style={{
                position: "absolute",
                left: theme.canvas.width / 2,
                top: 470,
                transform: `translate(-50%, -50%) scale(${0.9 + 0.1 * o})`,
                fontFamily: theme.type.family,
                fontSize: theme.type.display.size,
                fontWeight: theme.type.display.weight,
                color: pal.indigo,
                opacity: o,
              }}
            >
              {n}
            </div>
          ) : null,
        )}
      </ChartCard>

      {f >= T.back + 40 && <Chip label="Struktur Berubah" x={theme.canvas.width / 2} y={CAPTION_Y} variant="cyan" startFrame={T.back + 40} />}
    </SafeArea>
  );
};
