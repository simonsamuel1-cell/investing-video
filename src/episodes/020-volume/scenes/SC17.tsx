/**
 * SC17 — one spike, three contexts. `from 15355 · dur 1238`
 *
 * ⚠ THE SPIKE IS ONE ARRAY, USED THREE TIMES. "Satu spike yang sama ditampilkan
 * dalam tiga konteks" — if each context got its own volume, the scene would be
 * showing three spikes and calling them one. The histogram is identical in all
 * three; only the price around it changes, and so does what it means.
 */
import { useCurrentFrame } from "remotion";
import {
  Stage, Card, Chart, VolumeBars, HighlightBox, Chip, Title, KeyPoint,
  SourceTag, gridOf, useMotion, theme,
} from "../../../core";
import { BLOCK, BEAT, local } from "../data/timing";
import { PRICE, VOL, TAG_Y } from "../data/layout";
import { UP, DOWN, UP_DOMAIN, DOWN_DOMAIN, SPIKE_VOL, SPIKE_AT, MAIN, MAIN_DOMAIN } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC17;
const T = {
  context: local(BEAT.context, FROM),
  spike: local(BEAT.spike, FROM),
  usual: local(BEAT.thanUsual, FROM),
  near: local(BEAT.nearBreakout, FROM),
  rally: local(BEAT.afterRally, FROM),
  drop: local(BEAT.sharpDrop, FROM),
};
// ═══════════════════════════════════════════════════════════════════════════

/** Three tapes, one spike. Each grid is built on its own tape's domain because
 *  the three never share a frame. */
const CTX = [
  { at: 0, series: MAIN, domain: MAIN_DOMAIN, label: "Di dekat breakout", read: "Bisa jadi konfirmasi", tone: "indigo" as const },
  { at: 0, series: UP, domain: UP_DOMAIN, label: "Setelah rally panjang", read: "Bisa jadi profit taking", tone: "slate" as const },
  { at: 0, series: DOWN, domain: DOWN_DOMAIN, label: "Saat harga jatuh tajam", read: "Bisa jadi panic selling", tone: "slate" as const },
];
const GRIDS = CTX.map((c) => gridOf(c.series.closes, c.domain, PRICE, 0.12, 96));
const PEAK = Math.max(...SPIKE_VOL);

export const SC17 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const beats = [T.near, T.rally, T.drop];
  let k = 0;
  beats.forEach((b, i) => {
    if (f >= b) k = i;
  });
  const c = CTX[k];
  const g = GRIDS[k];
  const spikeVol = SPIKE_VOL.slice(0, c.series.bars.length);

  return (
    <Stage>
      <Card />
      <SourceTag kind={c.series.kind} y={TAG_Y} />
      <Title text="Volume spike" at={T.spike} />
      <Chart key={`c${k}`} series={c.series} grid={g} at={beats[k]} over={m.sec(1.0)} tickLabels={false} />
      <VolumeBars key={`v${k}`} bars={c.series.bars} volume={spikeVol} grid={g} box={VOL} peak={PEAK} />
      {/* the same bar, marked in every context — it never moves */}
      <HighlightBox
        rect={{ x1: g.x(SPIKE_AT) - g.slot * 1.6, x2: g.x(SPIKE_AT) + g.slot * 1.6, y1: VOL.y, y2: VOL.y + VOL.h }}
        grow={1}
      />
      <Chip label={c.label} x={theme.stage.card.x + 40} y={PRICE.y - theme.text.chip.size} at={beats[k]} anchor="left" pill />
      <Chip label={c.read} x={theme.canvas.width / 2} y={theme.stage.caption.y} at={beats[k] + m.sec(1.0)} tone={c.tone} />
      {f >= T.drop + m.sec(1.6) && (
        <KeyPoint
          text="Spike yang sama, konteks berbeda"
          at={T.drop + m.sec(1.6)}
          rect={{ x: theme.stage.card.x, y: theme.stage.card.y + theme.stage.card.h * 0.06, w: theme.stage.card.w, h: theme.text.title.size * 2 }}
        />
      )}
    </Stage>
  );
};
