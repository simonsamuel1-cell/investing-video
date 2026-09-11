/**
 * CG-A — SC01 · SC02 · SC04 · SC05. `from 0 · dur 4047`
 *
 * ONE tape for the whole opening argument, and that is the argument. The cold
 * open shows a setup that looked complete and then failed; Mistake 01 says
 * "misalnya kamu beli karena support bertahan" — the same support, on the same
 * trade. Mounting a second chart there would quietly turn one story into two
 * examples, and the viewer has no way to notice.
 *
 * So the tape is BUILT IN THREE STAGES on one grid: `Chart` lays the chrome
 * and bars 0–62 in SC01, and `Candles from=63` carries it through the reversal
 * in SC02 and through support in SC04. `from` exists for exactly this.
 *
 * ⚠ IT DRAWS NOTHING BETWEEN 1140 AND 1995. SC03 is the premise, it has no
 * chart, and it is mounted above this group — returning null there is what
 * lets one Sequence span the whole opening without covering it.
 *
 * ═══ IT IS A SCREEN, NOT A PLOT ═══
 *
 * Simon, on f0–1139: "gunakan design dari gambar Chart Dashboard karna
 * sekarang chartnya polos banget". The tape is unchanged — what was missing
 * was everything AROUND it. From the reference: a strip of ticker tiles with
 * the active one inverted, an instrument header whose price and change sit
 * opposite the name, a price scale down the right, a time axis, and a grid of
 * stat tiles. All three are core components now (core/Dashboard.tsx).
 *
 * ⚠ THE READOUT COUNTS WITH THE TAPE. The header price, its change, the active
 * ticker tile and all six stat tiles are read off the bars that EXIST at this
 * frame — not off the finished series. That is the reference folder's second
 * model of continuous motion ("the data advances and the readout counts with
 * it") and it is why the screen is alive during a hold. It also means not one
 * number on it is invented: they are the tape, restated.
 *
 * ⚠ THE DASHBOARD BELONGS TO ALL OF CG-A, not just to the cold open. SC04 and
 * SC05 are the same trade on the same screen; giving the opening a dashboard
 * and the worked example a bare plot would say they are two different charts.
 *
 * ⚠ NO ENTRY ARROW, EVER. "Kamu masuk dengan yakin" is drawn as a button that
 * gets pressed and a status chip that appears — the story's own event. Nothing
 * is ever marked on the price itself. This is the compliance line, not taste.
 */
import { useCurrentFrame } from "remotion";
import {
  Candles, Card, Chart, Chip, DashRule, InstrumentHeader,
  InstrumentRow, Level, Line, Stage, StatTiles, TickerStrip,
  VolumeBars, Words,
  domainOf, gridOf, fadeOut, popIn, price, progress, sma,
  theme, useMotion, usePalette,
} from "../../../core";
import { BLOCK, CHART_STYLE, HOPE, INVALID, OPEN, REVERSE, local } from "../data/timing";
import { DASH, MA } from "../data/layout";
import {
  SETUP, SETUP_LEVELS, SETUP_STEPS, SETUP_SUPPORT_FROM, SETUP_VOL, TICKERS, XYZ,
} from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC01;
// ═══════════════════════════════════════════════════════════════════════════

/** ⚠ ONE DOMAIN FOR THE WHOLE TAPE, computed from every bar of it. Letting the
 *  scale follow the bars drawn so far would re-rule the chart under the
 *  viewer every time a candle arrives. */
const DOMAIN = domainOf(SETUP.closes, SETUP.bars);
const N = SETUP.bars.length;
/** The fraction of the tape that shows bars 0…k. */
const upto = (k: number) => (k + 1) / N;
/** Bars 0–62 — what SC01 draws. The rest is carried by `Candles from`. */
const HEAD = { ...SETUP, bars: SETUP.bars.slice(0, SETUP_STEPS.open + 1) };
/** The 20-bar average, for the last stat tile. Computed once. */
const MA20 = sma(SETUP.closes, 20);
/**
 * ⚠ ONE ALIAS, AND EVERY OVERLAY IN THE SCENE USES IT. The two designs put
 * their plot in different places; a scene that reached for `DASH.plot` by name
 * would quietly keep pointing at the dashboard's box after the lever flipped,
 * and the chips would float over nothing. Only the chrome below knows which
 * design is on — everything else knows only "the plot".
 */
