/**
 * CG-B — SC12 + SC13, the ADMR case. `from 10005 · dur 2311`
 *
 * ONE tape, drawn once. SC12 reads the evidence with everything after the
 * decision date masked; SC13 opens that same mask, three events at a time. If
 * the chart were mounted twice the scene would be saying "here is one chart,
 * and here is another one that agrees with me" — the argument is that the
 * evidence did not change, the reading of it did, and only a carried tape can
 * make that argument.
 *
 * ⚠⚠ THE DATA IS A PLACEHOLDER AND THE SCENE SAYS SO ON SCREEN.
 * `[NEEDS DATA: ADMR daily OHLCV + volume, ~Jan–Jun 2026]`. Until that export
 * lands, `ADMR.kind` is "synthetic" and the chip below is drawn. Swap
 * data/series.ts to `fromOHLC(...)` and three things happen by themselves: the
 * chip disappears, `SourceTag` starts printing the real credit, and the module
 * -load assertions re-check the three events against the actual bars. Nothing
 * in this file changes — but the event INDICES in data/series.ts must be
 * re-derived from the dates, because bar indices do not survive a data swap.
 *
 * ⚠ NO BUY/SELL MARKER, NO TARGET, NO "WHAT TO DO NEXT". Three dated events
 * and what each one did to a piece of evidence. That is the whole scene.
 */
import { useCurrentFrame } from "remotion";
import {
  Candles, Card, Chart, Chip, CrossMark, IndicatorLine, Level, Line, SourceTag, Stage, VolumeBars,
  domainOf, gridOf, progress, theme, useMotion, usePalette,
} from "../../../core";
import { ADMR as V, BLOCK, local } from "../data/timing";
import { ADMR_PANES } from "../data/layout";
import {
  ADMR, ADMR_EVENTS, ADMR_MA100, ADMR_MACD, ADMR_SHAPE, ADMR_TRIANGLE,
  ADMR_UPTREND, ADMR_VOL,
} from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC12;
// ═══════════════════════════════════════════════════════════════════════════

/** ⚠ THE DOMAIN COVERS THE MA100 TOO. Left to the closes alone the average
 *  would run off the top of the pane in the stretch where price has already
 *  fallen away from it — which is exactly the stretch the scene is about. */
const DOMAIN = domainOf([...ADMR.closes, ...ADMR_MA100], ADMR.bars);
const LAST = ADMR.closes.length - 1;
/** The last bar the viewer would have had before 11 Mei. */
const DECIDE = ADMR_EVENTS.breakMa - 1;
/** Bars up to that day — what SC12 is allowed to show. */
const HEAD = { ...ADMR, bars: ADMR.bars.slice(0, DECIDE + 1) };

