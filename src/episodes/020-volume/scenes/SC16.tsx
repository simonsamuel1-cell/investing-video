/**
 * SC16 — the health of a trend. `from 14449 · dur 906`
 *
 * ⚠ THE VOLUME HERE IS DERIVED FROM THE PRICE, not designed: a bar that closed
 * up gets rally volume, one that closed down gets pullback volume. The scene's
 * claim is exactly that pattern, so letting the data make it is stronger than
 * writing a caption that asserts it — and data/series.ts asserts the two means
 * really do differ, so the picture cannot quietly stop agreeing.
 */
import {
  Stage, Card, Chart, VolumeBars, Chip, Title, KeyPoint, SourceTag,
  gridOf, useMotion, theme,
} from "../../../core";
import { BLOCK, BEAT, local } from "../data/timing";
import { PRICE, VOL, TAG_Y } from "../data/layout";
import { UP, UP_DOMAIN, HEALTHY_VOL } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC16;
const T = {
  chart: 0,
  health: local(BEAT.trendHealth, FROM),
  healthy: local(BEAT.healthyUptrend, FROM),
  strong: local(BEAT.strongerVolume, FROM),
  pull: local(BEAT.pullback, FROM),
  light: local(BEAT.lighterVolume, FROM),
};
// ═══════════════════════════════════════════════════════════════════════════
const G = gridOf(UP.closes, UP_DOMAIN, PRICE, 0.12, 96);
const PEAK = Math.max(...HEALTHY_VOL);
/** The busiest rally bar and the quietest pullback bar, FOUND — the two the
 *  scene points at are whichever ones the data actually makes the case with. */
const RALLY = HEALTHY_VOL.indexOf(Math.max(...HEALTHY_VOL));
const BACK = HEALTHY_VOL.indexOf(Math.min(...HEALTHY_VOL));

export const SC16 = () => {
  const m = useMotion();
  return (
    <Stage>
      <Card />
      <SourceTag kind={UP.kind} y={TAG_Y} />
      <Title text="Membaca kesehatan trend" at={T.health} />
      <Chart series={UP} grid={G} at={T.chart} over={m.sec(2.2)} />
      <VolumeBars bars={UP.bars} volume={HEALTHY_VOL} grid={G} box={VOL} peak={PEAK} />
      <Chip label="Rally — volume lebih kuat" x={G.x(RALLY)} y={VOL.y - theme.text.chip.size} at={T.strong} />
      <Chip label="Pullback — volume lebih ringan" x={G.x(BACK)} y={VOL.y - theme.text.chip.size} at={T.light} tone="slate" />
      <KeyPoint
        text="Uptrend sehat: dorongan ramai, koreksi sepi"
        at={T.light + m.sec(1.2)}
        rect={{ x: theme.stage.card.x, y: theme.stage.caption.y - theme.text.title.size, w: theme.stage.card.w, h: theme.text.title.size * 2 }}
      />
    </Stage>
  );
};