const L = CHART_STYLE === "ma" ? MA : DASH;
const signed = (v: number) => `${v >= 0 ? "+" : "−"}${price(Math.abs(v))}`;

/**
 * Everything the screen says about itself, at THIS frame.
 *
 * ⚠ READ OFF THE BARS THAT EXIST, NOT OFF THE SERIES. `SETUP.closes.at(-1)` is
 * the end of the story; during SC01 the story has not happened yet, and a
 * readout showing it would give the ending away three sentences early.
 */
const readout = (seen: number) => {
  const i = Math.max(0, Math.min(SETUP.closes.length - 1, seen - 1));
  const prev = SETUP.closes[Math.max(0, i - 1)];
  const now = SETUP.closes[i];
  const win = SETUP.bars.slice(0, i + 1);
  return {
    now,
    change: now - prev,
    pct: prev === 0 ? 0 : ((now - prev) / prev) * 100,
    tiles: [
      { label: "Open", value: price(SETUP.bars[0].o) },
      { label: "Tertinggi", value: price(Math.max(...win.map((b) => b.h))) },
      { label: "Terendah", value: price(Math.min(...win.map((b) => b.l))) },
      { label: "Close kemarin", value: price(prev) },
      { label: "Perubahan", value: signed(now - prev) },
      { label: "Rata-rata 20", value: MA20[i] === null ? "—" : price(MA20[i] as number) },
    ],
  };
};