export const AdmrGroup = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const g = f + FROM;
  const grid = gridOf(ADMR.closes, DOMAIN, ADMR_PANES.price, 0.1, 110);

  /* ── the future, revealed one event at a time ─────────────────────────── */
  /**
   * ⚠ THE FUTURE IS NOT DRAWN AND THEN COVERED — IT IS NOT DRAWN YET.
   *
   * A RevealMask was tried here and it is wrong on a white card: it paints in
   * the PAGE ground, so a grey block sat over the card, and it only covers the
   * price pane — the volume and MACD bars for days the viewer is not supposed
   * to have kept running underneath it. Controlling how far the tape is drawn
   * does the same job for all three panes at once and leaves no seam.
   *
   * SC11 introduces the idea with a fade for exactly this reason: there the
   * chart really is complete first, and the future is taken away.
   */
  const upto = (bar: number) => (bar + 1) / ADMR.bars.length;
  const reached = [...V.events].reverse().find((e) => g >= e.at);
  const stops = [DECIDE, ADMR_EVENTS.breakMa + 1, ADMR_EVENTS.retest + 2, LAST];
  const step = !reached ? 0 : V.events.findIndex((e) => e.tag === reached.tag) + 1;
  /** The event being spoken right now — the caption row holds one at a time. */
  const current = reached;
  const shown =
    step === 0
      ? upto(DECIDE) * progress(f, local(V.chart.at, FROM), V.chart.over)
      : upto(stops[step - 1]) +
        (upto(stops[step]) - upto(stops[step - 1])) *
          progress(f, local(reached!.at, FROM), m.sec(0.9));

  return (
    <Stage>
      <Line
        text="ADMR · Harian"
        x={theme.stage.card.x}
        y={theme.stage.title.y}
        at={local(V.title, FROM)}
        anchor="left"
        size={theme.text.title.size}
        weight={theme.text.title.weight}
      />
      <SourceTag kind={ADMR.kind} label={ADMR.label} />

      <Card rect={theme.stage.card} opacity={progress(f, local(V.chart.at, FROM), m.fade)} soft />

      {/* ⚠ TWO CALLS, ONE TAPE. `Chart` lays the gridlines, the price scale and
          the bars up to the decision day; `Candles from` carries the same tape
          past it as SC13 opens each event. Mounting a second chart would undo
          the group. */}
      <Chart
        series={HEAD}
        grid={grid}
        at={local(V.chart.at, FROM)}
        over={V.chart.over}
        baseline={false}
      />
      <Candles bars={ADMR.bars} grid={grid} from={DECIDE + 1} shown={shown} />
      <VolumeBars bars={ADMR.bars} volume={ADMR_VOL} grid={grid} box={ADMR_PANES.vol} shown={shown} />
      <MacdPane shown={shown} grid={grid} />

      {/* ── SC12's reading ────────────────────────────────────────────────── */}
      <IndicatorLine
        values={ADMR_UPTREND}
        grid={grid}
        at={local(V.uptrend.at, FROM)}
        over={V.uptrend.over}
        tone="tint1"
        dashed
      />
      <IndicatorLine
        values={ADMR_TRIANGLE}
        grid={grid}
        at={local(V.triangle.at, FROM)}
        over={V.triangle.over}
        tone="primary"
      />
      <Level
        value={ADMR_SHAPE.support}
        grid={grid}
        at={local(V.triangle.at, FROM)}
        over={V.triangle.over}
        /* ⚠ THE LABEL GOES WHEN SC13 STARTS MARKING EVENTS ON THE SAME BARS.
           SC12 has already named the line; leaving it there put the word
           straight under the third event's mark. */
        label={g < BLOCK.SC13 ? "SUPPORT" : undefined}
        from={ADMR_SHAPE.lows[0]}
        /* ⚠ STOPS ON THE LAST BAR — Level puts its label at the line's right
           end, and the box's right edge is the price scale's gutter. */
        to={ADMR.bars.length - 1}
        broken={g >= V.events[2].hit}
      />
      {g >= V.ma100.at && (
        <IndicatorLine
          values={ADMR_MA100}
          grid={grid}
          at={local(V.ma100.at, FROM)}
          over={V.ma100.over}
          tone="cyan"
        />
      )}

      {/* ── the evidence, and what SC13 does to it ────────────────────────── */}
      {V.evidence.map((e, i) => {
        /* ⚠ FOUND BY LABEL, NOT BY POSITION. Re-ordering the evidence must
           move the strike with the words, not leave it on whatever is now
           first. */
        const turn = V.turns.find((t) => t.label === e.label);
        const turned = turn && g >= turn.at;
        return (
          <Chip
            key={e.label}
            label={e.label}
            x={theme.stage.card.x + theme.stage.card.w * 0.02}
            y={theme.stage.card.y + theme.stage.card.h * (0.08 + i * 0.1)}
            at={local(e.at, FROM)}
            anchor="left"
            tone={turned ? "slate" : "indigo"}
            strike={turned && turn.strike ? progress(f, local(turn.at, FROM), m.reveal) : 0}
            check={!turned}
            pill
          />
        );
      })}

      {g >= V.rebound && g < BLOCK.SC13 && (
        <Line
          text="TERLIHAT SEPERTI PERSIAPAN REBOUND?"
          x={theme.canvas.width / 2}
          y={theme.stage.caption.y}
          at={local(V.rebound, FROM)}
          size={theme.text.title.size}
          weight={theme.text.title.weight}
        />
      )}

      {/* ── SC13's three dated events ─────────────────────────────────────
          ⚠ A NUMBER ON THE BAR, AND ONE LINE AT A TIME UNDERNEATH.
          Stacked as three chips inside the card they covered the price action
          at exactly the bars they were pointing at — the annotation hid its own
          subject. The mark says WHERE, the line under the card says WHAT, and
          only the event being spoken is on screen. */}
      {g >= BLOCK.SC13 &&
        V.events.map((e, i) => {
          const bar = [ADMR_EVENTS.breakMa, ADMR_EVENTS.retest, ADMR_EVENTS.breakSupport][i];
          const now = current === e;
          /**
           * ⚠ ONLY THE EVENT BEING SPOKEN CARRIES ITS NUMBER.
           *
           * All three fall in the last twenty bars of a 150-bar tape — the
           * break and the retest are three bars apart here and will be ONE bar
           * apart in the real export ("besoknya"). Three numbered marks at
           * once simply pile on top of each other and on the support label.
           * The earlier ones stay as quiet dots, which is what they are by
           * then: evidence already counted.
           */
          return (
            <div key={e.tag} style={{ opacity: now ? 1 : 0.4 }}>
              <CrossMark
                index={bar}
                value={ADMR.closes[bar]}
                grid={grid}
                at={local(e.hit, FROM)}
                label={now ? String(i + 1) : undefined}
                tone={i === 2 ? "primary" : "tint1"}
              />
            </div>
          );
        })}
      {current && g < V.close && (
        <Line
          key={current.tag}
          text={`${V.events.indexOf(current) + 1}. ${current.tag} — ${current.label}`}
          x={theme.canvas.width / 2}
          y={theme.stage.caption.y}
          at={local(current.at, FROM)}
          size={theme.text.title.size}
          weight={theme.text.title.weight}
          color={current === V.events[2] ? theme.color.warn : undefined}
        />
      )}

      {g >= V.close && (
        <Line
          text="KALAU BUKTI BERUBAH, SKENARIO JUGA HARUS BERUBAH."
          x={theme.canvas.width / 2}
          y={theme.stage.caption.y}
          at={local(V.close, FROM)}
          size={theme.text.title.size}
          weight={theme.text.title.weight}
        />
      )}

      {/* ⚠ LAST, SO THE CARD CANNOT PAINT OVER IT. It sat above `<Card>` first
          and was simply invisible. It keys off the series' own `kind`, so it
          cannot be left behind when the real export arrives. */}
      {ADMR.kind !== "market" && (
        <Chip
          label="DATA ADMR BELUM MASUK — TAPE SEMENTARA"
          x={theme.stage.card.x + theme.text.chip.size}
          y={theme.stage.card.y + theme.stage.card.h - theme.text.chip.size}
          at={local(V.title, FROM)}
          anchor="left"
          tone="warn"
          pill
        />
      )}
    </Stage>
  );
};

