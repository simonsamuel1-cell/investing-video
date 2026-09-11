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
  InstrumentRow, Layer, Level, Line, SpeechBubble, Stage, StatTiles, TickerStrip,
  VolumeBars, Words,
  domainOf, gridOf, fadeOut, price, progress, ramp, sma, ticksOf, GRID_PAD_X,
  theme, useMotion, usePalette,
} from "../../../core";
import { BLOCK, CHART_STYLE, HOPE, INVALID, OPEN, REVERSE, local } from "../data/timing";
import { BUBBLE, DASH, MA } from "../data/layout";
import {
  SETUP, SETUP_BREAK_FROM, SETUP_LEVELS, SETUP_STEPS, SETUP_TREND, SETUP_VOL,
  TICKERS, XYZ,
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
/**
 * What is standing there on frame 0: the setup UP TO its breakout. The four
 * bars that break the level are withheld and printed on the word — see
 * SETUP_BREAK_FROM and OPEN.print — and the rest of the tape is carried into
 * SC02 by `Candles from`.
 */
const HEAD = { ...SETUP, bars: SETUP.bars.slice(0, SETUP_BREAK_FROM) };
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
/** ⚠ SENTENCE CASE, AND SIMON'S WORDING — reproduced, not restyled. */
const ANSWER = "Belum tentu";

/**
 * The white panel, as a clip. `inset()` is written from the EDGES of the frame,
 * which is why it is derived here once rather than in the render — four numbers
 * typed against a card that moves are four numbers that rot.
 */
const CARD_CLIP = (() => {
  const r = theme.stage.card;
  return (
    `inset(${r.y}px ${theme.canvas.width - (r.x + r.w)}px ` +
    `${theme.canvas.height - (r.y + r.h)}px ${r.x}px round ${theme.shape.cardRadius}px)`
  );
})();

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

  /**
   * SC02 steps the window back rather than fading it out — Simon: "window saham
   * ini memudar 50%, lalu bergeser naik ke atas hingga previewnya cuma
   * terlihat 50%". SC04 brings it back, because SC04 is about what the chart
   * did, not about the words over it.
   */
  const quiet = 1 - 0.5 * progress(f, local(REVERSE.fade.at, FROM), REVERSE.fade.over);
  /**
   * ⚠ THE PICTURE PUSHES IN; THE PANEL DOES NOT MOVE. Only what is inside the
   * white card scales, anchored on the card's TOP edge so it grows downward —
   * "ke bagian atas background putihnya". Scaling the card too would make the
   * white rectangle itself lunge at the viewer, which is a different move.
   */
  const push =
    g >= BLOCK.SC04 ? 0 : progress(f, local(REVERSE.zoom.at, FROM), REVERSE.zoom.over);
  /**
   * ⚠ THE QUESTION SITS ON A PRICE LINE — Simon: "buat textnya di atas garis
   * harga". The gridlines belong to the chart, so they are inside the push and
   * move with it; the one to sit above is found AFTER the scale, not before.
   * Typed as a y it would drift the first time the zoom or the domain changed.
   */
  const zoomed = (y: number) =>
    theme.stage.card.y + (y - theme.stage.card.y) * (1 + REVERSE.zoom.by * push);
  const askY = ticksOf([grid.lo, grid.hi])
    .map((v) => zoomed(grid.y(v)))
    .reduce((best, y) =>
      Math.abs(y - theme.canvas.height / 2) < Math.abs(best - theme.canvas.height / 2) ? y : best,
    ) - theme.text.display.size * 0.75;

  /** Everything the setup claimed, leaving on one frame. Back at full for SC04,
   *  which the group is dark in front of. */
  const marks = g >= BLOCK.SC04 ? 1 : 1 - progress(f, local(REVERSE.clear, FROM), m.fade);
  const back = progress(f, local(INVALID.danger, FROM), m.fade);
  const chartOp = g < BLOCK.SC04 ? quiet : 0.28 + 0.72 * back;

  /* SC05 puts the chart behind the words for good. */
  const behind = 1 - progress(f, local(HOPE.hope, FROM), m.fade) * 0.6;

  /** How much of the tape exists on this frame — the number every readout on
   *  the screen is derived from. During SC01 the head is still drawing, so it
   *  is the head's own progress that decides; afterwards `shown` carries it. */
  const build = progress(f, local(OPEN.chart.at, FROM), OPEN.chart.over);
  /**
   * ⚠ LINEAR, AND THAT IS THE WHOLE POINT HERE. Four bars have to land ONE AT
   * A TIME, evenly; on an eased curve the middle two cross their thresholds
   * almost together and read as three candles, not four. (The episode eases
   * everything that MOVES — this is a count of arrivals, not a move.)
   */
  const printed = ramp(f, local(OPEN.print.at, FROM), OPEN.print.over);
  const head = upto(SETUP_BREAK_FROM - 1) + (upto(SETUP_STEPS.open) - upto(SETUP_BREAK_FROM - 1)) * printed;
  /**
   * ⚠ THE HISTOGRAM AND THE READOUT FOLLOW THE SAME NUMBER AS THE CANDLES.
   * `shown` is already at the head's full length during SC01, so a volume pane
   * driven by it drew four bars standing under four candles that had not been
   * printed yet — the withheld breakout, visible in the one place nobody looks.
   */
  const tape = printed >= 1 ? shown : head;
  const seen =
    build < 1
      ? Math.ceil((SETUP_STEPS.open + 1) * build)
      : Math.min(N, Math.ceil(N * tape));
  const R = readout(seen);
  /** The screen's own chrome fades with the chart, never separately — it is
   *  one object. */
  const dash = chartOp * behind;

  /**
   * ⚠ ONE MARK LIT AT A TIME — see OPEN.dim. A mark steps back to 30% when the
   * next one arrives and comes back up on the breakout, where the sentence
   * states all four readings at once. The four chips and the resistance are
   * not in the rotation.
   */
  const turn = (next: number) =>
    g >= BLOCK.SC04 ? 1 : 1 - (1 - OPEN.dim) * progress(f, local(next, FROM), m.fade);

  /**
   * ⚠ THE PLOT'S OWN LEFT EDGE, AS A BAR INDEX. Simon wants the support run
   * back past the first candle — "bukan candlestick paling kiri" — and `Level`
   * spans bar indices, so the edge has to be solved for rather than typed:
   * `gridOf` leaves GRID_PAD_X inside the box, and this is the index whose x
   * lands exactly on it. Typed as a number it would break the first time the
   * plot or the tape changed width.
   */
  const EDGE = -(GRID_PAD_X * (N - 1)) / (L.plot.w - GRID_PAD_X * 2);

  /** ⚠ THE CAPTION ROW, WHICH IS WHAT IT IS FOR — theme.stage.caption is "the
   *  single row of chips between the card and the subtitle band". */
  const checkRow = theme.stage.caption.y;
  const colW = theme.stage.card.w / OPEN.checks.length;

  return (
    <Stage>
      <Card
        rect={theme.stage.card}
        opacity={progress(f, local(OPEN.shell.at, FROM), OPEN.shell.over) * (g < BLOCK.SC04 ? quiet : 1)}
        soft
      />
      {/* ═══ WHAT IS INSIDE THE PANEL ═══ — chrome and tape, as one picture.
          ⚠ CLIP OUTSIDE, SCALE INSIDE. A clip-path on the element that scales
          scales with it and stops matching the panel it is clipping to; the
          clip has to sit on a wrapper that never moves.
          ⚠ AND THE CLIP ONLY EXISTS WHILE THE PUSH DOES. A clipping container
          rasterises the same shapes on a different sub-pixel grid, so leaving
          it on would nudge every frame of SC01 and SC04 for nothing. */}
      <div style={{ position: "absolute", inset: 0, clipPath: push > 0.001 ? CARD_CLIP : undefined }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${(1 + REVERSE.zoom.by * push).toFixed(4)})`,
          transformOrigin: `${theme.canvas.width / 2}px ${theme.stage.card.y}px`,
        }}
      >

      {/* ── the screen's own furniture ─────────────────────────────────────
          ⚠ IT LOADS IN THE ORDER A SCREEN LOADS — strip, rules, header, then
          the tape. Reversed, the chrome reads as decoration added to a chart
          that was already finished. */}
      {CHART_STYLE === "ma" ? (
        <div style={{ opacity: dash }}>
          {/* ⚠ THE TICKER ALONE — Simon: "hapus … 'Saham ABCD'". The name said
              the same thing the code says, one size smaller. */}
          <InstrumentRow
            ticker="ABCD"
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
        {/* ⚠ THE BREAKOUT, PRINTED ON ITS OWN WORD — Simon's f441. Four bars,
            one at a time, the last landing on f464. */}
        {printed > 0.001 && (
          <Candles bars={SETUP.bars} grid={grid} from={SETUP_BREAK_FROM} shown={head} />
        )}
        <Candles bars={SETUP.bars} grid={grid} from={SETUP_STEPS.open + 1} shown={shown} />
        {/* ⚠ THE ONE THING THAT STILL ARRIVES — Simon: "365 muncul volume bar
            nya". The price is already there; the histogram appearing under it
            is what the words "volume menguat" have to land on. */}
        <VolumeBars
          bars={SETUP.bars}
          volume={SETUP_VOL}
          grid={grid}
          box={L.vol}
          shown={tape}
          opacity={progress(f, local(OPEN.vol.at, FROM), OPEN.vol.over) * turn(OPEN.broken)}
        />

        {/* ── the lows' own line, drawn under them ─────────────────────────
            ⚠ TRIMMED, NOT FADED. A trend line that fades on is a line that was
            always there; drawn from its first low to its last it is a reading
            being made. The geometry is SETUP_TREND — measured off the hull of
            the lows, never typed. */}
        {(() => {
          const drawn = progress(f, local(OPEN.trend.at, FROM), OPEN.trend.over);
          if (drawn <= 0.001) return null;
          const x1 = grid.x(SETUP_TREND.from);
          const y1 = grid.y(SETUP_TREND.v0);
          const x2 = grid.x(SETUP_TREND.to);
          const y2 = grid.y(SETUP_TREND.v1);
          const len = Math.hypot(x2 - x1, y2 - y1);
          return (
            <Layer opacity={dash * turn(OPEN.support.at)}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={c.indigo}
                strokeWidth={theme.shape.line}
                strokeLinecap="round"
                strokeDasharray={len}
                strokeDashoffset={len * (1 - drawn)}
              />
            </Layer>
          );
        })()}
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
          /* ⚠ ON THE LEFT — Simon. The right-hand end of this plot is where the
             breakout, the bubble and the newest bars all are; a label there is
             standing in the middle of the story. */
          labelSide="left"
          opacity={marks}
          /* ⚠ IT NEVER RESTYLES — Simon: "garis resistancenya ga usa berubah
             warna dan bentuk". The break is already told by the four candles
             printing through it; saying it a second time in the line's own
             colour made the level look like a different object afterwards. */
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
        {/* ⚠ IT ARRIVES IN SC01 NOW — Simon: "301 tambah 1 garis support di low
            kedua". It is the reason the trade was taken, so it has to be on
            screen while the reason is being given; SC04 does not introduce it,
            it BREAKS it. */}
        {g >= OPEN.support.at && (
          <Level
            value={SETUP_LEVELS.support}
            grid={grid}
            at={local(OPEN.support.at, FROM)}
            over={OPEN.support.over}
            label="Support"
            broken={g >= INVALID.broken}
            /* ⚠ RUN BACK TO THE PLOT'S EDGE — Simon. It used to start on the
               bar that made it, which is truer about where the level came from
               and reads as a line that begins in the middle of a chart. A
               level is a price, and a price is true across the frame. */
            from={EDGE}
            to={Math.min(N - 1, seen + 14)}
            width={theme.shape.line}
            labelSide="left"
            opacity={turn(OPEN.vol.at) * marks}
          />
        )}
      </div>
      </div>
      </div>

      {/* ── SC01 · the four things that made it look complete ───────────────
          ⚠ THEY LEAVE BEFORE THE VERDICT LANDS. The caption row is the only
          band left outside the dashboard, and SC04 ends on a sentence that
          needs it — by then the four chips have been read, struck, and are
          finished. */}
      {g < BLOCK.SC05 && (
      <div style={{ opacity: fadeOut(f, local(INVALID.close, FROM) - m.fade, m.fade) * marks }}>
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

      {/* ── SC01 · the decision, spoken ───────────────────────────────────
          ⚠ A SPEECH BUBBLE, NOT A BUTTON — Simon's shape. A button is an
          instruction; a bubble is somebody saying what they did, which is what
          this scene is about. Still no arrow on the price.

          ⚠ ITS TAIL POINTS DOWN-LEFT, so the box sits above and right of the
          tape it is speaking about — see core/SpeechBubble.tsx. */}
      {g >= OPEN.buy && g < OPEN.bubbleGone && (
        <SpeechBubble
          label="BUY"
          x={L.plot.x + L.plot.w * 0.84 - BUBBLE.w / 2}
          y={L.plot.y + L.plot.h * 0.16 - BUBBLE.h}
          w={BUBBLE.w}
          h={BUBBLE.h}
          at={local(OPEN.buy, FROM)}
        />
      )}
      {/* ⚠ NO STATUS CHIP — Simon: "hapus 'Posisi terbuka'". The bubble already
          says the trade was taken, and a second label saying it again in the
          corner is the frame repeating itself. */}

      {/* ── SC02 · the question, and the answer ─────────────────────────────
          ⚠ UNDER THE WINDOW, IN THE ROOM THE LIFT MADE — Simon: "973 muncul
          text di bawah windownya". Centred between the card's lifted edge and
          the subtitle band, so it sits in that space rather than at some
          distance from it. */}
      {g >= REVERSE.ask && g < BLOCK.SC03 && (
        <>
          <Words
            text="Technical Analysis gagal?"
            x={theme.canvas.width / 2}
            y={askY}
            at={local(REVERSE.ask, FROM)}
            anchor="center"
            size={theme.text.display.size}
            weight={theme.text.display.weight}
            color={c.indigo}
          />
          {/* ⚠ TYPED, NOT REVEALED — Simon. `ramp`, because a typewriter that
              eases speeds up and slows down in the middle of a word. */}
          {g >= REVERSE.notYet && (
            <div
              style={{
                position: "absolute",
                left: theme.canvas.width / 2,
                top: askY + theme.text.display.size * 1.25,
                transform: "translate(-50%, -50%)",
                fontFamily: theme.text.family,
                fontSize: theme.text.display.size,
                fontWeight: theme.text.display.weight,
                color: c.ink,
                whiteSpace: "pre",
              }}
            >
              {ANSWER.slice(
                0,
                Math.floor(
                  ramp(f, local(REVERSE.notYet, FROM), ANSWER.length * REVERSE.perChar) *
                    ANSWER.length,
                ),
              )}
            </div>
          )}
        </>
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
