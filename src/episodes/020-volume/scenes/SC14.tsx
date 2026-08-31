/**
 * SC14 — the same reading, downward. `from 10411 · dur 790`
 *
 * Two breakdowns of ONE tape: the same support broken by the same candle, once
 * on heavy volume and once on thin. Only the histogram differs, which is the
 * whole point — and it is the mirror of what SC02 did with the breakout, so the
 * viewer is being shown that the reading is a method, not a special case.
 *
 * ⚠ ONE DOMAIN, BUILT FROM BOTH SIDES. Left to itself each chart normalises to
 * its own range, which is how a split screen quietly rigs the question it is
 * asking. Both grids get `DOWN_DOMAIN`, and both histograms the same peak.
 */
import {
  Stage, Card, Chart, VolumeBars, Level, Chip, Title, KeyPoint, SourceTag,
  SplitDivider, SplitLabels, gridOf, useMotion, theme,
} from "../../../core";
import { BLOCK, BEAT, local } from "../data/timing";
import { TAG_Y, GAP, halves, panes } from "../data/layout";
import { DOWN, DOWN_DOMAIN, SUPPORT, VOL_HEAVY, VOL_THIN } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC14;
const T = {
  open: local(BEAT.breakdownToo, FROM),
  heavy: local(BEAT.bigVolume, FROM),
  thin: local(BEAT.thinVolume, FROM),
  wait: local(BEAT.notCertain, FROM),
};
// ═══════════════════════════════════════════════════════════════════════════

const [L, R] = halves();
const SIDE = { left: panes(L, 0.18), right: panes(R, 0.18) };
const GL = gridOf(DOWN.closes, DOWN_DOMAIN, SIDE.left.price, 0.12, 0);
const GR = gridOf(DOWN.closes, DOWN_DOMAIN, SIDE.right.price, 0.12, 0);
const PEAK = Math.max(...VOL_HEAVY);

export const SC14 = () => {
  const m = useMotion();
  return (
    <Stage>
      <Card />
      <SourceTag kind={DOWN.kind} y={TAG_Y} />
      <Title text="Logika yang sama pada breakdown" at={T.open} />
      <SplitDivider at={T.open} over={m.sec(0.7)} />
      <SplitLabels left="Volume besar" right="Volume tipis" at={T.open} gap={GAP} />
      {[
        { g: GL, pane: SIDE.left, v: VOL_HEAVY, at: T.heavy, read: "Tekanan jual lebih serius", tone: "indigo" as const },
        { g: GR, pane: SIDE.right, v: VOL_THIN, at: T.thin, read: "Konfirmasinya lebih lemah", tone: "slate" as const },
      ].map((s, k) => (
        <div key={k}>
          <Chart series={DOWN} grid={s.g} at={T.open} over={m.sec(1.1)} tickLabels={false} />
          {/* one peak for both, so "besar" and "tipis" are a real comparison */}
          <VolumeBars bars={DOWN.bars} volume={s.v} grid={s.g} box={s.pane.vol} peak={PEAK} />
          <Level value={SUPPORT} grid={s.g} at={T.open + m.sec(0.6)} over={m.sec(0.6)} label={k === 0 ? "Support" : undefined} broken />
          <Chip
            label={s.read}
            x={s.pane.price.x + s.pane.price.w / 2}
            y={s.pane.vol.y + s.pane.vol.h + theme.text.chip.size}
            at={s.at}
            tone={s.tone}
          />
        </div>
      ))}
      <KeyPoint
        text="Tetap waspada, tanpa langsung menyimpulkan"
        at={T.wait}
        rect={{ x: theme.stage.card.x, y: theme.stage.caption.y - theme.text.title.size, w: theme.stage.card.w, h: theme.text.title.size * 2 }}
      />
    </Stage>
  );
};