/** The histogram pane. Its own grid, because it is centred on zero and the
 *  price scale is not. */
const MacdPane = ({ shown, grid }: { shown: number; grid: ReturnType<typeof gridOf> }) => {
  const c = usePalette();
  const box = ADMR_PANES.macd;
  const span = Math.max(...ADMR_MACD.map((v) => Math.abs(v ?? 0)), 1e-9);
  const zero = box.y + box.h / 2;
  const upto = Math.ceil(ADMR_MACD.length * Math.max(0, Math.min(1, shown)));
  return (
    <>
      {/* ⚠ INSIDE THE PANE, NOT ABOVE IT. Above, it landed on the bottom row
          of the volume histogram — three panes in one plot leave no room for a
          label in the gutter between them. */}
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          fontFamily: theme.text.mono,
          fontSize: theme.text.axis.size,
          color: c.muted,
        }}
      >
        MACD HISTOGRAM
      </div>
      <svg
        style={{ position: "absolute", left: 0, top: 0 }}
        width={theme.canvas.width}
        height={theme.canvas.height}
      >
        {ADMR_MACD.slice(0, upto).map((v, i) =>
          v === null ? null : (
            <rect
              key={i}
              x={grid.x(i) - 2}
              y={v >= 0 ? zero - (v / span) * (box.h / 2) : zero}
              width={4}
              height={Math.max(1, (Math.abs(v) / span) * (box.h / 2))}
              /**
               * ⚠ INDIGO / MUTED, NOT GREEN / RED — AND THIS ONE IS OPEN.
               *
               * The standing rule is that only candle bodies carry green and
               * red; everything else is indigo / cyan / neutral. But the voice
               * at f10666 says "MACD histogram sudah hijau", and the evidence
               * chip beside it repeats the word. Drawn in indigo the picture
               * does not say what the sentence says.
               *
               * Taken the conservative way for now: the rule holds, the
               * histogram is indigo above the zero line. The alternative is a
               * one-line change here — the audit exempts core, so a green
               * histogram would live in core/chart, not in this file. Simon's
               * call, and it is in the open items.
               */
              fill={v >= 0 ? c.indigo : c.muted}
            />
          ),
        )}
      </svg>
    </>
  );
};
