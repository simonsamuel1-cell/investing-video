/**
 * SC18 — ASII case study (from 8555, dur 1055).
 *
 * The only real instrument in the episode, and therefore the only scene where
 * the numbers on screen are claims about the world. Every bar is currently a
 * PLACEHOLDER behind a typed interface — see data/asii.ts. This scene cannot
 * ship until the real CSV is in and all four narrated figures are checked
 * against it. If the data disagrees, the SCRIPT is what gets revised.
 *
 * The price scale is fixed to the FULL series rather than the revealed part, so
 * the chart never rescales under the viewer while the story is being told, and
 * a reference can be extended before the candles reach it.
 *
 * The countdown dramatises a moment that has already happened. No marker here
 * is an entry, and nothing on screen projects forward.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card } from "../components/Stage";
import { CandleChart, barGrid } from "../components/CandleChart";
import { PivotLabel } from "../components/PivotLabel";
import { RangeBand } from "../components/RangeBand";
import { Reference } from "../components/StructureLine";
import { CountdownNumeral } from "../components/CountdownNumeral";
import { Chip } from "../components/Chip";
import { Title, Line } from "../components/Text";
import { theme } from "../theme";
import { hold, progress, price, clamp01 } from "../helpers";
import { ASII_BARS, ASII, ASII_TICKS } from "../data/asii";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  open: 87, // "awal 2025"
  range: 123, // "bergerak sideways"
  rangeLabel: 172, // "4.400 sampai 5.000"
  breakout: 330, // "menembus area itu"
  peak: 451, // "7.300"
  freeze: 562, // "lihat puncak berikutnya"
  three: 695, // "tiga, dua"
  two: 714,
  one: 733, // "satu"
  failed: 769, // "ternyata gagal"
  lowerHigh: 795, // "lower high"
  lowerLow: 835, // "lower low"
  back: 924, // "menuju area 4.400"
};
const BOX = { x: theme.stage.plot.x, y: theme.stage.plot.y + 34, w: theme.stage.plot.w, h: theme.stage.plot.h - 100 };
/**
 * How far the plot has advanced, IN BARS, at each beat. The flat stretch from
 * `freeze` to `failed` is the hold the countdown plays over.
 */
const BAR_AT = [T.open, T.range, T.rangeLabel, T.breakout, T.peak, T.freeze, T.failed, T.failed + 24, T.lowerLow, T.lowerLow + 40, T.back, T.back + 96];
const BAR_TO = [0, 70, 100, 126, ASII.peakBar, ASII.priorLowBar + 8, ASII.priorLowBar + 8, ASII.lowerHighBar + 6, ASII.lowerHighBar + 18, ASII.lowerLowBar + 6, 350, ASII.lastBar];
const COUNTDOWN_Y = 480;
// ═══════════════════════════════════════════════════════════════════════════

const G = barGrid(ASII_BARS, BOX);

export const Scene18 = () => {
  const f = useCurrentFrame();
  const bar = hold(f, BAR_AT, BAR_TO);
  const reveal = bar / (ASII_BARS.length - 1);
  const band = f >= T.range ? progress(f, T.range, 34) : 0;
  const ref = f >= T.freeze ? progress(f, T.freeze, 30) : 0;
  const faint = f >= T.back ? progress(f, T.back, 40) : 0;

  const peak = { x: G.x(ASII.peakBar), y: G.scale(ASII.peakPrice) };
  const bandTop = G.scale(ASII.rangeHigh);

  return (
    <Stage>
      {/* identity strip — what this chart IS, stated plainly */}
      <Title text={ASII.ticker} at={0} />

      <Card>
        {/* the early-2025 range */}
        <RangeBand
          x={G.x(0) - G.slot / 2}
          w={G.x(ASII.rangeEndBar) - G.x(0) + G.slot}
          top={bandTop}
          bottom={G.scale(ASII.rangeLow)}
          tone="indigo"
          draw={band}
          label={f >= T.rangeLabel ? `${price(ASII.rangeLow)} – ${price(ASII.rangeHigh)}` : undefined}
          pierce={{ x: G.x(ASII.breakoutBar), y: bandTop, amount: f >= T.breakout ? clamp01((f - T.breakout) / 34) : 0 }}
        />
        {/* the same area, faint, as price heads back toward it */}
        {faint > 0.001 && (
          <RangeBand
            x={G.x(ASII.returnBar)}
            w={G.x(ASII.lastBar) - G.x(ASII.returnBar)}
            top={bandTop}
            bottom={G.scale(ASII.rangeLow)}
            tone="indigo"
            draw={faint}
            fill={0.06}
            opacity={0.7}
          />
        )}

        <CandleChart bars={ASII_BARS} box={BOX} reveal={reveal} ticks={ASII_TICKS} />

        {/* the peak the next push has to clear, tagged on the peak itself.
            The Lower high label is pushed right and tied back with a leader,
            which is what keeps the two apart without moving either dot. */}
        {bar >= ASII.peakBar && <Chip label={price(ASII.peakPrice)} x={peak.x} y={peak.y - 52} tone="indigo" at={T.peak} />}
        {bar >= ASII.peakBar && (
          <Line text="Awal 2026" x={peak.x} y={BOX.y + BOX.h + 34} at={T.peak + 14} size={theme.text.axis.size} color={theme.color.slate} weight={500} />
        )}
        <Reference x1={peak.x} x2={BOX.x + BOX.w} y={peak.y} draw={ref} />

        {ASII.climb.map((c, i) =>
          bar >= c.bar ? (
            <PivotLabel
              key={c.bar}
              x={G.x(c.bar)}
              y={G.scale(c.peak ? ASII_BARS[c.bar].h : ASII_BARS[c.bar].l)}
              tone={c.peak ? "indigo" : "cyan"}
              side={c.peak ? "above" : "below"}
              at={T.breakout + 30 + i * 18}
            />
          ) : null,
        )}

        {bar >= ASII.lowerHighBar + 4 && (
          <PivotLabel x={G.x(ASII.lowerHighBar)} y={G.scale(ASII_BARS[ASII.lowerHighBar].h)} label="Lower high" tone="indigo" dx={168} at={T.lowerHigh} />
        )}
        {bar >= ASII.lowerLowBar + 4 && (
          <PivotLabel x={G.x(ASII.lowerLowBar)} y={G.scale(ASII_BARS[ASII.lowerLowBar].l)} label="Lower low" tone="cyan" side="below" at={T.lowerLow} />
        )}

        {/* tension about something that already happened */}
        <CountdownNumeral value="3" x={theme.canvas.width / 2} y={COUNTDOWN_Y} at={T.three} />
        <CountdownNumeral value="2" x={theme.canvas.width / 2} y={COUNTDOWN_Y} at={T.two} />
        <CountdownNumeral value="1" x={theme.canvas.width / 2} y={COUNTDOWN_Y} at={T.one} />
      </Card>

      {f >= T.back + 40 && <Chip label="Struktur berubah" x={theme.canvas.width / 2} y={theme.stage.caption.y} tone="cyan" at={T.back + 40} />}
    </Stage>
  );
};
