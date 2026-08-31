/**
 * CG-B — SC03 · SC04 · SC05 · SC06. `from 1460 · dur 3434`
 *
 * PART 01, and one panel carried through it: a price pane with a volume pane
 * under it, sharing an x axis, so "satu candle ↔ satu volume bar" stays true
 * for four scenes instead of being asserted once and rebuilt three times.
 *
 * The four claims, in order:
 *   SC03  a volume bar counts SHARES over ONE PERIOD — and the period is the
 *         timeframe, which is why the tabs are there and why the chart under
 *         them does not change when the label does
 *   SC04  volume is not a headcount
 *   SC05  a bar means nothing alone — and the two histograms MUST share a
 *         y-scale, or the scene argues the opposite of its narration
 *   SC06  so read them together
 */
import { useCurrentFrame } from "remotion";
import {
  Stage, Card, Chart, VolumeBars, Crosshair, Chip, Title, Line, Words, KeyPoint,
  SourceTag, StatStrip, TimeframeTabs, Panel, splitRects,
  gridOf, domainOf, useMotion, progress, theme,
} from "../../../core";
import { BLOCK, BEAT, local } from "../data/timing";
import { PRICE, VOL, TAG_Y, GAP, halves, panes } from "../data/layout";
import {
  PAIR, PAIR_VOL, PAIR_AT,
  STOCK_A, STOCK_B, VOL_A, VOL_B, VOL_PEAK, TODAY, AVG_A, AVG_B,
} from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC03;
const T = {
  pair: local(BEAT.whatIsVolume, FROM),
  period: local(BEAT.onePeriod, FROM),
  daily: local(BEAT.daily, FROM),
  fiveMin: local(BEAT.fiveMin, FROM),
  sc04: local(BLOCK.SC04, FROM),
  notPeople: local(BEAT.notPeople, FROM),
  bigPlayers: local(BEAT.bigPlayers, FROM),
  notHowMany: local(BEAT.notHowMany, FROM),
  sc05: local(BLOCK.SC05, FROM),
  alone: local(BEAT.alone, FROM),
  tenMillion: local(BEAT.tenMillion, FROM),
  elsewhere: local(BEAT.normalElsewhere, FROM),
  average: local(BEAT.average, FROM),
  sc06: local(BLOCK.SC06, FROM),
  priceWhere: local(BEAT.priceWhere, FROM),
  volumeHow: local(BEAT.volumeHow, FROM),
  together: local(BEAT.together, FROM),
};
// ═══════════════════════════════════════════════════════════════════════════

const PAIR_DOMAIN = domainOf(PAIR.closes, PAIR.bars);
const G = gridOf(PAIR.closes, PAIR_DOMAIN, PRICE, 0.12, 96);
const PAIR_PEAK = Math.max(...PAIR_VOL);

/* SC05's two stocks, side by side. ⚠ ONE domain for the prices AND one peak
   for the histograms — see the header. */
const [L, R] = halves();
const SIDE = { left: panes(L, 0.2), right: panes(R, 0.2) };
const FIVE_DOMAIN = domainOf(
  [...STOCK_A.closes, ...STOCK_B.closes],
  [...STOCK_A.bars, ...STOCK_B.bars],
);
const GA = gridOf(STOCK_A.closes, FIVE_DOMAIN, SIDE.left.price, 0.12, 0);
const GB = gridOf(STOCK_B.closes, FIVE_DOMAIN, SIDE.right.price, 0.12, 0);
const volY = (box: { y: number; h: number }, v: number) => box.y + box.h - (v / VOL_PEAK) * box.h;

const juta = (n: number) => `${n} juta`;