export const SetupGroup = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const g = f + FROM;

  /* ⚠ DARK FOR SC03 — see the header. */
  if (g >= BLOCK.SC03 && g < BLOCK.SC04) return null;

  const grid = gridOf(SETUP.closes, DOMAIN, L.plot, 0.12, L.gutter);

  /* ── the three stages of one tape ─────────────────────────────────────── */
  const p2 = progress(f, local(REVERSE.turn, FROM), m.sec(2.4));
  const p3 = progress(f, local(INVALID.broken, FROM) - m.sec(1.4), m.sec(1.4));
  const shown =
    upto(SETUP_STEPS.open) +
    (upto(SETUP_STEPS.reverse) - upto(SETUP_STEPS.open)) * p2 +
    (upto(SETUP_STEPS.breakdown) - upto(SETUP_STEPS.reverse)) * p3;

  /* SC02 lets the picture go quiet behind its question; SC04 brings it back,
     because SC04 is about what the chart did, not about the words over it. */
  /** ⚠ 0.28, NOT 0.45. The screen has far more on it than the bare plot
   *  did, and a big word over it needs the room. */
  const quiet = fadeOut(f, local(REVERSE.ask, FROM), m.fade) * 0.72 + 0.28;
  const back = progress(f, local(INVALID.danger, FROM), m.fade);
  const chartOp = g < BLOCK.SC04 ? quiet : 0.28 + 0.72 * back;

  /* SC05 puts the chart behind the words for good. */
  const behind = 1 - progress(f, local(HOPE.hope, FROM), m.fade) * 0.6;

  /** How much of the tape exists on this frame — the number every readout on
   *  the screen is derived from. During SC01 the head is still drawing, so it
   *  is the head's own progress that decides; afterwards `shown` carries it. */
  const build = progress(f, local(OPEN.chart.at, FROM), OPEN.chart.over);
  const seen =
    build < 1
      ? Math.ceil((SETUP_STEPS.open + 1) * build)
      : Math.min(N, Math.ceil(N * shown));
  const R = readout(seen);
  /** The screen's own chrome fades with the chart, never separately — it is
   *  one object. */
  const dash = chartOp * behind;

  /** ⚠ THE CAPTION ROW, WHICH IS WHAT IT IS FOR — theme.stage.caption is "the
   *  single row of chips between the card and the subtitle band". */
  const checkRow = theme.stage.caption.y;
  const colW = theme.stage.card.w / OPEN.checks.length;

  return (
    <Stage>
      <Card rect={theme.stage.card} opacity={progress(f, local(OPEN.shell.at, FROM), OPEN.shell.over)} soft />

      {/* ── the screen's own furniture ─────────────────────────────────────
          ⚠ IT LOADS IN THE ORDER A SCREEN LOADS — strip, rules, header, then
          the tape. Reversed, the chrome reads as decoration added to a chart
          that was already finished. */}
      {CHART_STYLE === "ma" ? (
        <div style={{ opacity: dash }}>
          <InstrumentRow
            ticker="ABCD"
            name={XYZ.name}
            x={MA.headX}
            y={MA.headY}
            at={local(OPEN.header, FROM)}
          />
          {/* ⚠ THE INDICATOR PILLS ARE GONE — Simon: "label pill volume dan
              resistance hapus aja". They named what the chart was already
              showing: the histogram IS the volume, and the level carries the
              word "Resistance" at its own right end. Two names for one thing
              is what made the header busy. */}
        </div>
      ) : (
      <div style={{ opacity: dash }}>
        <TickerStrip
          rect={DASH.strip}
          at={local(OPEN.strip.at, FROM)}
          stagger={OPEN.strip.step}
          active={0}
          items={TICKERS.map((t, i) =>
            /* ⚠ THE ACTIVE TILE IS THE TAPE, not a stored number. */
            i === 0
              ? { symbol: t.symbol, price: price(R.now), pct: R.pct }
              : { symbol: t.symbol, price: price(t.price), pct: t.pct },
          )}
        />
        <DashRule
          x={DASH.strip.x}
          y={DASH.rule1}
          w={DASH.strip.w}
          at={local(OPEN.rules.at, FROM)}
          over={OPEN.rules.over}
        />
        <InstrumentHeader
          rect={DASH.header}
          at={local(OPEN.header, FROM)}
          name={XYZ.name}
          sub={XYZ.sub}
          unit={XYZ.unit}
          price={price(R.now)}
          change={signed(R.change)}
          pct={R.pct}
          note="Hari ini"
        />
        <DashRule
          x={DASH.strip.x}
          y={DASH.rule2}
          w={DASH.strip.w}
          at={local(OPEN.rules.at, FROM) + m.reveal}
          over={OPEN.rules.over}
        />
        <StatTiles
          rect={DASH.tiles}
          cols={2}
          at={local(OPEN.tiles.at, FROM)}
          stagger={OPEN.tiles.step}
          stats={R.tiles}
        />
      </div>
      )}

      <div style={{ opacity: dash }}>
        <Chart
          series={HEAD}
          grid={grid}
          at={local(OPEN.chart.at, FROM)}
          over={OPEN.chart.over}
          baseline={false}
          /* ⚠ NO PRICE SCALE — Simon: "tulisan label harganya hapus aja". The
             gridlines stay: they are what makes the tape readable as levels.
             What went is the column of numbers, and with it the reason the
             plot began 150px inside the card. */
          tickLabels={false}
          tickSide={CHART_STYLE === "ma" ? "left" : "right"}
          tickSize={CHART_STYLE === "ma" ? MA.tickSize : undefined}
        />
        <Candles bars={SETUP.bars} grid={grid} from={SETUP_STEPS.open + 1} shown={shown} />
        <VolumeBars bars={SETUP.bars} volume={SETUP_VOL} grid={grid} box={L.vol} shown={shown} />
        {/* ⚠ NO TIME AXIS — Simon: "timeframe 3 bln 2 bln 1 bln sekarang,
            hapus". The story is "it looked complete, then it failed"; how many
            months the tape covers is not part of it. */}

        {/* ⚠ RESTYLED WHEN BROKEN, NOT REDRAWN — `broken` is what core/Level
            takes, and it is the difference between "the level failed" and "a
            different line appeared". */}
        <Level
          value={SETUP_LEVELS.resistance}
          grid={grid}
          at={local(OPEN.resistance.at, FROM)}
          over={OPEN.resistance.over}
          label="Resistance"
          broken={g >= OPEN.broken}
          /* ⚠ IT ENDS ON THE LAST BAR THAT EXISTS, and moves with it. Run to
             the box edge and the label sits on the price scale; pinned to the
             final bar it hangs in empty space until the tape catches up. Level
             puts its label at the line's right end, so the right end has to be
             where the data is — far enough PAST it that the label, which is
             right-aligned on that end, clears the newest candles and stands in
             the empty margin. Six bars was enough on the dashboard's narrower
             plot and not on this one; fourteen clears both. A level projected
             a little way forward is also what a level actually is. */
          to={Math.min(N - 1, seen + 14)}
        />
        {g >= INVALID.support.at && (
          <Level
            value={SETUP_LEVELS.support}
            grid={grid}
            at={local(INVALID.support.at, FROM)}
            over={INVALID.support.over}
            label="Support"
            broken={g >= INVALID.broken}
            /* ⚠ IT STARTS WHERE IT WAS MADE — see SETUP_SUPPORT_FROM. */
            from={SETUP_SUPPORT_FROM}
            to={Math.min(N - 1, seen + 14)}
          />
        )}
      </div>

      {/* ── SC01 · the four things that made it look complete ───────────────
          ⚠ THEY LEAVE BEFORE THE VERDICT LANDS. The caption row is the only
          band left outside the dashboard, and SC04 ends on a sentence that
          needs it — by then the four chips have been read, struck, and are
          finished. */}
      {g < BLOCK.SC05 && (
      <div style={{ opacity: fadeOut(f, local(INVALID.close, FROM) - m.fade, m.fade) }}>
        {OPEN.checks.map((q, i) => (
          <Chip
            key={q.label}
            label={q.label}
            /* ⚠ THE SUPPORT CHIP IS THE ONE SC04 STRIKES. Found by label, not
               by index: re-ordering the row must move the frames with the
               words, not leave the strike on whatever is now third. */
            x={theme.stage.card.x + colW * (i + 0.5)}
            y={checkRow}
            at={local(q.at, FROM)}
            tone={g >= REVERSE.dim ? "slate" : "indigo"}
            check
            /* ⚠ A GREEN DISC WITH A WHITE TICK — Simon. An ink ✓ is the same
               weight as the word it precedes; a filled disc reads as a box
               someone ticked, which is what these four are. */
            checkDisc
            strike={
              q.label === "Support bertahan"
                ? progress(f, local(INVALID.strike, FROM), m.reveal)
                : 0
            }
          />
        ))}
      </div>
      )}

      {/* ── SC01 · the button, pressed ────────────────────────────────────── */}
      {g >= OPEN.buy && g < OPEN.taken && (
        <div
          style={{
            position: "absolute",
            /* ⚠ OVER THE CHART, NOT THE CARD. At 0.16 of the card it landed
               on the instrument header the dashboard now puts there. */
            left: L.plot.x + L.plot.w * 0.84,
            top: L.plot.y + L.plot.h * 0.16,
            transform: `translate(-50%, -50%) scale(${popIn(f, local(OPEN.buy, FROM), m.pop).scale})`,
            opacity: popIn(f, local(OPEN.buy, FROM), m.pop).opacity,
            padding: `${m.sec(0.2)}px ${m.sec(0.62)}px`,
            borderRadius: theme.shape.chipRadius,
            background: c.indigo,
            color: theme.color.onIndigo,
            fontFamily: theme.text.family,
            fontSize: theme.text.chip.size,
            fontWeight: theme.text.chip.weight,
          }}
        >
          BUY
        </div>
      )}
      {g >= OPEN.taken && g < BLOCK.SC04 && (
        <Chip
          label="Posisi terbuka"
          x={theme.stage.active.x}
          y={theme.stage.active.y + theme.text.chip.size}
          at={local(OPEN.taken, FROM)}
          anchor="left"
          tone="slate"
          pill
        />
      )}

      {/* ── SC02 · the question, and the answer ───────────────────────────── */}
      {g >= REVERSE.ask && g < BLOCK.SC03 && (
        <Words
          text={g >= REVERSE.notYet ? "BELUM TENTU." : "TA-NYA GAGAL?"}
          key={g >= REVERSE.notYet ? "b" : "a"}
          /* ⚠ CENTRED ON THE CHART COLUMN, NOT ON THE CANVAS. The dashboard
             puts the stat tiles in the right third, so the frame's middle is
             no longer the middle of what is being read. */
          x={L.plot.x + L.plot.w / 2}
          y={L.plot.y + L.plot.h * 0.5}
          at={local(g >= REVERSE.notYet ? REVERSE.notYet : REVERSE.ask, FROM)}
          anchor="center"
          size={theme.text.display.size}
          weight={theme.text.display.weight}
        />
      )}

      {/* ── SC04 · the reason stops holding ───────────────────────────────── */}
      {/* ⚠ ONE SLOT, HANDED OVER. The chip states what stopped being true and
          then LEAVES so the verdict can land in the same place — two things in
          the card's top strip at once is two headlines, and the caption row
          below is already holding the four evidence chips. */}
      {g >= INVALID.reasonGone && g < INVALID.close && (
        /* ⚠ INSIDE THE PLOT, TOP-LEFT. At 0.13 of the card it is now sitting
           on the ticker strip — the dashboard took that band. The plot's
           upper-left corner is empty here because the tape starts low. */
        <Chip
          label="ALASAN UTAMA TRADE TIDAK BERLAKU"
          x={L.plot.x + theme.text.chip.size}
          y={L.plot.y + theme.text.chip.size}
          at={local(INVALID.reasonGone, FROM)}
          anchor="left"
          tone="warn"
          pill
        />
      )}
      {g >= INVALID.close && g < BLOCK.SC05 && (
        <Line
          text="SETUP MULAI INVALID."
          /* ⚠ THE CAPTION ROW, AFTER THE FOUR CHIPS HAVE GONE. Over the card
             it covered either the close below support or the ticker strip;
             the row below the card is the one band the dashboard did not
             take. */
          x={theme.canvas.width / 2}
          y={theme.stage.caption.y}
          at={local(INVALID.close, FROM)}
          size={theme.text.title.size}
          weight={theme.text.title.weight}
        />
      )}

      {/* ── SC05 · hoping, and then deciding in advance ───────────────────── */}
      {g >= BLOCK.SC05 && <Hope f={f} />}
    </Stage>
  );
};

