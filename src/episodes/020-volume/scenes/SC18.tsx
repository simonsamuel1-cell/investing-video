/**
 * SC18 — the colour misconception. `from 16593 · dur 1167`
 *
 * ⚠ THIS IS THE ONE SCENE THAT EARNS THE COLOUR RULE. Green and red belong to
 * candle bodies, wicks and volume bars and nowhere else — and the reason volume
 * bars are on that list is exactly what this scene teaches: a volume bar is its
 * own candle RESTATED, so it takes that candle's colour. It is not a claim
 * about who was buying.
 *
 * The legend prints the actual values because here the colour IS the subject.
 * It still reads them out of the palette, so it cannot drift from the chart
 * standing next to it.
 */
import { useCurrentFrame } from "remotion";
import {
  Stage, Card, Chart, VolumeBars, ColorKey, Chip, Title, KeyPoint, SourceTag,
  usePalette, gridOf, useMotion, progress, theme,
} from "../../../core";
import { BLOCK, BEAT, local } from "../data/timing";
import { TAG_Y } from "../data/layout";
import { COLOUR, COLOUR_VOL } from "../data/series";
import { domainOf } from "../../../core";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC18;
const T = {
  misread: local(BEAT.misread, FROM),
  colour: local(BEAT.barColour, FROM),
  follows: local(BEAT.followsCandle, FROM),
  onlyBuying: local(BEAT.onlyBuying, FROM),
  both: local(BEAT.buyerAndSeller, FROM),
};
// ═══════════════════════════════════════════════════════════════════════════

const CARD = theme.stage.card;
const CHART = { x: CARD.x + 56, y: CARD.y + 76, w: CARD.w * 0.52, h: CARD.h * 0.44 };
const VOLBOX = { x: CHART.x, y: CHART.y + CHART.h + CARD.h * 0.06, w: CHART.w, h: CARD.h * 0.2 };
const KEY = { x: CARD.x + CARD.w * 0.62, y: CARD.y + CARD.h * 0.28, w: CARD.w * 0.34, h: CARD.h * 0.22 };
const G = gridOf(COLOUR.closes, domainOf(COLOUR.closes, COLOUR.bars), CHART, 0.12, 0);
const PEAK = Math.max(...COLOUR_VOL);

export const SC18 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  return (
    <Stage>
      <Card />
      <SourceTag kind={COLOUR.kind} y={TAG_Y} />
      <Title text="Warna volume bar" at={T.colour} />
      <Chart series={COLOUR} grid={G} at={T.colour} over={m.sec(1.0)} tickLabels={false} />
      <VolumeBars bars={COLOUR.bars} volume={COLOUR_VOL} grid={G} box={VOLBOX} peak={PEAK} />
      <Chip label="Candle" x={CHART.x} y={CHART.y - theme.text.chip.size} at={T.colour} anchor="left" tone="slate" />
      <Chip label="Volume bar" x={VOLBOX.x} y={VOLBOX.y + VOLBOX.h + theme.text.chip.size} at={T.follows} anchor="left" tone="slate" />

      <ColorKey
        entries={[
          { name: "Candle naik", color: c.candleGreen },
          { name: "Volume-nya", color: c.candleGreen },
          { name: "Candle turun", color: c.candleRed },
          { name: "Volume-nya", color: c.candleRed },
        ]}
        rect={KEY}
        at={T.follows}
      />

      <Chip
        label="Volume hijau = pembelian saja"
        x={theme.canvas.width / 2}
        y={CARD.y + CARD.h * 0.74}
        at={T.onlyBuying}
        tone="slate"
        strike={progress(f, T.onlyBuying + m.sec(0.6), m.sec(0.5))}
      />
      <KeyPoint
        text="Setiap transaksi punya pembeli dan penjual"
        sub="Warnanya cuma mengikuti candle-nya"
        at={T.both}
        rect={{ x: CARD.x, y: CARD.y + CARD.h * 0.82, w: CARD.w, h: theme.text.title.size * 2 }}
      />
    </Stage>
  );
};