export const UnderstandGroup = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const isFive = f >= T.fiveMin;

  /* ── SC05 · SC06 own the frame outright ─────────────────────────────── */
  if (f >= T.sc05 && f < T.sc06) {
    return (
      <Stage>
        <Card />
        <SourceTag kind={STOCK_A.kind} y={TAG_Y} />
        <Title text="Volume itu relatif" at={T.alone} />
        {[
          { g: GA, pane: SIDE.left, s: STOCK_A, v: VOL_A, avg: AVG_A, name: "Saham A", read: "Jauh di atas biasanya", tone: "indigo" as const },
          { g: GB, pane: SIDE.right, s: STOCK_B, v: VOL_B, avg: AVG_B, name: "Saham B", read: "Biasa saja", tone: "slate" as const },
        ].map((s, k) => (
          <div key={s.name}>
            <Chart series={s.s} grid={s.g} at={T.alone + m.sec(0.3 * k)} over={m.sec(0.6)} tickLabels={false} baseline={false} />
            {/* ⚠ peak={VOL_PEAK} ON BOTH. Without it each histogram normalises
                to its own maximum and the two draw an identical tallest bar,
                which is precisely the misreading this scene exists to correct. */}
            <VolumeBars bars={s.s.bars} volume={s.v} grid={s.g} box={s.pane.vol} peak={VOL_PEAK} />
            <div
              style={{
                position: "absolute",
                left: s.pane.vol.x,
                top: volY(s.pane.vol, s.avg),
                width: s.pane.vol.w,
                height: theme.shape.hairline,
                background: theme.color.slate,
                opacity: progress(f, T.average, m.reveal),
              }}
            />
            <Chip label={s.name} x={s.pane.price.x} y={s.pane.price.y - theme.text.chip.size} at={T.alone + m.sec(0.3 * k)} anchor="left" pill />
            <Chip
              label={`Hari ini ${juta(s.v[TODAY])} lembar`}
              x={s.pane.price.x + s.pane.price.w / 2}
              y={s.pane.vol.y + s.pane.vol.h + theme.text.chip.size}
              at={T.tenMillion + m.sec(0.3 * k)}
            />
            <Chip
              label={s.read}
              x={s.pane.price.x + s.pane.price.w / 2}
              y={s.pane.vol.y + s.pane.vol.h + theme.text.chip.size * 2.2}
              at={T.elsewhere + m.sec(0.3 * k)}
              tone={s.tone}
            />
          </div>
        ))}
        <KeyPoint
          text="Bandingkan, jangan baca angkanya sendirian"
          at={T.average}
          rect={{ x: theme.stage.card.x, y: theme.stage.caption.y - theme.text.title.size, w: theme.stage.card.w, h: theme.text.title.size * 2 }}
        />
      </Stage>
    );
  }

  /* ── SC06 — the two questions, side by side, then joined ────────────── */
  if (f >= T.sc06) {
    const [a, b] = splitRects(GAP);
    return (
      <Stage>
        <Title text="Baca keduanya bersama" at={T.priceWhere} />
        <Panel rect={{ ...a, y: a.y + a.h * 0.14, h: a.h * 0.52 }} at={T.priceWhere} />
        <Panel rect={{ ...b, y: b.y + b.h * 0.14, h: b.h * 0.52 }} at={T.volumeHow} />
        <Line text="HARGA" x={a.x + a.w / 2} y={a.y + a.h * 0.28} at={T.priceWhere} size={theme.text.title.size} weight={theme.text.title.weight} color={theme.color.indigo} />
        <Line text="Ke mana pasar bergerak" x={a.x + a.w / 2} y={a.y + a.h * 0.45} at={T.priceWhere + m.sec(0.3)} />
        <Line text="VOLUME" x={b.x + b.w / 2} y={b.y + b.h * 0.28} at={T.volumeHow} size={theme.text.title.size} weight={theme.text.title.weight} color={theme.color.cyan} />
        <Line text="Seberapa ramai transaksinya" x={b.x + b.w / 2} y={b.y + b.h * 0.45} at={T.volumeHow + m.sec(0.3)} />
        <Words
          text="Selalu baca volume bersama harga"
          x={theme.canvas.width / 2}
          y={theme.stage.card.y + theme.stage.card.h * 0.82}
          at={T.together}
          size={theme.text.display.size}
          weight={theme.text.display.weight}
        />
      </Stage>
    );
  }

  /* ── SC04 — the headcount misreading ────────────────────────────────── */
  if (f >= T.sc04) {
    const [a, b] = splitRects(GAP);
    const box = (r: typeof a) => ({ ...r, y: r.y + r.h * 0.16, h: r.h * 0.5 });
    return (
      <Stage>
        <Title text="Volume bukan jumlah orang" at={T.notPeople} />
        <Panel rect={box(a)} at={T.notPeople} />
        <Panel rect={box(b)} at={T.bigPlayers} />
        <StatStrip
          stats={[
            { label: "Pelaku", value: "100 investor" },
            { label: "Per orang", value: "1.000 lembar" },
            { label: "Volume", value: "100.000", tone: "indigo" },
          ]}
          rect={box(a)}
          at={T.notPeople}
        />
        <StatStrip
          stats={[
            { label: "Pelaku", value: "2 pemain besar" },
            { label: "Per orang", value: "500.000 lembar" },
            { label: "Volume", value: "1.000.000", tone: "indigo" },
          ]}
          rect={box(b)}
          at={T.bigPlayers}
        />
        <Chip
          label="Volume = jumlah orang"
          x={theme.canvas.width / 2}
          y={theme.stage.card.y + theme.stage.card.h * 0.76}
          at={T.notHowMany}
          tone="slate"
          strike={progress(f, T.notHowMany + m.sec(0.5), m.sec(0.5))}
        />
        <Chip
          label="Volume = lembar saham yang diperdagangkan"
          x={theme.canvas.width / 2}
          y={theme.stage.card.y + theme.stage.card.h * 0.9}
          at={T.notHowMany + m.sec(1.2)}
          check
          pill
        />
      </Stage>
    );
  }

  /* ── SC03 — one candle, one volume bar, one period ──────────────────── */
  return (
    <Stage>
      <Card />
      <SourceTag kind={PAIR.kind} y={TAG_Y} />
      <Title text="Apa itu volume?" at={T.pair} />
      <TimeframeTabs
        tabs={["5M", "15M", "1H", "1D", "1W"]}
        active={isFive ? 0 : 3}
        x={theme.stage.card.x + theme.stage.card.w}
        y={theme.stage.card.y - theme.text.chip.size}
        at={T.daily}
        anchor="right"
      />
      <Chart series={PAIR} grid={G} at={T.pair} over={m.sec(1.6)} />
      <VolumeBars bars={PAIR.bars} volume={PAIR_VOL} grid={G} box={VOL} peak={PAIR_PEAK} shown={progress(f, T.pair, m.sec(1.6))} />
      {/* ⚠ THE PAIRING IS DRAWN, NOT SAID. One rule through the candle and its
          own bar is the entire scene: one period, seen twice. */}
      <Crosshair
        grid={G}
        index={PAIR_AT}
        value={PAIR.closes[PAIR_AT]}
        at={T.pair + m.sec(1.8)}
        date={isFive ? "Satu bar = 5 menit" : "Satu bar = 1 hari"}
        rows={[{ label: "Volume", value: "lembar yang diperdagangkan" }]}
      />
      <Words
        text="Berapa banyak lembar saham yang diperdagangkan dalam satu periode"
        x={theme.canvas.width / 2}
        y={theme.stage.caption.y}
        at={T.period}
        size={theme.text.title.size}
        weight={theme.text.title.weight}
        maxWidth={theme.stage.card.w}
      />
    </Stage>
  );
};