/**
 * SC05 as its own block. It is the same mount and the same chart underneath —
 * only the words over it change, which is why it is not a separate scene.
 *
 * ⚠ THE TWO QUOTES ARE VERBATIM, CURLY QUOTES AND ALL. They are what Simon
 * corrected in the SRT and they are what the subtitle under them says.
 */
const Hope = ({ f }: { f: number }) => {
  const m = useMotion();
  const g = f + FROM;
  const out = fadeOut(f, local(HOPE.quotesOut.at, FROM), HOPE.quotesOut.over);
  /** ⚠ INSIDE THE PLOT. At 0.32 of the card this row landed on the
   *  instrument header the dashboard now puts there. */
  const mid = L.plot.y + L.plot.h * 0.24;
  /** ⚠ A PILL IS TALLER THAN ITS TYPE. At 2× the chip size the two rows
   *  overlapped by their own padding. */
  const ROW = theme.text.chip.size * 2.6;

  return (
    <>
      {g < HOPE.rail && (
        <div style={{ opacity: out }}>
          {HOPE.quotes.map((q, i) => (
            <Chip
              key={q.text}
              label={q.text}
              x={theme.canvas.width / 2}
              y={mid + i * ROW}
              at={local(q.at, FROM)}
              tone="slate"
              pill
            />
          ))}
        </div>
      )}

      {HOPE.rows.map((r, i) => (
        <Chip
          key={r.text}
          label={r.text}
          x={theme.canvas.width / 2}
          y={mid + i * ROW}
          at={local(r.at, FROM)}
          tone={r.ok ? "indigo" : "slate"}
          check={r.ok}
          strike={r.ok ? 0 : progress(f, local(r.at, FROM) + m.reveal, m.reveal)}
          pill
        />
      ))}

      {g >= HOPE.close && (
        <Line
          text="INVALIDATION DITENTUKAN SEBELUM ENTRY."
          /* ⚠ BELOW THE CARD. Inside it at 0.74 it sat on the volume
             histogram; SC05's caption row is free — the four evidence chips
             belong to SC01–SC04 and have already gone. */
          x={theme.canvas.width / 2}
          y={theme.stage.caption.y}
          at={local(HOPE.close, FROM)}
          size={theme.text.title.size}
          weight={theme.text.title.weight}
        />
      )}
    </>
  );
};
